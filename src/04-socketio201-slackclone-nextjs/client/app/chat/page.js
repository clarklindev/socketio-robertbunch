"use client";

import io from "socket.io-client";
import { useContext } from "react";

import socketContext from "@/context/chat/SocketContext";
import { handleMessage } from "@/lib/chat/handleMessage";

import "./page.css";

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

// always join the main namespace, thats where the client gets the namespaces from
// const socket = io("http://localhost:9000", clientOptions); //available because of `import io from "socket.io-client";` OR slack.html <script src="/socket.io/socket.io.js"></script>
//Unique Socket IDs: Each time a client connects to the server, Socket.IO assigns a unique identifier to that connection called a socket.id. This ID is unique per connection and is how the server identifies each connected client.
//Custom Identifiers: You can pass additional data or identifiers when establishing a connection by including query parameters or using custom events. For example, you can connect with custom query parameters to identify the client:
//eg.
// const socket = io('/my-namespace', {
//   query: { userId: '12345' }
// });
const socket = io(); //connecting to the default namespace, which is the main namespace in Socket.IO.

socket.on("connect", () => {
  console.log("Connected");
  socket.emit("clientConnect");
  // console.log(socket.id);
  // socket.emit('messageFromClient',{data:"Hello, from the browser!"});
});

socket.on("welcome", (data) => {
  console.log(data);
});

socket.on("messageFromServer", (data) => {
  console.log(data);
});

//note: reconnect is on "socket.io.on()"
socket.io.on("reconnect", (data) => {
  console.log("reconnect event!!!");
  console.log(data);
});

export default function ChatPage() {
  const socketCtx = useContext(socketContext);

  //call an exposed context function eg. socketCtx.sayHello();

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
        <form id="form" action={handleMessage}>
          <input id="input" name="message" autoComplete="off" />
          <button>Send</button>
        </form>
      </div>
    </main>
  );
}
