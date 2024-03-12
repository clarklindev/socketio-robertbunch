// CLIENT

const joinNs = (element, nsData)=>{
    const nsEndpoint = element.getAttribute('ns');  //gets ns="" attribute 

    //find the ns (returns Namespace instance) in nsData with endpoint same as the one user clicked on
    const clickedNs = nsData.find(row=> row.endpoint === nsEndpoint);
    const rooms = clickedNs.rooms;

    //get room-list div
    const roomList = document.querySelector('.room-list');  //querySelector returns first found...thats why it works..prob not best..
    roomList.innerHTML = '';
    //loop through each room and add to DOM
    rooms.forEach(room=>{
        roomList.innerHTML += `
        <li class="room" namespaceId=${room.namespaceId}>
            <span class="fa-solid fa-${room.privateRoom ? 'lock' : 'globe'}"></span>${room.roomTitle}
        </li>
        `
    });

    //lesson 39 - add click listener to each room so the client can tell the server it wants to join
    // - get namespaceId from room and add to DOM, access this and pass to joinRoom()
    const roomNodes = document.querySelectorAll('.room');

    Array.from(roomNodes).forEach(elem=>{
        elem.addEventListener('click', (e)=>{
            console.log('clicked on ', e.target.innerText);

            const namespaceId = elem.getAttribute('namespaceId');
            joinRoom(e.target.innerText, namespaceId);
        });
    });

    //lesson 31 ux cleanup (5min:54)
    localStorage.setItem('lastNs', nsEndpoint);
}
