//SERVER

//purpose of socketMain.js -> entrypoint for all socket.io stuff
const io = require('../servers').io;

//--------------CLASSES---------------------------
const Player = require('./classes/Player');
const PlayerConfig = require('./classes/PlayerConfig');
const PlayerData = require('./classes/PlayerData');
const Orb = require('./classes/Orb');

const checkForOrbCollisions = require('./checkCollisions').checkForOrbCollisions;
const checkForPlayerCollisions = require('./checkCollisions').checkForPlayerCollisions;

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

const players = [];         //server use only
const playersForUsers = [];     //player data
let tickTockInterval;

//on server start, generate initial orbs
//every time one is absorbed, server will make a new one
initGame(); 



io.on('connect', (socket)=>{
    //a socket has connected
    let player={};

    socket.on('init', (playerObj, ackCallback)=>{
        
        //someone is about to be added to players...
        if(players.length === 0){
            tickTockInterval = setInterval(()=>{
                io.to('game').emit('tick', playersForUsers); //send the event to the 'game' room
            }, 33); //1000/30 === 33.3333
        }

        socket.join('game');    //add this socket to "game" room

        const playerName = playerObj.playerName;
        //make a PlayerConfig object - Player specific data - only player needs to know
        const playerConfig = new PlayerConfig(settings);
        //make a PlayerData object - the data specific to this Player - everyone needs to know
        const playerData = new PlayerData(playerName, settings);
        //Master Player object    
        player = new Player(socket.id, playerConfig, playerData);
        players.push(player);   //server use ONLY
        playersForUsers.push({playerData});
        ackCallback({orbs, indexInPlayers:playersForUsers.length - 1}); //send orbs array back as an acknowledgement function
    });

    //"tock" from client (as in tik-tok)
    socket.on('tock', (data)=>{

        // a tock has been received before the player is setup.
        //this is because client "tock" from setTimeout after disconnect
        if(!player.playerConfig){
            return;
        }
        
        speed = player.playerConfig.speed;
        const xV = player.playerConfig.xVector = data.xVector;   //vector from player to mouse
        const yV = player.playerConfig.yVector = data.yVector;   //vector from player to mouse
    
        //X
        //trying to move left, and they can... OR 
        //trying to move right, and they can...
        if((player.playerData.locX > 5 && xV < 0) || (player.playerData.locX < settings.worldWidth) && (xV > 0)){
            player.playerData.locX += speed * xV;
        }
        
        //Y
        //trying to move up, and they can... OR
        //trying to move down, and they can
        if((player.playerData.locY > 5 && yV > 0) || (player.playerData.locY < settings.worldHeight) && (yV < 0)){
            player.playerData.locY -= speed * yV;
        }
        
        //check for the "tocking" player to hit orbs
        //player.playerData === pData
        //player.playerConfig === pConfig
        const capturedOrbI = checkForOrbCollisions(player.playerData, player.playerConfig, orbs, settings);
        //function returns null if no collision, an index if there is a collision

        //index could be zero if(0){}, so check not null: if(capturedOrbI !== null){}
        //.splice() -> you can specify what to replace the removed item with as a 3rd prop.
        if(capturedOrbI !== null){
            //remove the orb that needs to be replaced (capturedOrbI)
            //add a new Orb
            orbs.splice(capturedOrbI, 1, new Orb(settings));

            //now update the clients with new orb: replace orb at capturedOrbI with newOrb
            const orbData = {
                capturedOrbI,
                newOrb: orbs[capturedOrbI]
            }

            //emit to all sockets playing the game, the orbSwitch event so that it can update orbs...(just the new orb)
            io.to('game').emit('orbSwitch', orbData);
        }

        //check for player collisions of "tocking" player
        //socket.id === playerId
        const absorbData = checkForPlayerCollisions(player.playerData, player.playerConfig,players,playersForUsers,socket.id);
        if(absorbData){
            io.to('game').emit('playerAbsorbed', absorbData);
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