//CLIENT

//connect to the socket server
const socket = io.connect('http://localhost:9000');

//called inside of uiStuff -> .start-game click handler
const init = async ()=>{
    const initOrbs = await socket.emitWithAck('init', {
        playerName: player.name
    });

    console.log('initOrbs: ', initOrbs);
    orbs = initOrbs;       //see what socketMain.js is sending...SERVER: socket.emit('init', {orbs});
    draw();
}

socket.on('tick', (players)=>{
    console.log('players:', players);
});


