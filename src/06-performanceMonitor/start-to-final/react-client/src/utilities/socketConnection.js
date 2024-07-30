import io from 'socket.io-client';

const options = {
   auth: {token: 'jdkfjwjhkwffjeasasccccccs3'}
}

const socket = io.connect('http://localhost:3000', options); //server is at 3000
socket.on('welcome', (data)=>{
   console.log('REACT: ', data); 
});

export default socket;