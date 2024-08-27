// We could ask the server for fresh info on this NS. BAD!!
// We have socket.io/ws, and the server will tell us when something has happened!

//change out so its not using DOM references but rather 'clickedEndpoint' prop
//NOTE: the data is coming from nsList so there shouldnt be a need to go through nsData again
//NOTE: ...BUT THE WHOLE POINT IS TO RETURN THE ID USING THE ENDPOINT
export function joinNs(clickedEndpoint) {
  
  //find the ns (returns Namespace instance) in nsData with endpoint same as the one user clicked on
  const clickedNs = nsData.find((namespace) => namespace.endpoint === clickedEndpoint);
  //global- so we can submit message to the right place
  selectedNsId = clickedNs.id;
  const rooms = clickedNs.rooms;

  //get room-list div
  const roomList = document.querySelector(".room-list"); //querySelector returns first found...thats why it works..prob not best..

  //clear it out
  roomList.innerHTML = "";

  //init firstRoom var
  let firstRoom;

  //loop through each room and add to DOM
  rooms.forEach((room, i) => {
    if (i === 0) {
      firstRoom = room.roomTitle;
    }
    roomList.innerHTML += `
    <li class="room" namespaceId=${room.namespaceId}>
      <span class="fa-solid fa-${room.privateRoom ? "lock" : "globe"}"></span>${
      room.roomTitle
    }
    </li>
    `;
  });

  //init join first room
  joinRoom(firstRoom, clickedNs.id);

  //lesson 39 - add click listener to each room so the client can tell the server it wants to join
  // - get namespaceId from room and add to DOM, access this and pass to joinRoom()
  const roomNodes = document.querySelectorAll(".room");

  Array.from(roomNodes).forEach((elem) => {
    elem.addEventListener("click", (e) => {
      console.log("clicked on ", e.target.innerText);

      const namespaceId = elem.getAttribute("namespaceId");
      joinRoom(e.target.innerText, namespaceId);
    });
  });

  //lesson 31 ux cleanup (5min:54)
  localStorage.setItem("lastNs", nsEndpoint);
}
