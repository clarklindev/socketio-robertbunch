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
    nsData.forEach((ns)=>{
        namespacesDiv.innerHTML += `<div class="namespace" ns="${ns.name}"><img src="${ns.image}"></div>`
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