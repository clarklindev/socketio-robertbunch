## ENVIRONMENT VARIABLES

### (CLIENT + SERVER) REQUIRED

- `SERVER_PORT`:
  This is crucial for the server. It defines which port the server will listen on for incoming connections. In your case, you’ve set SERVER_PORT=3000, so your server will listen on port 3000 for incoming HTTP requests.

### CLIENT REQUIRED

- `SERVER_URL`:
  This is typically used by the client to know the URL of the server to connect to. For server-side code, you generally don’t need to specify SERVER_URL unless you are using it for some specific internal purposes or configurations.

### SERVER REQUIRED

- `FRONTEND_URL`:
  This is used to configure CORS (Cross-Origin Resource Sharing) on the server. It tells the server which origin (frontend URL) is allowed to make requests to it. This is important for security to ensure that only trusted origins can access your server’s resources.

- `FRONTEND_PORT`:
  This works in conjunction with FRONTEND_URL to specify the complete origin (e.g., http://localhost:3000). It helps define the exact port where the frontend application is running. The server uses this to allow or deny requests based on the origin.

## Populating Database (Namespace and Rooms)

- created mongoose models for Namespace and Room and Message.
- after initiating mongodb via mongoose you have ability to add Namespaces, Rooms via POSTMAN
- the server is now able to get the namespaces directly from the db

### Namespace

```js
//USE server API and POST body:
fetch("http://localhost:3000/api/namespaces", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    data: {
      name: "My New Namespace",
      image: "http://example.com/image.jpg",
      endpoint: "/my-new-namespace",
    },
  }),
});
```

## Rooms

```js
fetch("http://localhost:3000/api/namespaces/add-room", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    namespaceId: "64b06d3e3a99a5e8c89f30e2", // Example ObjectId
    roomData: {
      roomTitle: "General",
      privateRoom: false,
      // history: [],
    },
  }),
});
```

---

## SERVER

```js
io.on("connection", (socket) => {
  //...
  socket.emit("welcome", "");

  socket.on("clientConnect", async (data) => {
    //...
    socket.emit("nsList", namespaces);
  });

  socket.on("newMessageToServer", (dataFromClient) => {
    io.emit("newMessageToClients", { text: dataFromClient.text });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

//for each namespace
namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on("connection", (socket) => {
    // const thisNs = io.of(namespace.endpoint)
  });
});
```

## SOCKETS

```js
export function initializeNamespaceSockets() {
  namespaces.forEach((namespace) => {
    io.of(namespace.endpoint).on("connection", (socket) => {});
  });
}
```

- `io.of(namespace.endpoint).on("connection", (socket) => {});`

  - socket server (io) - .of(namespace.endpoint) method is used to get a namespace object and listen for "connection",
  - receives socket -> work with the socket
  - NOTE: use `io.of(namespace.endpoint)` for interacting with the Socket.IO namespace directly,
  - NOTE: use `namespaces[roomObj.namespaceId]` when you need access to custom namespace-related data.

  ### NOTE: roomObj

  - includes information necessary for the server to understand which room the client wants to join, such as namespaceId and roomTitle.

  ### NOTE: thisRoomObj

  - the server-side representation of the room, fetched from the server's internal data structure - It contains the room's details as they are stored on the server

  - deal with scenarios:

    1. `socket.on("joinRoom", async (roomObj, ackCallback)=>{}`

    - use roomObj.namespaceId to get `thisNs` (this namespace)
    - use `thisNs` namespace to get thisRoomObj
    - const thisRoomObj = thisNs.rooms.find( (room) => room.roomTitle === roomObj.roomTitle );
    - const thisRoomsHistory = thisRoomObj.history;
    - const rooms = socket.rooms; //returns a Set()
    - Array.from(rooms).forEach((room, index) => { if (index !== 0) { socket.leave(room); } }); //leave all rooms, because the client can only be in one room
    - socket.join(roomObj.roomTitle);
    - const sockets = await io.of(namespace.endpoint).in(roomObj.roomTitle).fetchSockets(); //fetch the number of sockets
    - get socket count: const socketCount = sockets.length;
    - call callback: ackCallback({ numUsers: socketCount, thisRoomsHistory });

    2. `socket.on("newMessageToRoom", (messageObj) => {}`

    - broadcast this to all connected clients in room
    - how can we find out what room this socket is in?
    - socket.rooms is a property that contains a Set-like object listing all rooms (including the default room) that the socket is currently joined to.
    - By default, a socket is always joined to its own room, identified by its socket.id.
    - [...rooms] converts the rooms Set-like object into an array. This is done to easily access individual elements of the Set.
    - Sets do not support direct indexing like arrays (rooms[1] wouldn't work directly on a Set).
    - The first element ([0]) is typically the socket's own room, identified by its socket.id.
    - The second element ([1]) is often the specific room the socket has joined.
