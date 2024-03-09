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
        roomList.innerHTML += `<li><span class="glyphicon glyphicon-lock"></span>${room.roomTitle}</li>`
    });

    localStorage.setItem('lastNs', nsEndpoint);
}
