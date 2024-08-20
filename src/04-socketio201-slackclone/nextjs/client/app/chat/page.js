//CLIENT-SIDE

//   //fake authentication - user login
//   //remove prompts to save time - this should be the authentication part anyways (out-of-scope)...
//   // const userName = prompt("what is your username?");
//   // const password = prompt("what is your password?");
//   const userName = "Rob";
//   const password = "x";

//   const clientOptions = {
//     reconnectionDelayMax: 1000,
//     auth: {
//       token: "123",
//     },
//     query: {
//       "my-key": "my-value",
//       userName,
//       password,
//     },
//   };

// always join the main namespace, thats where the client gets the namespaces from (but same port as server listening to)
// const socket = io("http://localhost:x", clientOptions); //available because of `import io from "socket.io-client";` OR slack.html <script src="/socket.io/socket.io.js"></script>
//Unique Socket IDs: Each time a client connects to the server, Socket.IO assigns a unique identifier to that connection called a socket.id. This ID is unique per connection and is how the server identifies each connected client.
//Custom Identifiers: You can pass additional data or identifiers when establishing a connection by including query parameters or using custom events. For example, you can connect with custom query parameters to identify the client:
//eg.
// const socket = io('/my-namespace', {
//   query: { userId: '12345' }
// });
//NOTE: this is the same port server is listening to, BUT...
//this is not neccessarily the same port client spins up on when running scripts: "dev": 'next dev'
"use client";
import { useEffect, useState } from "react";
import { useSocket } from "@/context/chat/SocketContext"; 
import { handleMessage } from "@/lib/socket/actions/handleMessage";

import "./page.css";

// CLIENT-SIDE

export default function ChatPage() {

  const { socketServer } = useSocket();

  useEffect(() => {
    let initializedSocketServer = null;

    const setupListeners = () => {
      if(socketServer){
        initializedSocketServer = socketServer;
        
        initializedSocketServer.on("connect", () => {
          console.log("CLIENT: initializedSocketServer 'Connected'");
          initializedSocketServer.emit("clientConnect");
        });
  
        initializedSocketServer.on("welcome", (data) => {
          console.log('CLIENT receives "welcome":', data);
        });
  
        initializedSocketServer.on("messageFromServer", (data) => {
          console.log(data);
        });
  
        initializedSocketServer.on("reconnect", (data) => {
          console.log("reconnect event!!!");
          console.log(data);
        });
      }
    };
    setupListeners();

    // Function to clean up listeners
    const cleanupListeners = () => {
      if (initializedSocketServer) {
        console.log('CLIENT: useEffect() cleanup');
        initializedSocketServer.off("connect");
        initializedSocketServer.off("welcome");
        initializedSocketServer.off("messageFromServer");
        initializedSocketServer.off("reconnect");
        initializedSocketServer.disconnect();
      }
    }
    // Cleanup on component unmount
    /*
    Ensure Cleanup: Always call the cleanup function to remove listeners and disconnect the socket server when the socketServer instance changes or the component unmounts.
    */
    return () => {
      cleanupListeners();
    };

  }, [socketServer]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const message = event.target.message.value;
    handleMessage(message);
  };

  return (
    <main>
      <div className="sidemenu">hey</div>
      <div className="subsidemenu">yo</div>
      <div className="content">
        <h2 className="room-heading">hello</h2>
        <ul id="messages" className="messages">
          <li>hey</li>
          <li>hey</li>
          <li>hey</li>
        </ul>
        <form id="form" onSubmit={handleSubmit}>
          <input id="input" name="message" autoComplete="off" />
          <button type="submit">Send</button>
        </form>
      </div>
    </main>
  );
}
