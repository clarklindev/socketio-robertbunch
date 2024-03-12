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
    - PROJECT FOLDER: `02-nativeVWs/justWs.html`
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
    - PROJECT FOLDER: `02-nativeVWs/justWsServer.js`
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
