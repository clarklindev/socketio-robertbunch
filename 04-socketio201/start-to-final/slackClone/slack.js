// SERVER

//console logs are output on terminal in vscode

const express = require('express');
const app = express();
const socketio = require('socket.io');

const namespaces = require('./data/namespaces');
const Room = require('./classes/Room');
app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000); //http traffic
const io = socketio(expressServer);  //socket traffic

app.get('/change-ns', (req, res)=>{
    //update namespaces array
    namespaces[0].addRoom(new Room(0, 'deleted articles', 0));
    //let everyone know in this namespaces, that it changed.
    io.of(namespaces[0].endpoint).emit('nsChange', namespaces[0]);
    res.json(namespaces[0]);
});

io.on('connection', (socket)=>{
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


namespaces.forEach((namespace)=>{

    // const thisNs = io.of(namespace.endpoint);
    // thisNs.on('connection', (socket)=>{
    // });

    io.of(namespace.endpoint).on('connection', (socket)=>{
        console.log(`${socket.id} has connected to ${namespace.endpoint}`)
    });
})