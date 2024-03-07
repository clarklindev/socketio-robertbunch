# Socket.IO

- https://www.udemy.com/course/socketio-with-websockets-the-details/learn/lecture/11946478#overview

## Section 1: introduction

### 1. welcome 
### 2. course overview
### 3. [github link](https://github.com/robertbunch/socketioTheDetails)
### 4. native websockets vs socket.io
- [socketio](https://socket.io/docs/v4/) is a wrapper library for websockets for 2-way real-time communication between browser and server.
- socketio - that provides low-latency, bi-directional, event-based communication
- sockets are persistent connection between client and server (stays connected)

- Additional features (over Websockets)
    - http long-polling fallback (socketio has a heartbeat mechanism periodically checking connection status)
    - automatic reconnection
    - packet buffering
    - acknowledgement - guarantee when events happen
    - broadcasting
    - multiplexing - single connection for multipurposes
- if you using native websockets, you're eventually have to make these features anyway, but there is team of developers maintaining the socketio library

---

## Section 2: Websockets - before socketio
### pre-socketio
    - coding like layers of an onion 
    - underlying technology is websocket api
    - has failover mechanisms
### housekeeping - node/express *(shows how robertbunch uses nodemon)
    - creating project folder
    - install `npm -g nodemon` 
    - run `nodemon *file*`
### tcp/udp and networking 101
    - TCP and IP (TCP/IP) create an environment which allow 2 computers to talk to each other
    - TCP (transport layer) is used instead of UDP/HTTP because it is reliable
    - network packets are streams of data passed between server and client
    - node handles a lot of the packet data
    - layers that make up a packet
        1. Application - http / smtp / ftp
        2. Transport - UDP/TCP
        3. Network - IP
        4. Link - *hardware* wifi, ethernet connection
        5. Physical - cables
    - when communication happens between the layers it happens in a "segment"
    - segment has metadata
    - UDP - unreliable, fast, lightweight (8bytes), connectionless (dont need to create connection first), consistent (without worry for packetloss, out-of-order)
        - gaming (live experience)
    - TCP - reliable, connection based, 3 way handshake before sending data(1. request connection, 2. server responds ok/reject, 3. send data)
        - delivery acknowledgements
        - retransmission of data
        - in-order packet
        - congestion control (using latency)

### networking 201 - what is a socket and why should i care?
    - sockets - how the packet layers interact with each other (this is definition of sockets)
    - 5 layers model (application (http, ftp, ssh), transport (tcp/udp), network (ip), link, physical) 
    - a pc running processes can send data via a port (socket)

- data moves between communication channels
    1. - APP -> header provides metadata about app body
        -> eg. http

    2. - transport layer (TCP) -> header has metadata -> source port, destination port, sequence number (packet position in stream of data)
          -> body will be entire APP layer 

    3. - network layer (IP)  -> header has source IP / destination IP 
        -> body will be entry transport layer
    
    4. - link layer -> header has eg. mac address
        -> body will contain entire Network data
    
    5. - Physical layer -> contains header
        -> data will be whole link layer

- then process is occurs in reverse on destination
    physical -> link -> network -> transport -> app

- a network socket is an open stream of data that gets this (above) passing in and out of it
- client: browser
- server: node
- sockets use TCP

### http vs websockets
- a short overview of native websockets

### native websocket code

#### CLIENTSIDE
    - PROJECT FOLDER: `01-nativeVWs/justWs.html`
    - CLIENT: html/js web socket api
        - https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
        - WebSocket(url, protocol)
        - connecting
        - receiving/sending

```html
<!-- CLIENT-SIDE .html -->
<script>
    // NOTE: its using ws:// because we targeting the websocket server not the express server (http)
    let ws = new WebSocket('ws://localhost:8000');      
    console.log(ws);

    ws.onopen = (event)=>{
        console.log(event);
        ws.send("I'm so excited I'm connected to the server. It's like my country just won the World Cup!")
    }

    ws.onmessage = (message)=>{
        //receives the event...
        console.log(message.data);
    }
</script>
```

#### SERVERSIDE
    - PROJECT FOLDER: `01-nativeVWs/justWsServer.js`
    - SERVER: NODE -> sockets
    - https://github.com/websockets/ws
    - WebSocketServer()
    - will connect to server with ws:// protocol
    - if you check the headers on the server, you get a 101 status code - switching protocols options (changing from 'http' to 'websocket')
    - so data is received via 'http', but swaps to 'ws://' on server
    - data received from client is a buffer that should be converted to string.

```js
// SERVER-SIDE .js

const http = require('http');// http is a core node module
const websocket = require('ws');//ws is a 3rd party module

const server = http.createServer((req, res)=>{
    res.end('I am connected!');
});

const wss = new websocket.WebSocketServer({server});

// wss.on('headers',(headers, req)=>{
//     console.log(headers);
// })

wss.on('connection',(ws,req)=>{
    // console.log(ws);
    ws.send('Welcome to the websocket server!!!');
    ws.on('message',(data)=>{   

        //data is a 'buffer'... which is converted to readable 'string'
        console.log(data.toString());
    });
});

server.listen(8000);
```

---

## Section 3: Socket.io 101 
### socket.io (v4)
### this section explains networking
### Intro
### Why socketio?
    - Websockets -> when user is behind misconfigured proxy, need to handle it
    - Websockets -> server goes down - no automatic reconnection
    - Websockets -> when multiple rooms support required, need multiple connections created (no multiplexing)
    - Websockets -> need to implement acknowledgements
    - Websockets -> need to implement long polling for older browsers...
    - to handle all of the above if you make it yourself, you are re-developing socketio
    - socketio based on engine.io which implements websockets
    - socketio uses websockets whenever it can

### basics of socketio
    - EXERCISE_FILES: `02-socketIO101/`
    - socketio is always run on a server with socketio
    - here we build a basic chat
### pitfall connect/reconnect
    - you shouldnt register event handlers in the connect handler itself, as a new handler will be registered every time the socket reconnects
    ```js
    <!-- BAD -->
    socket.on('connect', ()=>{
        socket.on('data', ()=>{})
    });

    <!-- GOOD -->
    socket.on('conect', ()=>{})
    socket.on('data', ()=>{})
    ```
```html
<!-- client
public/basicTheRightWay.html -->

<!-- socket.io.js is added by the server side: socketio server -->
<script src="/socket.io/socket.io.js"></script>


<script>
    //socket.io.js is going to add the io object the global scope
    // console.log(io);
    const socket = io('http://localhost:8000');
    // console.log(socket);
    socket.on('connect',()=>{
        console.log(socket.id)
        socket.emit('messageFromClient',{data:"Hello, from the browser!"}) 
    })

    socket.on('messageFromServer',(data)=>{
        console.log(data);
    })    

    //note: reconnect is on "socket.io.on()"
    socket.io.on('reconnect',(data)=>{
        console.log('reconnect event!!!')
        console.log(data)
    })

</script>

```

```js
//server
//basics.js
const express = require('express');
const app = express();
const socketio = require('socket.io');

app.use(express.static(__dirname + '/public'));     //render anything in public folder as if its on root url

const expressServer = app.listen(8000); //server listen to port 8000
const io = socketio(expressServer);     //pass socket server the express server

io.on('connection',(socket)=>{
    console.log(socket.id,"has connected")
    //in ws we use "send" method, and it socket.io we use the "emit" method
    socket.emit('messageFromServer',{data:"Welcome to the socket server!"})
    socket.on('messageFromClient',(data)=>{
        console.log("Data:",data);
    })
});

```


## Section 4: Section 2: Make a Slack

## Section 5: Multiplayer Canvas Game (Agar.io)

## Section 6: Advanced Project with React (cluster module / redis adapter)

## Section 7: Admin UI

## Section 8: Supplemental Videos