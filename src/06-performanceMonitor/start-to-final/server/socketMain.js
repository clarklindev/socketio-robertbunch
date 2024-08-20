//Where socket.io listeners and (most) emitters

const socketMain = (io)=>{
    io.on("connection", (socket) => {

        //keep track of macAddress in variable (initially undefined)
        let machineMacAddress;

        /* ... */
        console.log('SERVER: someone connected on worker: ', process.pid);
        socket.emit('welcome', "SERVER: welcome to our cluster driven socket.io server");

        const auth = socket.handshake.auth;
        const token = auth.token;
        console.log('token: ', token);
        if(token === "sdfsdfsdffdhfhgjghjktry5334543asasd"){
            socket.join('nodeClient');      //client is a nodeClient
        }else if(token ==="jdkfjwjhkwffjeasasccccccs3"){
            //valid reactClient
            socket.join('reactClient');      //client is a nodeClient
        }else{
            socket.disconnect();
            console.log('YOU HAVE BEEN DISCONNECTED');
        }

        socket.on('perfData', (data)=>{
            console.log(`ticking...${data}`);
            if(!machineMacAddress){
                machineMacAddress = data.macA;
                //initial connect (first tick or reconnected), will be alive...
                io.to('reactClient').emit('connectedOrNot', {machineMacAddress, isAlive:true});
            }
            io.to('reactClient').emit('perfData', data);
        });

        socket.on('testConnection', (data)=>{
            console.log('data:', data);
        });

        socket.on('secondTest', (data)=>{
            console.log('secondTest:', data);
        });

        socket.on('disconnect', (reason)=>{
            //a nodeClient just disconnected. let frontend know
            io.to('reactClient').emit('connectedOrNot', {machineMacAddress, isAlive:false});
        });
        
    });
}

module.exports = socketMain;