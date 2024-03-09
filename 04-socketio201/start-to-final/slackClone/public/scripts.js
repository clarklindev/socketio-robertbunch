// CLIENT

//console logs are output on browser console
//fake authentication - user login 
//remove prompts to save time - this should be the authentication part anyways (out-of-scope)...
// const userName = prompt('what is your username?');
// const password = prompt('what is your password?');
const userName = "Rob";
const password = "x";

const socket = io('http://localhost:9000');

socket.on('connect',()=>{
    console.log('Connected');
    socket.emit('clientConnect');
    // console.log(socket.id);
    // socket.emit('messageFromClient',{data:"Hello, from the browser!"});
});

socket.on('welcome', ()=>{
    socket.on('welcome', (data)=>{
        console.log(data);
    })
});

// listen for the "nsList" event from the server which gives us the namespaces
socket.on('nsList', (nsData)=>{
    console.log('nsData: ', nsData);
    const namespacesDiv = document.querySelector('.namespaces');
    
    //populate namespaces
    nsData.forEach((ns)=>{
        namespacesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`
    });

    //populate rooms
    Array.from(document.getElementsByClassName('namespace')).forEach((element)=>{
        console.log('element: ', element);
        element.addEventListener('click', e=>{
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
            })
        });
    });

});

// socket.on('messageFromServer',(data)=>{
//     console.log(data);
// })    

// //note: reconnect is on "socket.io.on()"
// socket.io.on('reconnect',(data)=>{
//     console.log('reconnect event!!!')
//     console.log(data)
// })