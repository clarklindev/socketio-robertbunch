// http is a core node module
const http = require('http');

//ws is a 3rd party module
const websocket = require('ws');


//server is an actual server: http://localhost:8000/
const server = http.createServer((req, res)=>{
    res.end('I am connected!');
});

//websocket server to listen to http server - piggyback on http server
const wss = new websocket.WebSocketServer({server});

// wss.on('headers',(headers, req)=>{
//     console.log(headers);
// });

//step1: sends to frontend...
wss.on('connection',(ws,req)=>{
    // console.log(ws);
    ws.send('Welcome to the websocket server!!!');  //picked up by browser

    //step2: listen to message event
    ws.on('message',(data)=>{
        console.log("socket server: ", data.toString());
    })
})

server.listen(8000);