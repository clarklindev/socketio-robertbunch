// CLIENT
// requires 2 props:
// 1. room title
// 2. namespace ID,

// lesson 39 (9min 15sec)
// const joinRoom = (roomTitle, namespaceId) => {
//   console.log(roomTitle, namespaceId);

//   // add guard...script load..
//   if (nameSpaceSockets) {
//     nameSpaceSockets[namespaceId].emit("joinRoom", roomTitle, (ackResp) => {
//       console.log(ackResp); // {numUsers: 1}
//       document.querySelector(".curr-room-text").innerHTML = roomTitle;
//       document.querySelector(
//         ".curr-room-num-users"
//       ).innerHTML = `${ackResp.numUsers}<span class="fa-solid fa-user"></span>`;
//     });
//   }
// };

//lesson 40 - emitWithAck() ie no callback / using async
async function joinRoom(roomTitle, namespaceId) {
  const ackResp = await nameSpaceSockets[namespaceId].emitWithAck("joinRoom", {
    roomTitle,
    namespaceId,
  });

  /* SERVER sends back with ackCallback():

  socket.on('joinRoom', async (roomObj, ackCallback)=>{
    ackCallback({
      numUsers:socketCount,
      thisRoomsHistory
    });
  }

*/
  console.log(ackResp.thisRoomsHistory); // ackResp = {numUsers: socketCount, thisRoomsHistory}

  document.querySelector(".curr-room-text").innerHTML = roomTitle;
  document.querySelector(
    ".curr-room-num-users"
  ).innerHTML = `${ackResp.numUsers}<span class="fa-solid fa-user"></span>`;

  document.querySelector("#messages").innerHTML = "";

  ackResp.thisRoomsHistory.forEach((message) => {
    document.querySelector("#messages").innerHTML += buildMessageHtml(message);
  });
}
