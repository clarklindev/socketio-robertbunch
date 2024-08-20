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

    document.querySelector('#game-message').innerHTML = `${absorbedData.absorbed} was absorbed by ${absorbedData.absorbedBy}`;
    document.querySelector('#game-message').style.opacity = 1;
    window.setTimeout(()=>{
        document.querySelector('#game-message').style.opacity = 0;
    }, 2000);
});

socket.on('updateLeaderBoard', (leaderBoardArray)=>{
    leaderBoardArray.sort((a,b)=>{
        return b.score - a.score;       //order..
    });
    document.querySelector('.leader-board').innerHTML = "";

    //p for 'player'
    leaderBoardArray.forEach(p=>{
        if(!p.name){
            return;
        }
        document.querySelector('.leader-board').innerHTML += `<li class="leaderboard-player">${p.name} - ${p.score}</li>`;
    })

})