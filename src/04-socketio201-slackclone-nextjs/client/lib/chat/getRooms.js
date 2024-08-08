const userName = prompt("What is your username?");
const password = prompt("What is your password?");

//Temp remove the promt's to save dev headaches!
// const userName = "Rob";
// const password = "x";

const socket = io("http://localhost:9000");

// socket.on("connect", () => {
//   console.log("Connected!");
//   socket.emit("clientConnect");
// });

// lesson 28 - listen for the "nsList" event from the server which gives us the namespaces
socket.on("nsList", (nsData) => {
  const lastNs = localStorage.getItem("lastNs");

  console.log("nsData: ", nsData);
  const namespacesDiv = document.querySelector(".namespaces");
  namespacesDiv.innerHTML = "";

  //populate namespaces
  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`;

    //ns.id (from Namespace() instance)
    //if the connection is new, nameSpaceSockets[ns.id] will be null
    //if the connection has NOT been established, connect...

    //lesson 38
    if (!nameSpaceSockets[ns.id]) {
      // join the namespace with io()
      // thisNs = io(`http://localhost:9000${ns.endpoint}`);
      nameSpaceSockets[ns.id] = io(`${socketUrl}${ns.endpoint}`);
    }

    //lesson 38
    addListeners(ns.id);
  });

  //lesson 30 - populate rooms
  Array.from(document.getElementsByClassName("namespace")).forEach(
    (element) => {
      console.log("element: ", element);
      element.addEventListener("click", (e) => {
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
    }
  );

  //default: initially try get from localstorage: lastNs
  const getArrayElementIndex = nsData.findIndex((ns, index, array) => {
    return ns.endpoint === lastNs;
  });

  // Lesson 31 Ux Cleanup 2min52 / 6min10
  joinNs(
    document.getElementsByClassName("namespace")[
      getArrayElementIndex > -1 ? getArrayElementIndex : 0
    ],
    nsData
  );
});
