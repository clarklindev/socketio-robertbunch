import { fetchNamespaces } from "./service/namespaceService.js";

export async function initSocketHandlers(io) {
  console.log("SERVER: STEP 06 - FUNCTION initSocketHandlers()");

  //set up connection event handlers
  io.on("connection", (socket) => {
    console.log(`SERVER: receives 'clientConnect' (${socket.id}) connected to socket server`);
    // console.log(socket.handshake);
    
    //EMIT
    socket.emit("welcome", "Welcome to the server!");

    //LISTEN FOR...
    socket.on("clientConnect", async (data) => {
      console.log(`SERVER: receives 'clientConnect' (${socket.id}) has connected`);

      try {
        // Fetch namespaces from the API
        const namespaces = await fetchNamespaces();

        //send  namespaces to client
        socket.emit("nsList", namespaces || []);
      } catch (error) {
        console.error("Error fetching namespaces:", error);
        socket.emit("nsList", []); // Send an empty list on error
      }
    });

    socket.on("newMessageToServer", (dataFromClient) => {
      console.log("Data:", dataFromClient);
      io.emit("newMessageToClients", { text: dataFromClient.text });
    });

    //eg. when client closes browser
    socket.on("disconnect", () => {
      console.log(`SERVER: receives 'disconnect', (${socket.id}) has disconnected`);
    });
  });

  
}
