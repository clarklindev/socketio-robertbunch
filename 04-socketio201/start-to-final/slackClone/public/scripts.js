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
    const lastNs = localStorage.getItem('lastNs');

    console.log('nsData: ', nsData);
    const namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML = "";

    //populate namespaces
    nsData.forEach((ns)=>{
        namespacesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`;

        // join the namespace with io()
        io(`http://localhost:9000${ns.endpoint}`);
    });

    //populate rooms
    Array.from(document.getElementsByClassName('namespace')).forEach((element)=>{
        console.log('element: ', element);
        element.addEventListener('click', e=>{

            //generating rooms externalized to own file "joinNs.js"
            joinNs(element, nsData);
        });
    });

    //default: initially try get from localstorage: lastNs
    const getArrayElementIndex = nsData.findIndex((ns, index, array)=>{
        return (ns.endpoint === lastNs);
    });
    joinNs(document.getElementsByClassName('namespace')[getArrayElementIndex > -1 ? getArrayElementIndex: 0], nsData);

});

// socket.on('messageFromServer',(data)=>{
//     console.log(data);
// })    

// //note: reconnect is on "socket.io.on()"
// socket.io.on('reconnect',(data)=>{
//     console.log('reconnect event!!!')
//     console.log(data)
// })