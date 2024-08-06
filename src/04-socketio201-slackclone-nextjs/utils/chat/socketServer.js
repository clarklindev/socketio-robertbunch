import { Server } from "socket.io";
import namespaces from "@/data/chat/namespaces";

export function initializeSocketServer(server) {
  const io = new Server(server);
  server.io = io; // Assign the io instance to server: res.socket.server.io

  //set up connection event handlers
  io.on("connection", (socket) => {
    console.log(socket.handshake);
    socket.emit("message", "Welcome to the server!");

    socket.on("clientConnect", (data) => {
      console.log(socket.id, "has connected");
      socket.emit("nsList", namespaces); //send  namespaces to client
    });

    socket.on("newMessageToServer", (dataFromClient) => {
      console.log("Data:", dataFromClient);
      io.emit("newMessageToClients", { text: dataFromClient.text });
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}

export function initializeSockets() {
  //lesson 35
  namespaces.forEach((namespace) => {
    // const thisNs = io.of(namespace.endpoint);
    // thisNs.on('connection', (socket)=>{
    // });

    // io.of(namespace.endpoint) -> initializes a namespace in Socket.IO.
    //'.of(namespace.endpoint)' -> creates or retrieves a namespace based on the namespace and endpoint
    io.of(namespace.endpoint).on("connection", (socket) => {
      console.log(`${socket.id} has connected to ${namespace.endpoint}`);
      //roomObj passed from joinRoom.js - joinRoom()

      //lesson 40 acknowlege functions - ackCallBack()
      socket.on("joinRoom", async (roomObj, ackCallback) => {
        //need to fetch the history
        const thisNs = namespaces[roomObj.namespaceId];

        //roomInstance
        const thisRoomObj = thisNs.rooms.find(
          (room) => room.roomTitle === roomObj.roomTitle
        );

        const thisRoomsHistory = thisRoomObj.history;

        //leave all rooms, because the client can only be in one room
        const rooms = socket.rooms; //returns a Set()

        //you can also create a var i=0, then increment i++
        //as forEach iterates in ascending order
        Array.from(rooms).forEach((room, index) => {
          //we dont want to leave the sockets personal room which is guaranteed to be first
          if (index !== 0) {
            socket.leave(room);
          }
        });

        //join the room
        //NOTE: roomTitle is coming from CLIENT (Not safe) - do auth so user (socket) has right to join room
        socket.join(roomObj.roomTitle);

        //fetch the number of sockets in this room
        const sockets = await io
          .of(namespace.endpoint)
          .in(roomObj.roomTitle)
          .fetchSockets();
        const socketCount = sockets.length;

        ackCallback({
          numUsers: socketCount,
          thisRoomsHistory,
        });
      });

      socket.on("newMessageToRoom", (messageObj) => {
        console.log("messageObj:", messageObj);

        //broadcast this to all connected clients in room
        //how can we find out what room this socket is in?

        // socket.rooms is a property that contains a Set-like object listing all rooms (including the default room) that the socket is currently joined to.
        // By default, a socket is always joined to its own room, identified by its socket.id.
        // [...rooms] converts the rooms Set-like object into an array. This is done to easily access individual elements of the Set.
        // Sets do not support direct indexing like arrays (rooms[1] wouldn't work directly on a Set).
        // The first element ([0]) is typically the socket's own room, identified by its socket.id.
        // The second element ([1]) is often the specific room the socket has joined.

        const rooms = socket.rooms;
        const currentRoom = [...rooms][1];

        //send out this messageObj to everyone including the sender
        io.of(namespace.endpoint)
          .in(currentRoom)
          .emit("messageToRoom", messageObj);

        //add this message to this rooms history
        const thisNs = namespaces[messageObj.selectedNsId];
        const thisRoom = thisNs.rooms.find(
          (room) => room.roomTitle === currentRoom
        );
        console.log(thisRoom);

        //push message on rooms history[] array
        thisRoom.addMessage(messageObj);
      });
    });
  });
}
