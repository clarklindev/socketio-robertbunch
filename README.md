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
    - EXERCISE_FILES: `03-socketIO101/`
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
### basic chat example
- if you get error running server with nodemon 
`cannot be loaded because running scripts is disabled on this system. For more information, see about_Execution_Policies at https:/go.microsoft.com/fwlink/?LinkID=135170`
FIX:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
```
- io.emit() - all client listener sockets get the message from server
```cmd
nodemon chat.js
```
- then in browser open the url the server is set up to: http://localhost:8000/chat.html


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

### Docs -> Socket Server
- https://socket.io/docs/v4/server-api/
- alternative ways to instantiate Server

### Docs -> Socket options
- https://socket.io/docs/v4/server-options/
- path (server/client must match)
- serveClient
- adapter (out-of-scope)
- parser (out-of-scope)
- connectTimeout (out-of-scope)
- Low-level engine options  (out-of-scope)

### The big 3 (.emit, .on, .connection)
- on("connection") / .on("connect") same
- Namespace - name given to group sockets identified by pathname
### The Client
- "io()" is global
- prop location of server
- io() returns a socket

## Server
- to talk to specific socket: socket.emit()
---

## Section 4: Section 2: Make a Slack
- https://socket.io/docs/v4/namespaces/

- namespaces/namespaces.js - same as chat.js (server - express)
- namespaces/public/namespaces.html - same as chat.html (client)
- namespaces/public/styles.css

- slackClone/public/styles.css - (given)
- slackClone/public/layout.html - (given)
- slackClone/public/slack.html
- slackClone/script.js

### Namespaces & Rooms cheatsheet
- ALL these are server only

Send an event from the server to this socket only:
```js
socket.emit()
socket.send()
```

Send an event from a socket to a room:
NOTE: remember, this will not go to the sending socket
```js
socket.to(roomName).emit()
socket.in(roomName).emit()
```

Because each socket has it's own room, named by it's socket.id, a socket can send a message to another socket:
```js
socket.to(anotherSocketId).emit('hey');
socket.in(anotherSocketId).emit('hey');
```

A namespace can send a message to any room:
```js
io.of(aNamespace).to(roomName).emit()
io.of(aNamespace).in(roomName).emit()
```

A namespace can send a message to the entire namespace
```js
io.emit()
io.of('/').emit()
io.of('/admin').emit()
```

## Project Whiteboarding & Steps (11min06sec)

#### Join main namespace
1. CLIENT -> server : join the main Namespace ('/')
    - lesson 27
2. SERVER -> send back namespace info (manage namespaces) 
    - lesson 28 - populate spaces and rooms from the server
        - fake user/password (requires AUTHENTICATION - out-of-scope for course)
        - nsList - listen for nsList event from server -> returns namespaces
        - server emit "nsList" - send namespaces to client

3. CLIENT -> lesson 28 - update DOM namespace data

#### join 2nd namespace
4. CLIENT -> join 2nd namespace
5. SERVER -> send group (room) info
6. CLIENT -> update DOM with group (room) info
    - update on client: public/script.js use "endpoint" instead of "name" 
        `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`
    - NOTE: `document.getElementsByClassName('namespace')` returns an array-like object that DOM knows how to use...
    - NOTE: `Array.from(document.getElementsByClassName('namespace'))`  converts to object JS knows how to use...
    - for each namespace in dom, when clicked on, replace contents of: `<div className="room-list"></div>`
    - find the ns in nsData with endpoint same as the one user clicked on
    - get room-list div (querySelector returns first found...thats why it works..prob not best way to do this...)
    - loop through each room and add to DOM

    - lesson 31 -> ensure rooms load initially (before user clicks on namespace)
        - move loading of rooms to own file
    - lesson 32 -> cleanup - use localStorage to store last active namespace, if browser refreshes, retrieve from localstorage

#### join group (rooms + namespaces)
7. CLIENT -> join a group (room)
8. SERVER -> send group chat history
9. CLIENT -> update DOM with chat history

#### app listeners
- namespace changes (steps 4-9)
- room changes (7-9)
- new messages: client -> server
- new messages: server -> clients


### Namespaces
- allows Multiplexing -> communication channel that allows you to split the logic of your application over a single shared connection.
- eg. a single TCP connection that can manage the client being in more than one workspace at a time and visa versa on the server.
- socketio benefit over native websocket is multiplexing
- the main namespace is "/"
- the io instance inherits all of its methods: `io.on('connection', ()=>{})` same as `io.of("/").on('connection', ()=>{})`
- io.on('') same as io.of('/').on('')
- io.use('') same as io.of('/').use('')
- io.emit('') same as io.of('/').emit('')

---

### ROOMS
- Rooms are *(server only concept) where sockets on server can join and leave
- ALWAYS REFERS TO SOCKET IN THE SERVER - CLIENT HAS NO IDEA THEY EXIST - Client does not have access to the list of rooms it has joined
- rooms can be used to "broadcast events" to a subset of clients

#### JOINING a room
- use .join(str) where string is name of a room 
```js
// joining and leaving
io.on('connection', (socket)=>{
    socket.join("some room");
})
```

#### BROADCASTING / EMITTING with to() or in()
- use to(str) or in(str) when broadcasting/emitting
```js
io.to('some room').emit('some event');
```

#### EMIT to SEVERAL ROOMS
- here a UNION is performed so if a socket is in more than one room, it will only get the event ONCE
```js
io.to('room1').to('room2').to('room3').emit('some event');
```

### BROADCAST TO A ROOM FROM A GIVEN SOCKET
```js
io.on('connection', (socket)=>{
    socket.to('some room').emit('some event');
});
```

### BROADCAST TO A PARTICULAR DEVICE
```js
io.on('connection', async (socket)=>{
    const userId = await fetchUserId(socket);
    socket.join(userId);
    io.to(userId).emit("hi");
});
```

### DISCONNECTION
- on disconection, sockets "leave" all the channels they were part of automatically.

### Steps 4-6 (lesson 35)
- join 2nd namespace
- send room info
- update dom with room info

#### CLIENT
- browser trying to connect to namespaces  (each a socket)
- always join the main namespace, because thats where the client gets the other namespaces from
- dynamically connect using data we get back from server via nsdata
- steps: 
    1. client connects
    2. CLIENT connected -> emits "clientConnect"
    3. SERVER listens for "clientConnect"
    4. SERVER when it receives "clientConnect", it emits "nsList" which has value namespaces
    5. CLIENT receives nsList, updates DOM, and attaches event listeners
    6. so while its building nsList DOM, its good time to also create the client socket connections by using the namespace data
    7. test: http://localhost:9000/slack.html   should connect and server should give feedback in terminal

#### SERVER
- start up server
```js
nodemon slackClone/slack.js
```
- TODO: for each item, connect to namespace from the data in data/namespaces.js eg. "wiki/", "mozilla/", 'linux/'
- you need a socket for each one..
- but we want to do it dynamically

```js
//SERVER
//slackClone/slack.js
namespaces.forEach((namespace)=>{
    // const thisNs = io.of(namespace.endpoint);
    // thisNs.on('connection', (socket)=>{
    // });
    io.of(namespace.endpoint).on('connection', (socket)=>{
        console.log(`${socket.id} has connected to ${namespace.endpoint}`)
    });
})
```

```js
//CLIENT
//populate namespaces
//...

    nsData.forEach((ns)=>{
        namespacesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`;

        // join the namespace with io()
        io(`http://localhost:9000${ns.endpoint}`)
    });

```

### lesson 36 whiteboarding - performance thinking
- instead of http way of doing things, when namespaces change or things update, the server notifies the sockets of the change.


#### SERVER -manufactured way to change a ns (without building a UI)
1. - update namespaces on server (add room)
2. - let everyone in this namespace know a change occured: 'nsChange'

```js
//SERVER
//slack.js 
const Room = require('./classes/Room');
const namespaces = require("./data/namespaces");
app.get('/change-ns', (req, res)=>{
    res.json('page hit!');
    //update namespaces array
    namespaces[0].addRoom(new Room(0, 'deleted articles', 0));
    //let everyone know in this namespaces, that it changed.
    io.of(namespaces[0].endpoint).emit('nsChange', namespaces[0]);
    res.json(namespaces[0]);
});
```

### lesson 37 implementing nsChange and express route -> io.emit
- NOTE: this video -> Robert shows how to do it the wrong way by registering an event "nsChange" inside an io event "nsList"
- everytime the event gets triggered (eg. server restart - causes client to disconnect, which will trigger a reconnect "nsList"), this will create a new registered listener ("nsChange") 

### lesson 38 add checks to see if namespace exists or if listeners exists:
1. Test: http://localhost:9000/slack.html
2. make sure on terminal (only 4 connections)
3. make a change on scripts.js (Client)
4. make sure on terminal (only 4 connections (same as first time))
5. localhost:9000/change-ns
6. ensure only single (BROWSER CONSOLE) "namespace changed" event 

### lesson 38 FIX 1 - create nameSpaceSockets[]
- create nameSpaceSockets[] array outside scope of nsData.forEach((ns)=>{});
- sockets should be put into this array, at the index of their ns.id

### lesson 38 FIX 2 - create event listeners array
- array stores listeners and only creates listeners if it doesnt exist yet

```js
//scripts

//lesson 38 FIX 1 sockets will be put into this array, in the index of their ns.id
const nameSpaceSockets = [];

//lesson 38 FIX 2 listeners
const listeners = {
    nsChange: []
}

const addListeners = (nsId)=>{
    if(!listeners.nsChange[nsId]){
        nameSpaceSockets[nsId].on('nsChange', (data)=>{
            console.log("NAMESPACE CHANGED");
            console.log(data);
        })
        listeners.nsChange[nsId] = true;
    }
    else{
        //nothing to do - listeners exist
    }
}

socket.on('nsList', (nsData)=>{
    const lastNs = localStorage.getItem('lastNs');

    console.log('nsData: ', nsData);
    const namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML = "";

    //populate namespaces
    nsData.forEach((ns)=>{
        namespacesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`;

        //ns.id (from Namespace() instance)
        //initialize thisNs as its index in nameSpaceSockets
        //if the connection is new, this will be null
        //if the connection has already been established, it will reconnect and remain in its spot.
        if(!nameSpaceSockets[ns.id]){
            // join the namespace with io()
            // thisNs = io(`http://localhost:9000${ns.endpoint}`);
            nameSpaceSockets[ns.id] = io(`http://localhost:9000${ns.endpoint}`);
        }
        
        addListeners(ns.id);
    });
});
```

## Section 5: Multiplayer Canvas Game (Agar.io)

## Section 6: Advanced Project with React (cluster module / redis adapter)

## Section 7: Admin UI

## Section 8: Supplemental Videos