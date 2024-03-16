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
let tickTockInterval;

//on server start, generate initial orbs
//every time one is absorbed, server will make a new one
initGame(); 



io.on('connect', (socket)=>{
    //a socket has connected
    socket.on('init', (playerObj, ackCallback)=>{
        
        //someone is about to be added to players...
        if(players.length === 0){
            tickTockInterval = setInterval(()=>{
                io.to('game').emit('tick', players); //send the event to the 'game' room
            }, 33); //1000/30 === 33.3333
        }

        socket.join('game');    //add this socket to "game" room

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

    //"tock" from client (as in tik-tok)
    socket.on('tock', (data)=>{
        speed = player.playerConfig.speed;
        const xV = player.playerConfig.xVector = data.xVector;   //vector from player to mouse
        const yV = player.playerConfig.yVector = data.yVector;   //vector from player to mouse
    
        //OUT OF BOUNDS: restrict on X -> allow only Y
        if((player.playerData.locX < 5 && xV < 0) || (player.playerData.locX > 500) && (xV > 0)){
            player.playerData.locY -= speed * yV;
        }
        
        //OUT OF BOUNDS: restrict on Y -> allow only X
        else if((player.playerData.locY < 5 && yV > 0) || (player.playerData.locY > 500) && (yV < 0)){
            player.playerData.locX += speed * xV;
        }
        
        //move normally
        else{
            player.playerData.locX += speed * xV;
            player.playerData.locY -= speed * yV;
        }    
    });

    socket.on('disconnect', ()=>{
        //check to see if players is empty.. if so, stop ticking...
        if(players.length === 0){
            clearInterval(tickTockInterval);
        }
    })
    
});

function initGame(){
    //loop defaultNumberOfOrbs times, push orb on array
    for(let i = 0; i < settings.defaultNumberOfOrbs; i++){
        orbs.push(new Orb(settings));
    }
}

module.exports = io;