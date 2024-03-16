//SERVER

//purpose of socketMain.js -> entrypoint for all socket.io stuff
const io = require('../servers').io;

//--------------CLASSES---------------------------
const Player = require('./classes/Player');
const PlayerConfig = require('./classes/PlayerConfig');
const PlayerData = require('./classes/PlayerData');
const Orb = require('./classes/Orb');
//-----------------------------------------------------

//make an orbs array that will host all "defaultNumberOfOrbs" non-player orbs
const orbs = [];

//settings
const settings = {
    defaultNumberOfOrbs: 500,   //number of orbs on map
    defaultGenericOrbSize: 5, //smaller than player size
    defaultSpeed: 6,        //player speed
    defaultSize: 6,         //player size
    defaultZoom: 1.5,        //as player gets bigger, zoom out
    worldWidth: 500,
    worldHeight: 500
};

const players = [];

//on server start, generate initial orbs
//every time one is absorbed, server will make a new one
initGame(); 

io.on('connect', (socket)=>{
    //a socket has connected
    socket.on('init', (playerObj, ackCallback)=>{
        const playerName = playerObj.playerName;
        //make a PlayerConfig object - Player specific data - only player needs to know
        const playerConfig = new PlayerConfig(settings);
        //make a PlayerData object - the data specific to this Player - everyone needs to know
        const playerData = new PlayerData(playerName, settings);
        //Master Player object    
        const player = new Player(socket.id, playerConfig, playerData);
        players.push(player);
        
        ackCallback(orbs); //send orbs array back as an acknowledgement function
    });
    
});

function initGame(){
    //loop defaultNumberOfOrbs times, push orb on array
    for(let i = 0; i < settings.defaultNumberOfOrbs; i++){
        orbs.push(new Orb(settings));
    }
}

module.exports = io;