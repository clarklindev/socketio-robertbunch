//SERVER

//purpose of socketMain.js -> entrypoint for all socket.io stuff
const io = require('../servers').io;
const Orb = require('./classes/Orb');

//make an orbs array that will host all 500-5000 non-player orbs
const orbs = [];

//on server start, generate initial orbs
//every time one is absorbed, server will make a new one
initGame();

io.on('connect', (socket)=>{
    socket.emit('init', {orbs});
});

function initGame(){
    //loop 500 times, push orb on array
    for(let i = 0; i < 500; i++){
        orbs.push(new Orb());
    }
}

module.exports = io;