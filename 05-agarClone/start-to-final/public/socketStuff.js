//CLIENT

//connect to the socket server
const socket = io.connect('http://localhost:9000');

//called inside of uiStuff -> .start-game click handler
const init = async ()=>{
    const initData = await socket.emitWithAck('init', {
        playerName: player.name
    });

    setInterval(()=>{
        socket.emit('tock', {
            xVector: player.xVector ? player.xVector : .1,
            yVector: player.yVector ? player.yVector : .1,
        });
        
    }, 33);     //every 33 milliseconds

    orbs = initData.orbs;       //see what socketMain.js is sending...SERVER: socket.emit('init', {orbs, initInPlayers});
    player.indexInPlayers = initData.indexInPlayers;
    draw();
}

//the server sends out the location/data of all players 30times per second
socket.on('tick', (playersArray)=>{
    // console.log('players:', players);
    players = playersArray;
    if(players[player.indexInPlayers].playerData){
        player.locX = players[player.indexInPlayers].playerData.locX;
        player.locY = players[player.indexInPlayers].playerData.locY;
    }
});

socket.on('orbSwitch', (orbData)=>{
    //the server emitted because an orb was absorbed. Replace it in the orbs array.
    orbs.splice(orbData.capturedOrbI, 1, orbData.newOrb);
});

socket.on('playerAbsorbed', (absorbedData)=>{
    console.log('===================');
    console.log('player who was absorbed:', absorbedData.absorbed);
    console.log('player who absorbed another player:', absorbedData.absorbedBy);
});
