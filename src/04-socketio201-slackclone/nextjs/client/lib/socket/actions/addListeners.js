//lesson 38 (7min2sec)
//client addListeners job is to manage all listeners added to all namespaces
//this prevents listeners being added multiple times
const addListeners = (nsId) => {
  if (!listeners.nsChange[nsId]) {
    nameSpaceSockets[nsId].on("nsChange", (data) => {
      console.log("NAMESPACE CHANGED");
      console.log(data);
    });
    listeners.nsChange[nsId] = true;
  }

  //   //lesson 42 - emit messages to room
  if (!listeners.messageToRoom[nsId]) {
    //add the nsId listener to this namespace
    nameSpaceSockets[nsId].on("messageToRoom", (messageObj) => {
      console.log(messageObj);

      //add message to DOM
      document.querySelector("#messages").innerHTML +=
        buildMessageHtml(messageObj);
    });
    listeners.messageToRoom[nsId] = true;
  }
};
