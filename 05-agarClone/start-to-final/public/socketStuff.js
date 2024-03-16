//CLIENT

//connect to the socket server
const socket = io.connect('http://localhost:9000');

socket.on('init', (initData)=>{
    console.log('initData: ', initData);
    orbs = initData.orbs;       //see what socketMain.js is sending...SERVER: socket.emit('init', {orbs});
});