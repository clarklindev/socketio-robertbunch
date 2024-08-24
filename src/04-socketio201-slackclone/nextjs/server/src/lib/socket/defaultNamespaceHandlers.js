import { fetchNamespaces } from "./service/namespaceService.js";

//THE WHOLE POINT OF CONNECTING TO DEFAULT NAMESPACE IS TO GET AVAILABLE NAMESPACES
export async function initDefaultNamespaceHandlers(io) {
  console.log("SERVER: STEP 06 - FUNCTION initDefaultNamespaceHandlers()");

  //set up connection event handlers
  //'connection' is when CLIENT: SocketContext calls const newSocket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}`);
  //NOTE: THIS IS CALLED ONLY FOR CONNECTIONS TO DEFAULT NAMESPACE
  io.on("connection", (socket) => {
    console.log(`SERVER: receives 'connection' from client calling io(${process.env.SERVER_URL}:${process.env.SERVER_PORT})`);
    // console.log(socket.handshake);
    
    //EMIT TO "CLIENT" SOCKET
    socket.emit("welcome", "Welcome to the server!");

    //LISTEN FOR...
    socket.on("default-namespace-connect", async (data) => {
      console.log(`SERVER: receives 'default-namespace-connect' (${socket.id}) has connected`);

      try {
        console.log('SERVER: FUNCTION fetchNamespaces()')
        // Fetch namespaces from the API
        const namespaces = await fetchNamespaces();

        //send  namespaces to client
        socket.emit("nsList", namespaces || []);
      } catch (error) {
        console.error("Error fetching namespaces:", error);
        socket.emit("nsList", []); // Send an empty list on error
      }
    });
    
  });

  
}
