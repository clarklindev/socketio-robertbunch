const express = require("express");
const path = require('path');

const app = express();
const socketio = require("socket.io");
const Room = require("./classes/Room");

const namespaces = require("./data/namespaces");

// app.use(express.static(__dirname + "../public")); /path/to/project-root/public
app.use(express.static(path.join(process.cwd(), 'public')));  ///path/to/project-root/public

const port = 9000;
const expressServer = app.listen(port, ()=>{
  console.log('listening on port: ', port);
}); //http traffic

const io = socketio(expressServer); //socket traffic

app.set("io", io);

//manufactured way to change an ns (without building a huge UI)
app.get("/change-ns", (req, res) => {
  //update namespaces array
  namespaces[0].addRoom(new Room(0, "Deleted Articles", 0));
  //let everyone know in THIS namespace, that it changed
  io.of(namespaces[0].endpoint).emit("nsChange", namespaces[0]);
  res.json(namespaces[0]);
});

io.use((socket, next) => {
  const jwt = socket.handshake.query.jwt;
  console.log(jwt);
  if (1) {
    next();
  } else {
    console.log("Goodbye");
    socket.disconnect();
  }
});

io.on("connection", (socket) => {
  // console.log('==================')
  console.log("connected to socket server");
  // console.log(socket.handshake);
  const userName = socket.handshake.query.userName;
  const jwt = socket.handshake.query.jwt;

  socket.emit("welcome", "Welcome to the server.");
  socket.on("clientConnect", (data) => {
    console.log(socket.id, "has connected");
    socket.emit("nsList", namespaces);
  });
});

namespaces.forEach((namespace) => {
  // const thisNs = io.of(namespace.endpoint)
  io.of(namespace.endpoint).on("connection", (socket) => {
    // console.log(`${socket.id} has connected to ${namespace.endpoint}`)

    //NOTE: roomObj - includes information necessary for the server to understand which room the client wants to join, such as namespaceId and roomTitle.
    socket.on("joinRoom", async (roomObj, ackCallBack) => {
      //need to fetch the history
      const thisNs = namespaces[roomObj.namespaceId];

      //thisRoomObj is the server-side representation of the room, fetched from the server's internal data structure - It contains the room's details as they are stored on the server
      const thisRoomObj = thisNs.rooms.find(
        (room) => room.roomTitle === roomObj.roomTitle
      );
      const thisRoomsHistory = thisRoomObj.history;

      //leave all rooms, because the client can only be in one room
      const rooms = socket.rooms;
      // console.log(rooms);
      let i = 0;
      rooms.forEach((room) => {
        //we don't want to leave the socket's personal room which is guaranteed to be first
        if (i !== 0) {
          socket.leave(room);
        }
        i++;
      });

      //join the room!
      // NOTE - roomTitle is coming from the client. Which is NOT safe.
      // Auth to make sure the socket has right to be in that room
      // NOTE: .join(prop) prop can be anything that can identify the room: roomObj.roomTitle or roomObj.roomId
      socket.join(roomObj.roomTitle);
      
      //fetch the number of sockets in this room
      const sockets = await io
        .of(namespace.endpoint)
        .in(roomObj.roomTitle)
        .fetchSockets();
      // console.log(sockets);
      const socketCount = sockets.length;

      ackCallBack({
        numUsers: socketCount,
        thisRoomsHistory,
      });
    });

    socket.on("newMessageToRoom", (messageObj) => {
      console.log(messageObj);
      //broadcast this to all the connected clients... this room only!
      //how can we find out what room THIS socket is in?
      const rooms = socket.rooms;
      const currentRoom = [...rooms][1]; //this is a set!! Not array
      //send out this messageObj to everyone including the sender
      io.of(namespace.endpoint)
        .in(currentRoom)
        .emit("messageToRoom", messageObj);
      //add this message to this room's history
      const thisNs = namespaces[messageObj.selectedNsId];
      const thisRoom = thisNs.rooms.find(
        (room) => room.roomTitle === currentRoom
      );
      console.log(thisRoom);
      thisRoom.addMessage(messageObj);
    });
  });
});
