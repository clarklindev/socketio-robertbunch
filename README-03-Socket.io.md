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
        console.log(socket.id);
        socket.emit('messageFromClient',{data:"Hello, from the browser!"}) ;
    });

    socket.on('messageFromServer',(data)=>{
        console.log(data);
    });

    //note: reconnect is on "socket.io.on()"
    socket.io.on('reconnect',(data)=>{
        console.log('reconnect event!!!');
        console.log(data);
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
    console.log(socket.id,"has connected");
    //in ws we use "send" method, and it socket.io we use the "emit" method
    socket.emit('messageFromServer',{data:"Welcome to the socket server!"});
    socket.on('messageFromClient',(data)=>{
        console.log("Data:",data);
    });
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

## README
- so whats happening is you have:
    - server - chat.js
    - client - public/chat.html

run chat.html (localhost:8000/chat.html)
run server (nodemon chat.js)

- client form submits message (emits 'newMessageToServer') to server
- server is listening for this event and broadcasts to all clients:

`io.emit('newMessageToClients',{text:dataFromClient.text});`

- clients listening to "newMessageToClients" receives message and does something with it 