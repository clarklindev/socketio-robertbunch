"use client";

import io from "socket.io-client";
import { useContext } from "react";

import socketContext from "@/context/chat/SocketContext";
import { handleMessage } from "@/lib/chat/actions";

import "./page.css";

//   // CLIENT
//   //console logs are output on browser console

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
const socket = io(); //connecting to the default namespace, which is the main namespace in Socket.IO.
//Unique Socket IDs: Each time a client connects to the server, Socket.IO assigns a unique identifier to that connection called a socket.id. This ID is unique per connection and is how the server identifies each connected client.
//Custom Identifiers: You can pass additional data or identifiers when establishing a connection by including query parameters or using custom events. For example, you can connect with custom query parameters to identify the client:
//eg.
// const socket = io('/my-namespace', {
//   query: { userId: '12345' }
// });

//lesson 38 FIX 1: sockets will be put into this array, in the index of their ns.id
const nameSpaceSockets = [];
//lesson 38 FIX 2: listeners
const listeners = {
  nsChange: [],
  messageToRoom: [],
};

//a global variable we update when the user updates the namespace
//use statemanagement...
let selectedNsId = 0;

//----------------
//form handling here...

//form handling end
//----------------

//   nameSpaceSockets[selectedNsId].emit("newMessageToRoom", {
//     newMessage,
//     date: Date.now(),
//     avatar: "https://via.placeholder.com/30",
//     userName,
//     selectedNsId,
//   });

//   document.querySelector("#user-message").value = "";
// });

//lesson 38 (7min2sec)
//client addListeners job is to manage all listeners added to all namespaces
//this prevents listeners being added multiple times
// const addListeners = (nsId) => {
//   if (!listeners.nsChange[nsId]) {
//     nameSpaceSockets[nsId].on("nsChange", (data) => {
//       console.log("NAMESPACE CHANGED");
//       console.log(data);
//     });
//     listeners.nsChange[nsId] = true;
//   }

//   //lesson 42 - emit messages to room
//   if (!listeners.messageToRoom[nsId]) {
//     //add the nsId listener to this namespace
//     nameSpaceSockets[nsId].on("messageToRoom", (messageObj) => {
//       console.log(messageObj);

//       //add message to DOM
//       document.querySelector("#messages").innerHTML +=
//         buildMessageHtml(messageObj);
//     });
//     listeners.messageToRoom[nsId] = true;
//   }
// };

//   socket.on("connect", () => {
//     console.log("Connected");
//     socket.emit("clientConnect");
//     // console.log(socket.id);
//     // socket.emit('messageFromClient',{data:"Hello, from the browser!"});
//   });

//   socket.on("welcome", () => {
//     socket.on("welcome", (data) => {
//       console.log(data);
//     });
//   });

//   // lesson 28 - listen for the "nsList" event from the server which gives us the namespaces
//   socket.on("nsList", (nsData) => {
//     const lastNs = localStorage.getItem("lastNs");

//     console.log("nsData: ", nsData);
//     const namespacesDiv = document.querySelector(".namespaces");
//     namespacesDiv.innerHTML = "";

//     //populate namespaces
//     nsData.forEach((ns) => {
//       namespacesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`;

//       //ns.id (from Namespace() instance)
//       //if the connection is new, nameSpaceSockets[ns.id] will be null
//       //if the connection has NOT been established, connect...

//       //lesson 38
//       if (!nameSpaceSockets[ns.id]) {
//         // join the namespace with io()
//         // thisNs = io(`http://localhost:9000${ns.endpoint}`);
//         nameSpaceSockets[ns.id] = io(`${socketUrl}${ns.endpoint}`);
//       }

//       //lesson 38
//       addListeners(ns.id);
//     });

//     //lesson 30 - populate rooms
//     Array.from(document.getElementsByClassName("namespace")).forEach(
//       (element) => {
//         console.log("element: ", element);
//         element.addEventListener("click", (e) => {
//           // const nsEndpoint = element.getAttribute('ns');
//           // const clickedNs = nsData.find(row=> row.endpoint === nsEndpoint);
//           // console.log(clickedNs);
//           // console.log(clickedNs.rooms);

//           //COMMENTED OUT IN FAVOR OF joinNs()
//           // const roomList = document.querySelector('.room-list');
//           // roomList.innerHTML = '';
//           // loop through each room and add to DOM
//           // rooms.forEach(room=>{
//           //     roomList.innerHTML += `<li><span class="glyphicon glyphicon-lock"></span>${room.roomTitle}</li>`
//           // });

//           //generating rooms externalized to own file "joinNs.js"
//           joinNs(element, nsData);
//         });
//       }
//     );

//     //default: initially try get from localstorage: lastNs
//     const getArrayElementIndex = nsData.findIndex((ns, index, array) => {
//       return ns.endpoint === lastNs;
//     });

//     // Lesson 31 Ux Cleanup 2min52 / 6min10
//     joinNs(
//       document.getElementsByClassName("namespace")[
//         getArrayElementIndex > -1 ? getArrayElementIndex : 0
//       ],
//       nsData
//     );
//   });

//   // socket.on('messageFromServer',(data)=>{
//   //     console.log(data);
//   // })

//   // //note: reconnect is on "socket.io.on()"
//   // socket.io.on('reconnect',(data)=>{
//   //     console.log('reconnect event!!!')
//   //     console.log(data)
//   // })

//   /*
//   messageObj structure:
// {
//       newMessage,
//       date,
//       userName,
//       avatar
//   }
//   */

//   function joinNs(element, nsData){
//     const nsEndpoint = element.getAttribute("ns"); //gets ns="" attribute

//     //find the ns (returns Namespace instance) in nsData with endpoint same as the one user clicked on
//     const clickedNs = nsData.find((row) => row.endpoint === nsEndpoint);

//     //global- so we can submit message to the right place
//     selectedNsId = clickedNs.id;
//     const rooms = clickedNs.rooms;

//     //get room-list div
//     const roomList = document.querySelector(".room-list"); //querySelector returns first found...thats why it works..prob not best..

//     //clear it out
//     roomList.innerHTML = "";

//     //init firstRoom var
//     let firstRoom;

//     //loop through each room and add to DOM
//     rooms.forEach((room, i) => {
//       if (i === 0) {
//         firstRoom = room.roomTitle;
//       }
//       roomList.innerHTML += `
//         <li class="room" namespaceId=${room.namespaceId}>
//           <span class="fa-solid fa-${
//             room.privateRoom ? "lock" : "globe"
//           }"></span>${room.roomTitle}
//         </li>
//         `;
//     });

//     //init join first room
//     joinRoom(firstRoom, clickedNs.id);

//     //lesson 39 - add click listener to each room so the client can tell the server it wants to join
//     // - get namespaceId from room and add to DOM, access this and pass to joinRoom()
//     const roomNodes = document.querySelectorAll(".room");

//     Array.from(roomNodes).forEach((elem) => {
//       elem.addEventListener("click", (e) => {
//         console.log("clicked on ", e.target.innerText);

//         const namespaceId = elem.getAttribute("namespaceId");
//         joinRoom(e.target.innerText, namespaceId);
//       });
//     });

//     //lesson 31 ux cleanup (5min:54)
//     localStorage.setItem("lastNs", nsEndpoint);
//   };

//   // CLIENT
//   //requires 2 props:
//   // 1. room title
//   // 2. namespace ID,

//   //lesson 39 (9min 15sec)
//   //const joinRoom =  (roomTitle, namespaceId)=>{
//   //console.log(roomTitle, namespaceId);

//     //add guard...script load..
//     //if(nameSpaceSockets){
//       // nameSpaceSockets[namespaceId].emit('joinRoom', roomTitle, ackResp=>{
//         //console.log(ackResp); // {numUsers: 1}
//         //document.querySelector('.curr-room-text').innerHTML = roomTitle;
//         //document.querySelector('.curr-room-num-users').innerHTML = `${ackResp.numUsers}<span class="fa-solid fa-user"></span>`;
//       // });
//     //}
//   //};

//   //lesson 40 - emitWithAck() ie no callback / using async
//   async function joinRoom(roomTitle, namespaceId){

//     const ackResp = await nameSpaceSockets[namespaceId].emitWithAck('joinRoom', {roomTitle, namespaceId});

//     /* SERVER:
//       socket.on('joinRoom', async (roomObj, ackCallback)=>{
//         ackCallback({
//           numUsers:socketCount,
//           thisRoomsHistory
//         });
//       }
//     */
//     console.log(ackResp.thisRoomsHistory); // ackResp = {numUsers: socketCount, thisRoomsHistory}

//     document.querySelector('.curr-room-text').innerHTML = roomTitle;
//     document.querySelector('.curr-room-num-users').innerHTML = `${ackResp.numUsers}<span class="fa-solid fa-user"></span>`;

//     document.querySelector('#messages').innerHTML = "";

//     ackResp.thisRoomsHistory.forEach(message=>{
//       document.querySelector('#messages').innerHTML += buildMessageHtml(message);
//     });
//   }
// }

export default function ChatPage() {
  const socketCtx = useContext(socketContext);

  //call an exposed context function eg. socketCtx.
  socketCtx.sayHello();

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
