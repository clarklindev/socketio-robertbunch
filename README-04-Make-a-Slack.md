## Section 4: Make a Slack
- https://socket.io/docs/v4/namespaces/

- namespaces/namespaces.js - same as chat.js (server - express)
- namespaces/public/namespaces.html - same as chat.html (client)
- namespaces/public/styles.css

- slackClone/public/styles.css - (given)
- slackClone/public/layout.html - (given)
- slackClone/public/slack.html
- slackClone/script.js

### Namespaces & Rooms cheatsheet (lesson 25)
- ALL these are server only

#### Send an event from the server to this socket only:
```js
socket.emit();
socket.send();
```

#### Send an event from a socket to a room:
NOTE: remember, this will not go to the sending socket
```js
socket.to(roomName).emit();
socket.in(roomName).emit();
```

#### Because each socket has it's own room, named by it's socket.id, a socket can send a message to another socket:
```js
socket.to(anotherSocketId).emit('hey');
socket.in(anotherSocketId).emit('hey');
```

#### A namespace can send a message to any room:
```js
io.of(aNamespace).to(roomName).emit();
io.of(aNamespace).in(roomName).emit();
```

#### A namespace can send a message to the entire namespace
```js
io.emit();
io.of('/').emit();
io.of('/admin').emit();
```

## Project Whiteboarding & Steps (lesson 26 11min06sec)

### JOIN A NAMESPACE
#### STEP 1: Join main namespace
CLIENT -> server : join the main Namespace ('/')
    - lesson 27

#### STEP 2: send back namespace info
SERVER -> send back namespace info (manage namespaces) 
    - lesson 28 - populate spaces and rooms from the server
        - fake user/password (requires AUTHENTICATION - out-of-scope for course)
        - nsList - listen for nsList event from server -> returns namespaces
        - server emit "nsList" - send namespaces to client

#### STEP 3: update DOM namespace data
CLIENT -> lesson 28 - update DOM namespace data

---
### JOIN 2nd NAMEPSACE
#### STEP 4: join 2nd namespace
CLIENT -> join 2nd namespace

#### STEP 5: server send room info
SERVER -> send room info

#### STEP 6: update DOM with room info
CLIENT -> update DOM with group (room) info
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

---

### JOIN ROOM (rooms + namespaces) 

#### STEP 7: CLIENT -> join a room (room)
#### STEP 8: SERVER -> send group chat history
#### STEP 9. CLIENT -> update DOM with chat history

---

#### app listeners
- namespace changes (steps 4-9)
- room changes (7-9)
- new messages: client -> server
- new messages: server -> clients


### Namespaces (lesson 32)
- allows Multiplexing -> communication channel that allows you to split the logic of your application over a single shared connection.
- eg. a single TCP connection that can manage the client being in more than one workspace at a time and visa versa on the server.
- socketio benefit over native websocket is multiplexing
- the main namespace is "/"
- the io instance inherits all of its methods: `io.on('connection', ()=>{})` same as `io.of("/").on('connection', ()=>{})`
- io.on('') same as io.of('/').on('')
- io.use('') same as io.of('/').use('')
- io.emit('') same as io.of('/').emit('')

---

### ROOMS (lesson 34)
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
---
### 39 - Joining a room (step 7-9)
7. join room
8. send chat history
9. update DOM with chat history
 
### 40 - Acknowledgements (Acknowledge functions)
- events are great but in some cases you want a more classic request/response API in socketIO. this feature is named Acknowledgements 
- req/response like http but with TCP
- you can add a callback as the last argument of the emit() 
- this callback will be called once the other side (SERVER calls callback()) acknowledges the event.

#### Client
- client has cb function `(response)=>{}` (last prop of emit)

```js
//client
socket.emit("update item", "1", { name: "updated" }, (response) => {
  console.log(response.status); // ok
});
```

#### Server
- server does its thing then calls callback()

```js
//server
io.on("connection", (socket) => {
  socket.on("update item", (arg1, arg2, callback) => {
    console.log(arg1); // 1
    console.log(arg2); // { name: "updated" }
    callback({
      status: "ok"
    });
  });
});
```
#### .fetchSockets()
- use .fetchSockets() fetch the number of sockets in this room (get count)

```js
async ()=>{
    //fetch the number of sockets in this room
    const sockets = await io.of(namespace.endpoint).in(roomTitle).fetchSockets();
    const socketCount = sockets.length;
    ackCallBack({
        numUsers:socketCount
    });
}
```

#### leave a room 
- there is a sockets.rooms to get the rooms a socket is in, `socket.leave(room)`
- then you loop through and leave each room
- leave all rooms before joining (except own room) - 
    because socket's personal room is guaranteed to be first
- ie. - client can only be in one room (our own restriction..)

#### DEMO
- the exercise proves that user first leaves a room before joining another

1. window 1 - join a room A
2. window 2 (incognito) - join a room A
count should be 2
3. window 2 (incognito) - join room B
4. if you click on window 1, room A count should be 1 AND if in window 1 click on room B, count should be 2,
and click again on room A, count should be 1
5. on window 2, clicking room B, count should be 1

```js
const rooms = socket.rooms; //returns a Set()

Array.from(rooms).forEach((room, index)=>{
    if(index !== 0){
        socket.leave(room);
    }
}) //a Sets() forEach does not have an iterator, convert with Array.from()

```

### lesson 40 - emitWithAck() ie no callback / using async (since socketio v4.6.0)

```js
const joinRoom =  async (roomTitle, namespaceId)=>{

    const ackResp = await nameSpaceSockets[namespaceId].emitWithAck('joinRoom', roomTitle);
    
    console.log(ackResp); // {numUsers: 1}

    document.querySelector('.curr-room-text').innerHTML = roomTitle;
    
    document.querySelector('.curr-room-num-users').innerHTML = `${ackResp.numUsers}<span class="fa-solid fa-user"></span>`;
}
```

### 42. emit messages to room - (steps 7-9 continued)
- on the slack UI, there is a message input field to send messages to others in room 
`<form id="message-form"><input id="user-message" type="text"/></form>`
- need to add submit handler to form

TODO:
1. need to know the message (from input)
2. need to know the connected namespace (need the index - so we can emit from that socket)
3. CLIENT: create a global variable selectedNsId (if possible state management.. to track the selected namespace)
4. in joinNs() set selectedNsId = clickedNs.id;

5. CLIENT: submit form
6. SERVER: awaiting for message since it connected...

QUESTION: how can we find out what room this socket is in?
ANSWER: 
    - 0 index is sockets personal room
    - 1 index is ALWAYS what room this socket is in
7. SERVER: send out this messageObj to everyone including the sender
8. CLIENT: addListeners job is to manage all listeners added to all namespaces. this prevents listeners being added multiple times

```js
//CLIENT: client-scripts.js
const nameSpaceSockets = [];
let selectedNsId = 0;

//add a submit handler for our form
document.querySelector('#message-form').addEventListener('submit', (e)=>{
    //keep the browser from submitting
    e.preventDefault();

    //get value from input
    const newMessage = document.querySelector('#user-message').value; //<input id="user-message" type="text" placeholder="Enter your message" />
    console.log(newMessage, selectedNsId);

    //FROM the namespace emit a message
    nameSpaceSockets[selectedNsId].emit('newMessageToRoom', {
        newMessage,
        date: Date.now(),
        avatar: 'https://via.placeholder.com/30',
        userName
    })
});

//client addListeners job is to manage all listeners added to all namespaces
//this prevents listeners being added multiple times
const addListeners = (nsId)=>{
    //lesson 42 - emit messages to room
    if(!listeners.messageToRoom[nsId]){
        //add the nsId listener to this namespace
        nameSpaceSockets[nsId].on('messageToRoom', (messageObj)=>{
            console.log(messageObj);
        })
        listeners.messageToRoom[nsId] = true;
    }
}


//generating rooms externalized to own file "joinNs.js"
//user clicks on a namespace
socket.on('nsList', (nsData)=>{

    Array.from(document.getElementsByClassName('namespace')).forEach((element)=>{
        element.addEventListener('click', ()=>{
            joinNs(element, nsData);
        })
    });

});

```

- set the selectedNsId to the clicked namespace  
```js
//joinNs.js
const joinNs = (element, nsData)=>{
    const nsEndpoint = element.getAttribute('ns');  //gets ns="" attribute 

    //find the ns (returns Namespace instance) in nsData with endpoint same as the one user clicked on
    const clickedNs = nsData.find(row=> row.endpoint === nsEndpoint);
    
    //global- so we can submit message to the right place
    selectedNsId = clickedNs.id;
}
```

```js
//SERVER
socket.on('newMessageToRoom', (messageObj)=>{
    console.log('messageObj:', messageObj);
    //sever should broadcast to all sockets in this room
    //how can we find out what room this socket is in?
        //0 index is sockets personal room
        //1 index is ALWAYS which room socket is in
    const rooms = socket.rooms;
    const currentRoom = [...rooms][1];  //MUST USE spread as rooms is a Set() and has no index, convert to array first.

    //send out this messageObj to everyone including the sender
    io.of(namespace.endpoint).in(currentRoom).emit('messageToRoom', messageObj);
});
```
### 43. Slack - Sending the history - (Steps 7-9 continued)
- make the message html dynamic call this (CLIENT): `document.querySelector('#messages').innerHTML += buildMessageHtml(messageObj);`
- call buildMessageHtml(messageObj)
- CLIENT: add "selectedNsId" to messageObj 
    ```js
    //client-scripts.js
    nameSpaceSockets[selectedNsId].emit('newMessageToRoom', {
        newMessage,
        date: Date.now(),
        avatar: 'https://via.placeholder.com/30',
        userName,
        selectedNsId,
    });
    ```
- SERVER: add message to history `socket.on('newMessageToRoom', messageObj=>{})`
- SERVER: find the room via namespace by matching currentRoom
- SERVER: add message to room (adds to history)
- SERVER: ensure history updates - history comes with initial load, but it needs to update when changing rooms

```js
//SERVER - server-slack.js
socket.on('newMessageToRoom', messageObj=>{
    
    //...
    const currentRoom = [...rooms][1];

    //send out messageObj
    io.of(namespace.endpoint).in(currentRoom).emit('messageToRoom', messageObj);

    //add this message to this rooms history
    const thisNs = namespaces[messageObj.selectedNsId];
    const thisRoom = thisNs.rooms.find(room=> room.roomTitle === currentRoom);
    console.log(thisRoom);

    //push message on rooms history[] array
    thisRoom.addMessage(messageObj);
});
```

```js
//CLIENT
//client-scripts.js
const buildMessageHtml = (messageObj)=>{
return `
    <li>
    <div class="user-image">
        <img src="${messageObj.avatar}"/> 
    </div>
    <div class="user-message">
        <div class="user-name-time">${messageObj.userName} <span>${new Date(messageObj.date).toLocaleString()}</span></div>
        <div class="message-text">${messageObj.newMessage}</div>
    </div>
</li>    
`;
}
```

### joinRoom
- update so you send object instead of roomTitle: {roomTile, nameSpaceId}
- server-slack.js update "joinRoom" handler to receive object - roomObj
- externalize buildHTML() into its own file "buildMessageHTML.js"

```js
//joinRoom.js
const joinRoom =  async (roomTitle, namespaceId)=>{

    const ackResp = await nameSpaceSockets[namespaceId].emitWithAck('joinRoom', {roomTitle, namespaceId});
    
    console.log(ackResp); // {numUsers: 1, thisRoomsHistory}
 
    document.querySelector('.curr-room-text').innerHTML = roomTitle;
    document.querySelector('.curr-room-num-users').innerHTML = `${ackResp.numUsers}<span class="fa-solid fa-user"></span>`;

       //we also get back thisRoomsHistory in ackResp
    document.querySelector('#messages').innerHTML = '';

    ackResp.thisRoomsHistory.forEach(message=>{
        document.querySelector('#messages').innerHTML += buildMessageHtml(message);
    });
}

```

- SERVER: with the adjustments - can and need to fetch using roomObj ("namespaceId")
- SERVER: go through the rooms stored in this namespace, find a room (roomTitle) which is equal to the joinRoom roomObj.roomTitle prop
- SERVER: then pass thisRoomsHistory into the callback ackCallback()
- CLIENT: from ackResp -> thisRoomsHistory received 
```js
//SERVER
namespaces.forEach((namespace)=>{
    io.of(namespace.endpoint).on('connection', (socket)=>{
        
        // socket.on('joinRoom', async (roomTitle, ackCallback)=>{
        // });

        //UPDATE: receive an object with roomTitle AND namespaceId
        socket.on('joinRoom', async (roomObj, ackCallback)=>{
            //need to fetch history
            const thisNs = namespaces[roomObj.namespaceId];

            //roomInstance 
            const thisRoomObj = thisNs.rooms.find(room=> room.roomTitle === roomObj.roomTitle);

            const thisRoomsHistory = thisRoomObj.history;

            //...

            ackCallback({
                numUsers:socketCount,
                thisRoomsHistory
            });

        });

    });
});
```

### 44 passing query data on connection (basic auth)

- query parameters can be provided - either with the query option or directly in the url eg. `http://localhost/users?token=abc`
- SERVER: additional query parameters (then found in 'socket.handshake.query' object on server)
- BUT...this is bad when you put username and password in query
- FIX: socket options has "auth" since socketio v3.0.0 - purpose -> when credentials are sent when accessing a namespace.

#### CLIENT
```js
//example
const clientOptions = {
    reconnectionDelayMax: 1000,
    auth: {
        token: "123",
        username,
        password
    },
    query:{
        "my-key":"my-value",
        userName, 
        password
    }
}

const socket = io('ws://example.com/my-namespace', clientOptions);
```

#### SERVER
```js
io.on('connection', (socket)=>{
    console.log(socket.handshake.query);
})
```