// CLIENT
//console logs are output on browser console

//fake authentication - user login 
//remove prompts to save time - this should be the authentication part anyways (out-of-scope)...
// const userName = prompt('what is your username?');
// const password = prompt('what is your password?');
const userName = "Rob";
const password = "x";

// always join the main namespace, thats where the client gets the namespaces from
const socket = io('http://localhost:9000');     //available because slack.html <script src="/socket.io/socket.io.js"></script>

//lesson 38 FIX 1: sockets will be put into this array, in the index of their ns.id
const nameSpaceSockets = [];
//lesson 38 FIX 2: listeners
const listeners = {
    nsChange: [],
    messageToRoom:[],
}

//a global variable we update when the user updates the namespace 
//use statemanagement...
let selectedNsId = 0;

//add a submit handler for our form
document.querySelector('#message-form').addEventListener('submit', (e)=>{
    //keep the browser from submitting
    e.preventDefault();

    //get value from input
    const newMessage = document.querySelector('#user-message').value;      //<input id="user-message" type="text" placeholder="Enter your message" />
    console.log(newMessage, selectedNsId);

    nameSpaceSockets[selectedNsId].emit('newMessageToRoom', {
        newMessage,
        date: Date.now(),
        avatar: 'https://via.placeholder.com/30',
        userName,
        selectedNsId,
    });

    document.querySelector('#user-message').value = '';
})

//lesson 38 (7min2sec)
//client addListeners job is to manage all listeners added to all namespaces
//this prevents listeners being added multiple times
const addListeners = (nsId)=>{
    if(!listeners.nsChange[nsId]){
        nameSpaceSockets[nsId].on('nsChange', (data)=>{
            console.log("NAMESPACE CHANGED");
            console.log(data);
        })
        listeners.nsChange[nsId] = true;
    }

    //lesson 42 - emit messages to room
    if(!listeners.messageToRoom[nsId]){
        //add the nsId listener to this namespace
        nameSpaceSockets[nsId].on('messageToRoom', (messageObj)=>{
            console.log(messageObj);

            //add message to DOM
            document.querySelector('#messages').innerHTML += buildMessageHtml(messageObj);
        });
        listeners.messageToRoom[nsId] = true;
    }
}

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

// lesson 28 - listen for the "nsList" event from the server which gives us the namespaces
socket.on('nsList', (nsData)=>{
    const lastNs = localStorage.getItem('lastNs');

    console.log('nsData: ', nsData);
    const namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML = "";
    
    //populate namespaces
    nsData.forEach((ns)=>{
        namespacesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`;

        //ns.id (from Namespace() instance)
        //if the connection is new, nameSpaceSockets[ns.id] will be null
        //if the connection has NOT been established, connect...
        
        //lesson 38
        if(!nameSpaceSockets[ns.id]){
            // join the namespace with io()
            // thisNs = io(`http://localhost:9000${ns.endpoint}`);
            nameSpaceSockets[ns.id] = io(`http://localhost:9000${ns.endpoint}`);
        }

        //lesson 38
        addListeners(ns.id);
    });

    //lesson 30 - populate rooms
    Array.from(document.getElementsByClassName('namespace')).forEach((element)=>{
        console.log('element: ', element);
        element.addEventListener('click', e=>{
            // const nsEndpoint = element.getAttribute('ns');
            // const clickedNs = nsData.find(row=> row.endpoint === nsEndpoint);
            // console.log(clickedNs);
            // console.log(clickedNs.rooms);

            //COMMENTED OUT IN FAVOR OF joinNs()
            // const roomList = document.querySelector('.room-list');
            // roomList.innerHTML = '';
            // loop through each room and add to DOM
            // rooms.forEach(room=>{
            //     roomList.innerHTML += `<li><span class="glyphicon glyphicon-lock"></span>${room.roomTitle}</li>`
            // });

            //generating rooms externalized to own file "joinNs.js"
            joinNs(element, nsData);
        });
    });

    //default: initially try get from localstorage: lastNs
    const getArrayElementIndex = nsData.findIndex((ns, index, array)=>{
        return (ns.endpoint === lastNs);
    });

    // Lesson 31 Ux Cleanup 2min52 / 6min10
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

/*
messageObj structure {
    newMessage,
    date,
    userName,
    avatar
}
*/
