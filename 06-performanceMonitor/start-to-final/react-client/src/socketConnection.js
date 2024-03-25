import io from 'socket.io-client';
const socket = io.connect('http://localhost:3000'); //server is at 3000
socket.on('welcome', (data)=>{
   console.log(data); 
});

export default socket;