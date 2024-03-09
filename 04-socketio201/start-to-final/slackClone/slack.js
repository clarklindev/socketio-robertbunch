// SERVER
//console logs are output on terminal in vscode

const express = require('express');
const app = express();
const socketio = require('socket.io')

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000); //http traffic
const io = socketio(expressServer);  //socket traffic

io.on('connection', (socket)=>{
    socket.emit('welcome', 'welcome to the server');

    socket.on('clientConnect', (data)=>{
        console.log(socket.id,"has connected");
    });

    // socket.on('newMessageToServer',(dataFromClient)=>{
    //     console.log("Data:",dataFromClient);
    //     io.emit('newMessageToClients',{text:dataFromClient.text});
    // });
});
