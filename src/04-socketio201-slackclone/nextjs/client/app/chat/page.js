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
import { Namespaces } from "@/components/chat/Namespaces";
import { Namespace } from "@/components/chat/Namespace";

import "./page.css";

// CLIENT-SIDE

export default function ChatPage() {

  const { defaultNamespaceSocket, namespaceList, setNamespaceList, namespaceSockets, selectedNsId  } = useSocket();

  useEffect(()=>{
    if(defaultNamespaceSocket){
      //on the client side, once a connection is established using io() with Socket.IO, the client receives a 'connect' event
      defaultNamespaceSocket.on("connect", () => {
        console.log("CLIENT: DEFAULT SOCKET 'connect'");
        defaultNamespaceSocket.emit("default-namespace-connect");
      });

      defaultNamespaceSocket.on('nsList', (namespaces)=>{
        setNamespaceList(namespaces);
      });
    }
  }, [defaultNamespaceSocket]);



  useEffect(() => {
    console.log('CLIENT: useEffect() called');
    let initializedSocket = null;

    const setupListeners = () => {
      if(selectedNsId && namespaceSockets[selectedNsId]){
        initializedSocket = socket;
        
        initializedSocket.on("welcome", (data) => {
          console.log('CLIENT: receives "welcome":', data);
        });

        initializedSocket.on("messageFromServer", (data) => {
          console.log(data);
        });
  
        initializedSocket.on("reconnect", (data) => {
          console.log("reconnect event!!!");
          console.log(data);
        });
      }
    };

    // Function to clean up listeners
    const cleanupListeners = () => {
      if (initializedSocket) {
        console.log('CLIENT: useEffect() cleanup cleanupListeners() called');
        initializedSocket.off("connect");
        initializedSocket.off("welcome");
        initializedSocket.off("messageFromServer");
        initializedSocket.off("reconnect");
        initializedSocket.disconnect();
      }
    }
    // Cleanup on component unmount
    /*
    Ensure Cleanup: Always call the cleanup function to remove listeners and disconnect the socket server when the socketServer instance changes or the component unmounts.
    */

    setupListeners();

    return () => {
      cleanupListeners();
    };

  }, [selectedNsId]);

  

  const namespaces = <Namespaces>{
    namespaceList.map((ns, index)=>{
      return <Namespace key={index} {...ns}/>
    })
  }</Namespaces>;

  const handleSubmit = (event) => {
    event.preventDefault();
    const message = event.target.message.value;
    handleMessage(message);
  };

  return (
    <main>
      <div className="sidemenu">{namespaces}</div>
      <div className="subsidemenu">yo</div>
      <div className="content">
        <h2 className="room-heading">hello</h2>
        <ul id="messages" className="messages">
        </ul>
        <form id="form" onSubmit={handleSubmit}>
          <input id="input" name="message" autoComplete="off" />
          <button type="submit">Send</button>
        </form>
      </div>
    </main>
  );
}
