// CLIENT
//requires 2 props: 
// 1. room title 
// 2. namespace ID, 

const joinRoom = (roomTitle, namespaceId)=>{
    console.log(roomTitle, namespaceId);

    //add guard...script load..
    if(nameSpaceSockets){
        //lesson 39 (9min 15sec)
        nameSpaceSockets[namespaceId].emit('joinRoom', roomTitle, ackResp=>{    
            console.log(ackResp);
        });
    }
}


