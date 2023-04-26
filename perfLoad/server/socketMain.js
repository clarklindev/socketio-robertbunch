//Where socket.io listeners and (most) emitters

const socketMain = (io)=>{
    io.on("connection", (socket) => {
        const auth = socket.handshake.auth;
        console.log(auth.token);
        if(auth.token === "239rfaiskdfvq243EGa4q3wefsdad"){
            //valid nodeClient
            socket.join('nodeClient'); //this client is a nodeClient, put in appropriate room
        }else if(auth.token === "23jrtiheriufyqwidsf"){
            //valid reactClient
            socket.join('reactClient'); //this client is a reactClient, put in appropriate room            
        }else{
            //you do not belong here. Go away!
            socket.disconnect();
            console.log("YOU HAVE BEEN DISCONNECTED!!!")
        }
        console.log(`Someone connected on worker ${process.pid }`);
        socket.emit('welcome',"Welcome to our cluster driven socket.io server!");

        socket.on('perfData',(data)=>{
            console.log("Tick...");
            console.log(data);
        })

    });
}

module.exports = socketMain;