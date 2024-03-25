//Where socket.io listeners and (most) emitters

const socketMain = (io)=>{
    io.on("connection", (socket) => {
        /* ... */
        console.log('SERVER: someone connected on worker: ', process.pid);
        socket.emit('welcome', "SERVER: welcome to our cluster driven socket.io server");
    });
}

module.exports = socketMain;