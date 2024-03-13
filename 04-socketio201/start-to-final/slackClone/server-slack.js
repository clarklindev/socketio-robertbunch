// SERVER
//console logs are output on terminal in vscode

const express = require('express');
const app = express();
const socketio = require('socket.io');
const namespaces = require('./data/namespaces');
const Room = require('./classes/Room');

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000); //http traffic
const io = socketio(expressServer);  //socket tcp traffic gives access to <script src="/socket.io/socket.io.js"></script> in slack.html

io.on('connection', (socket)=>{

    console.log('=============');
    console.log(socket.handshake);

    socket.emit('welcome', 'welcome to the server');
    socket.on('clientConnect', (data)=>{
        console.log(socket.id,"has connected");
        socket.emit('nsList', namespaces);  //send  namespaces to client
    });
    // socket.on('newMessageToServer',(dataFromClient)=>{
    //     console.log("Data:",dataFromClient);
    //     io.emit('newMessageToClients',{text:dataFromClient.text});
    // });
});

// manufactured way to change an ns (without building a huge UI)
app.get('/change-ns', (req, res)=>{
    //update namespaces array
    namespaces[0].addRoom(new Room(0, 'deleted articles', 0));

    //EXPRESS...
    //let everyone know in this namespaces, that it changed.
    io.of(namespaces[0].endpoint).emit('nsChange', namespaces[0]);
    res.json(namespaces[0]);
});

//lesson 35
namespaces.forEach((namespace)=>{
    // const thisNs = io.of(namespace.endpoint);
    // thisNs.on('connection', (socket)=>{
    // });
    io.of(namespace.endpoint).on('connection', (socket)=>{
        console.log(`${socket.id} has connected to ${namespace.endpoint}`);
        //roomObj passed from joinRoom.js - joinRoom()

        //lesson 40 acknowlege functions - ackCallBack()
        socket.on('joinRoom', async (roomObj, ackCallback)=>{
            //need to fetch the history
            const thisNs = namespaces[roomObj.namespaceId];

            //roomInstance 
            const thisRoomObj = thisNs.rooms.find(room=> room.roomTitle === roomObj.roomTitle);

            const thisRoomsHistory = thisRoomObj.history;

            //leave all rooms, because the client can only be in one room
            const rooms = socket.rooms; //returns a Set()

            //you can also create a var i=0, then increment i++
            //as forEach iterates in ascending order
            Array.from(rooms).forEach((room, index)=>{
                //we dont want to leave the sockets personal room which is guaranteed to be first
                if(index !== 0){
                    socket.leave(room);
                }
            });

            //join the room
            //NOTE: roomTitle is coming from CLIENT (Not safe) - do auth so user (socket) has right to join room
            socket.join(roomObj.roomTitle);

            //fetch the number of sockets in this room
            const sockets = await io.of(namespace.endpoint).in(roomObj.roomTitle).fetchSockets();
            const socketCount = sockets.length;

            ackCallback({
                numUsers:socketCount,
                thisRoomsHistory
            });
        });

        socket.on('newMessageToRoom', (messageObj)=>{
            console.log('messageObj:', messageObj);

            //broadcast this to all connected clients in room
            //how can we find out what room this socket is in?
            const rooms = socket.rooms;
            const currentRoom = [...rooms][1];
        
            //send out this messageObj to everyone including the sender
            io.of(namespace.endpoint).in(currentRoom).emit('messageToRoom', messageObj);

            //add this message to this rooms history
            const thisNs = namespaces[messageObj.selectedNsId];
            const thisRoom = thisNs.rooms.find(room=> room.roomTitle === currentRoom);
            console.log(thisRoom);

            //push message on rooms history[] array
            thisRoom.addMessage(messageObj);
        });
    });
});