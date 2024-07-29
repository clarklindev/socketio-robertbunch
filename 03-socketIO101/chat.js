
//to make this chat app work, one window should be in incognito mode, they both open http://localhost:8000/chat.html
//what it does: sends messages to server, receive feedback from server

const express = require('express');
const app = express();
const socketio = require('socket.io');

console.log('open http://localhost:8000/chat.html')

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(8000);
// io = the server object in the docs!
const io = socketio(expressServer);


io.on('connection',(socket)=>{
    console.log(socket.id,"has connected")
    //in ws we use "send" method, and it socket.io we use the "emit" method
    // socket.emit('messageFromServer',{data:"Welcome to the socket server!"})
    socket.on('newMessageToServer',(dataFromClient)=>{
        console.log("Data:",dataFromClient);
        io.emit('newMessageToClients',{text:dataFromClient.text});
    })
})