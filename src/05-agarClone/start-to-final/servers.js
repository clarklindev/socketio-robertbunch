//SERVER

//Agar.io clone
//where the servers are created

const express = require('express');
const app = express();
app.use(express.static(__dirname+'/public'));

const expressServer = app.listen(9000); //http traffic
const socketio = require('socket.io');
const io = socketio(expressServer);  //socket tcp traffic gives access to <script src="/socket.io/socket.io.js"></script> in slack.html

//app organization
//server.js is NOT the entry point, it creates our servers and exports them
module.exports = {
    app,
    io
}