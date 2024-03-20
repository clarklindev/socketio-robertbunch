# 47 Project Strategy - Performance matters
- games need to be between 30fps (1 frame every 0.033) and 60fps (1 frame every 0.016)
- in a socketio game - if there are 4 players on screen, this becomes:
- PER CLIENT: `33 frames per second * 2 (communication both ways) * number of clients` = 66 messages / sec
- TOTAL = 66 * 4 = 264 message per second

### AgarIO game

GAME PLANNING QUESTIONS:
1. where the orbs are
2. where players are
3. collisions (orb/player and player/player)
4. what direction player wants to go

CLIENTS JOB
- draw everything on screen

SERVER JOB
- figure out where the items on stage are

# 48. Socketio app organization
- EVERYTHING in public/ is client side
- EVERYTHING regarding sockets (socketStuff) /express (expressStuff) is server side 

- index.js - this is the file we will run with node  
- server.js - where the servers are created - create our servers and export them (socketio and express server)  
- expressStuff/expressMain.js - purpose is to be an entrypoint for all express stuff  
- socketStuff/socketMain.js - purpose is to be an entrypoint for all socket stuff  

# 49. DOM setup (https://www.udemy.com/course/socketio-with-websockets-the-details/learn/lecture/37128742)
- get startfiles from robertbunch github repo
- public/
    - images/
    - index.html
    - style.css
    - uiStuff.js 
- walkthrough the html (2min52sec)
- uiStuff.js -> set width and height of canvas equal to window
- https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
- test: localhost:9000 

```js
//uiStuff.js
//create width/height variables to equal window
let wWidth = window.innerWidth;
let wHeight = window.innerHeight;

//canvas element needs to be in a variable
const canvas = document.querySelector('#the-canvas');

//context is how we draw (here in 2d)
const context = canvas.getContext('2d');

//set canvas dimensions equal window
canvas.width = wWidth;
canvas.height = wHeight;

const player = {};  //represent "this.player"

//put modals into variables
const loginModal = new bootstrap.Modal(document.querySelector('#loginModal'));
const spawnModal = new bootstrap.Modal(document.querySelector('#spawnModal'));

window.addEventListener('load', ()=>{
    //on page load...open the login modal
    //NOTE: bootstrap instance exists because we imported script 	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/js/bootstrap.bundle.min.js"></script>
    loginModal.show();
});

document.querySelector('.name-form').addEventListener('submit', (e)=>{
    e.preventDefault(); //prevent refresh page
    player.name = document.querySelector('#name-input').value;
    loginModal.hide();
    spawnModal.show();
    console.log(player);
});
```

# 50. A few UI loose ends
- after user enters name, choosing game type -> select "play solo": 
- html: `<button type="button" class="btn play-button start-game"></button>`
- create public/socketStuff.js
- create public/canvasStuff.js
- import in index.html

- attach event listeners to ".start-game"
- hide the start modal
- show all ".hiddenOnStart" interface elements by removing class

# 51 - Draw the player (canvas)
- NOTE: make the game work on CLIENT without the server first...(easier)
- draw would happen on `<canvas>`
- create randomX, randomY (position where to start player)
- we dont draw on canvas, but rather context
- context.beginPath(); tells canvas we about to start drawing
- context.arc(x, y, r, sAngle, eAngle, counterclockwise) //[draw circle](https://www.w3schools.com/tags/canvas_arc.asp) 
- context.fill(); //fill circle
### update (7min 28sec)
- update randomX and randomY becomes player.locX and player.locY
- context.arc(player.locX, player.locY, 10, sAngle, eAngle); meaning it always draws the player.locX and player.locY location
- and player.locX and player.locY is updated in the listener `canvas.addEventListener('mousemove',(event)=>{});`
- use requestAnimationFrame(draw);
- requestAnimationFrame is like a controlled loop, it runs recursively, every paint/frame. 
- if the framerate is 35fps, repaints 35 times a second

### requestAnimationFrame(draw)
- requestAnimationFrame() tells the browser that you wish to perform an animation and requests that the browser calls a specific function to update an animation before the next repaint. this method takes a callback as an argument to be invoked before the repaint.
- NOTE: the callback function must itself call requestAnimationFrame() again if you want to animate another frame at the next repaint.
- single call to requestAnimationFrame() is 1 frame.  
- draw() -> player.locX and player.locY is the only dynamic values, everything else remains same

### translate
- clamp window to player
- clamp the screen / viewport (vp) to the players location: `context.translate(camX, camY);` ie. center player and move canvas with player
- translate() moves the canvas and its origin x units horizontally (positive to right) and y units vertically (positive downwards)
- translate moves the canvas to where the player is at
- FIX: reset the context translate back to default.

```html
<canvas id="the-canvas" style="background: url('images/starfield.jpg')">
    <!-- our drawing will go here 
    -->
</canvas>
```

```js
player.locX = Math.floor( (Math.random() * 500) + 10);    //horizontal (10-500)
player.locY = Math.floor( (Math.random() * 500) + 10);    //vertical (10-500)

const draw = ()=>{
    //draw player 

    const sAngle = 0; 
    const eAngle = Math.PI * 2;

    //clear draws 
    context.clearRect(0,0, canvas.width, canvas.height);

    //reset context translate to default
    //parameter 1 - horizontal scale
    //parameter 2 - vertical skew
    //parameter 3 - horizontal skew
    //parameter 4 - vertical scale
    //parameter 5 - horizontal translate
    //parameter 6 - vertical translate
    context.setTransform(1,0,0,1,0,0);

    //clamp window to player
    //clamp the screen / viewport (vp) to the players location
    const camX = -player.locX + canvas.width/2;
    const camY = -player.locY + canvas.height/2;
    context.translate(camX, camY);

    context.beginPath();    
    context.fillStyle = 'rgb(255, 0, 0)';
    //arg1 (center x) of arc, 
    //arg2 (center y) of arc
    //arg3: radius
    //arg4: start drawing - 0 is the 3oclick position of the arcs circle
    //arg5: end drawing - ending angle in radians (full circle = 2xMath.PI())
    context.arc(player.locX, player.locY, 10, sAngle, eAngle);
    context.fill(); //fill circle
    context.lineWidth = 3; //how wide to draw a line
    context.strokeStyle = 'rgb(0,255,0)';    //draw a green stroke
    context.stroke(); //draw the line (border)

    //requestAnimationFrame is like a controlled loop (recursive at every paint/frame)
    //if fps is 35, it will call draw 35 times/sec
    requestAnimationFrame(draw);    //continuously redraw

    
}

//add mouse listeners to move player towards mouse
canvas.addEventListener('mousemove',(event)=>{
    //...move player

    requestAnimationFrame(draw);
});
```

### 53 - get and draw game orbs (non-player)
- orbs are created by server, hosted on server
- /socketStuff/classes/Orb.js   - instance has color, x,y, radius
- /socketStuff/socketMain.js
- create orbs, everytime socket connects to server, it should send back all orbs `emit('init', orbs)`
- in client -> uiStuff.js create orbs array
- client socket is listening for feedback on 'init' from server, when that happens,

#### RECAP
- CREATION PHASE
    1. SERVER creates orbs
    2. client connects
    3. SERVER -> send back data: emit('init', {orbs})
    4. CLIENT ensure html has script with socket io: `<script src="/socket.io/socket.io.js"></script>` <!-- gives scripts.js access to io-->
    5. CLIENT -> socketStuff.js -> connect to socket server `const socket = io.connect('http://localhost:9000')`
    6. CLIENT -> socketStuff.js -> socket listen for "init" 
    7. CLIENT -> uiStuff.js -> `let orbs = [];` //global var for client orbs
    8. CLIENT -> socketStuff.js -> assign the data from 'init' event to orbs
    9. CLIENT -> canvasStuff.js -> inside draw() -> draw orbs 

- GAME PHASE
    10. CLIENT -> uiStuff.js -> everyone waits for player to click on start game -> initiates "start game"


```js
//CLIENT
//public/uiStuff.js
const orbs = [];

```

```js
//SERVER
//socketStuff/classes/Orb.js
class Orb{
    constructor(){
        this.color = this.getRandomColor();
        this.locX = Math.floor(Math.random() * 500);
        this.locY = Math.floor(Math.random() * 500);
        this.radius = 5;
    }

    getRandomColor(){
        const r = Math.floor((Math.random() * 200) + 50);
        const g = Math.floor((Math.random() * 200) + 50);
        const b = Math.floor((Math.random() * 200) + 50);

        //rgb(r,g,b);
        return `rgb(${r}, ${g}, ${b})`;
    }

}

module.exports = Orb;

```

```js
//SERVER
//socketStuff/socketMain.js
//purpose of socketMain.js -> entrypoint for all socket.io stuff
const io = require('../servers').io;
const Orb = require('./classes/Orb');

//make an orbs array that will host all 500-5000 non-player orbs
const orbs = [];

//on server start, generate initial orbs
//every time one is absorbed, server will make a new one
initGame();

io.on('connect', (socket)=>{
    socket.emit('init', {orbs});
});

function initGame(){
    //loop 500 times, push orb on array
    for(let i = 0; i < 500; i++){
        orbs.push(new Orb());
    }
}

module.exports = io;
```

# 54 - whiteboarding player classes, what does server send?
- collision detection needs to happen on server
- 3 classes 
    - Server stores Player (Player.js)

            - socket id

            - {} PlayerData.js (WHAT-EVERYBODY-NEEDS-TO-RECEIVE-THIS-DATA-IS-DATA-ABOUT-EVERYBODY-ELSE)
                - color
                - names
                - locX (related to PlayerConfig xV)
                - locY (related to PlayerConfig yV)
                - radius
                - score

            - {} PlayerConfig.js (SERVER-NEEDS-TO-KNOW-THIS-ABOUT-EACH-INDIVIDUAL-CLIENT-BUT-NOBODY-NEEDS-TO-KNOW)
                - xV
                - yV
                - zoom
                - speed

# 55 Player Classes
- create classes: Player, PlayerConfig, PlayerData
- import in socketMain.js
- create instances

```js
//socketStuff/socketMain.js
const Player = require('./classes/Player');
const PlayerConfig = require('./classes/PlayerConfig');
const PlayerData = require('./classes/PlayerData');
const Orb = require('./classes/Orb');

//on connect
io.on('connect', (socket)=>{
    //a socket has connected
    const playerName = "temp";
    //make a PlayerConfig object - Player specific data - only player needs to know
    const playerConfig = new PlayerConfig(settings);
    //make a PlayerData object - the data specific to this Player - everyone needs to know
    const playerData = new PlayerData(playerName, settings);
    //Master Player object    
    const player = new Player(socket.id, playerConfig, playerData);

    socket.emit('init', {
        orbs
    });
});
```

# 56 refactoring init for performance
- see commit 

# 57 send-player-data-from-the-server-to-the-clients-and-visa-versa
### data from server to all clients
    - SERVER:issue an event to every connected socket
    - 30 times a sec (30fps)
    - add socket to "game" room
    - setInterval every 33 milliseconds (1000/30) -> SERVER: send event to "game" room 
        `io.to('game').emit('tick', players);`
    - client receives "tick" emitted from server.
    
```js
//SERVER
//socketStuff/socketMain.js

let tickTockInterval;

io.on('connect', (socket)=>{
    //a socket has connected
    socket.on('init', (playerObj, ackCallback)=>{
        
        //someone is about to be added to players...
        if(players.length === 0){
            tickTockInterval = setInterval(()=>{
                io.to('game').emit('tick', players); //send the event to the 'game' room
            }, 33); //1000/30 === 33.3333
        }

        socket.join('game');    //add this socket to "game" room

        //...
    });

    socket.on('disconnect', ()=>{
        //check to see if players is empty.. if so, stop ticking...
        if(players.length === 0){
            clearInterval(tickTockInterval);
        }
    })
});

```


# 58 - step 1 of drawing the players from the server
### canvas -> drawn things with server data at the correct place
- CLIENT: uiStuff.js -> we are creating mirror of server data on client -> create players = [] array
- CLIENT: socketStuff.js -> receiving data from server 'tick' emitted
    -> assign players from uiStuff this value
- CLIENT: canvasStuff.js -> draw all the players on canvas
    - use serverData (p.playerData.locX, p.playerData.locY) instead of (player.locX, player.locY)

### PROBLEMS!!!
- up to this point, camera -> is not moving with the player anymore (camera still using mouse movement positions and not server data)
- up to this point, player -> we using server info now, but its not getting updated..
TODO: the positions are happening on client and that needs to be sent to server, which then knows where client is, 

```js
//CLIENT
//uiStuff.js
//...
let players = [];   //array of all players

```

```js
//CLIENT
//public/socketStuff.js
socket.on('tick', (playersArray)=>{
    players = playersArray;
});

```

```js
//CLIENT
//public/canvasStuff.js

// player.locX = Math.floor( (Math.random() * 500) + 10);    //horizontal
// player.locY = Math.floor( (Math.random() * 500) + 10);    //vertical
players.forEach(p=>{
    //...
    context.fillStyle = p.playerData.color;
    // context.arc(player.locX, player.locY, player.radius, sAngle, eAngle);
    context.arc(p.playerData.locX, p.playerData.locY, p.playerData.radius, sAngle, eAngle);
    //...
});

```

# 59 - sending player direction from client to server
### data from client to server
- send mouse position  CLIENT -> SERVER
- SERVER: updates DATA -> sends back to CLIENT
- client can then draw player at correct position

- socketMain.js
    - remove const and move `const player` declaration outside `socket.on('init',()=>{});` as `let player={};`
    - this allows `socket.on('tock', (data)=>{});` access to player object.
    - set `speed = 10;` to `speed=player.playerConfig.speed;`

# 60 - clamping the camera - and - cleanup
- socketMain.js -> socketio connect() has reconnect feature. 
    NB: when server disconnects, socketMain() will auto-reconnect 
- socketStuff.js -> has a setInterval() which emits "tock" and continues to run when client gets disconnected.
- a tock is still emitted, socketMain() still listening for "tock" before the player (eg. player.playerConfig)  is setup. 

- TODO: canvasStuff.js move `socket.on('tock', (data)=>{}` from within the mousemove event listener   to socketMain.js..

- TODO: socketMain.js a tock has been received before the player is setup. this is because client "tock" from setTimeout after disconnect 
- FIX: add `if(!player.config){}` guard

- FIX: socketStuff.js -> add ternarary defaults
```js
 socket.emit('tock', {
    xVector: player.xVector ? player.xVector : .1,
    yVector: player.yVector ? player.yVector : .1,
});
```
- FIX: canvasStuff.js -> add ternarary defaults
```js
    player.xVector = xVector ? xVector : .1;
    player.yVector = yVector ? yVector : .1;
```

### fixing player position (7min 51sec)
CLIENT: socketStuff.js -> tock() sends x,y to server, 

- canvasStuff -> player position should come from server not canvasStuff: player.locX , player.locY
    - tick() players but we dont know each players' index so we dont know what to clamp to.

### (8min 50sec) socketMain() - playersForUsers[] array (prevents playerConfig and socketId from being sent out to everybody)
    - adjust with adding playersForUsers = [] array, and add playerData to that... `playersForUsers.push({playerData});`
    - we still want to maintain the players[] array (will be for server use only)
    - socketMain.js tick should update to emit playersForUsers:  `io.to('game').emit('tick', playersForUsers)`
    - this prevents playerConfig and socketId from being sent out to everybody

### Anti-pattern (DO NOT DO..) (9min 57sec -> 12min 28sec)
socketStuff.js - setting up with an emitWithAck() assigned to const "myLoc" (see below) wont work 
- settings user player x and y; you cant set it on "tock" (see below) because you dont know if the order events received will be correct as its async callback function result.

```js
//NOT GOOD IDEA - update socket.emit to socket.emitWithAck()
//CLIENT -> socketStuff.js
setInterval(async ()=>{
    const myLoc = await socket.emitWithAck('tock', {
        xVector://...
        yVector://...
    });
    player.locX = myLoc.locX;
    player.locY = myLoc.locY;
});

```
socketMain.js - runs the ackCallback() 
- and call the callback ackCallback() on server which return x,y value to client 
```js
//SERVER -> socketMain.js
socket.on('tock', (data, ackCallback)=>{
    //...
    ackCallback({
        locX: player.playerData.locX,
        locY: player.playerData.locY,
    });
});
```

### SOLUTION: let client know where they are from data in client array (playersForUsers)
- socketMain -> socket.on('init') -> after joining game, and sending back orbs `ackCallback(orbs, )`,
    send indexInPlayers: `ackCallback({orbs, indexInPlayers:playersForUsers.length - 1})`
- socketStuff -> change the receiving as an object "initOrbs" becomes "initData"
    - now to ensure each player knows their own index, player.indexInPlayers = initData.indexInPlayers;
    
```js
//CLIENT
//public/uiStuff.js
const player = {};
```

```js
//CLIENT
//public/canvasStuff.js

//DO NOT USE THIS...
// player.locX = Math.floor( (Math.random() * 500) + 10);    //horizontal
// player.locY = Math.floor( (Math.random() * 500) + 10);    //vertical

const draw = ()=>{
    const camX = -player.locX + canvas.width/2; 
    const camY = -player.locY + canvas.height/2;
};

canvas.addEventListener('mousemove',(event)=>{
    
//...

    //THIS CODE WILL MOVE FROM CLIENT TO SERVER //socket.on('tock', ()=>{})
    // speed = 10;
    // xV = xVector;   //vector from player to mouse
    // yV = yVector;   //vector from player to mouse

    // //OUT OF BOUNDS: restrict on X -> allow only Y
    // if((player.locX < 5 && xV < 0) || (player.locX > 500) && (xV > 0)){
    //     player.locY -= speed * yV;
    // }
    
    // //OUT OF BOUNDS: restrict on Y -> allow only X
    // else if((player.locY < 5 && yV > 0) || (player.locY > 500) && (yV < 0)){
    //     player.locX += speed * xV;
    // }
    
    // //move normally
    // else{
    //     player.locX += speed * xV;
    //     player.locY -= speed * yV;
    // }    

    player.xVector = xVector ? xVector : .1;
    player.yVector = yVector ? yVector : .1;
});
```

```js
//CLIENT
//public/socketStuff.js
const init = async ()=>{
    const initData = await socket.emitWithAck('init', {
        playerName: player.name
    });

    setInterval(()=>{
        socket.emit('tock', {
            xVector: player.xVector ? player.xVector : .1,
            yVector: player.yVector ? player.yVector : .1,
        });
    }, 33);     //every 33 milliseconds

    orbs = initData.orbs;       //see what socketMain.js is sending...SERVER: socket.emit('init', {orbs, initInPlayers});
    player.indexInPlayers = initData.indexInPlayers;
    draw();
}
```

```js
//SERVER
//socketStuff/socketMain.js

io.on('connect', (socket)=>{

    let player={};

    //a socket has connected
    socket.on('init', (playerObj, ackCallback)=>{
        
        //someone is about to be added to players...
        if(players.length === 0){
            tickTockInterval = setInterval(()=>{
                io.to('game').emit('tick', players); //send the event to the 'game' room
            }, 33); //1000/30 === 33.3333
        }

        socket.join('game');    //add this socket to "game" room

        const playerName = playerObj.playerName;
        //make a PlayerConfig object - Player specific data - only player needs to know
        const playerConfig = new PlayerConfig(settings);
        //make a PlayerData object - the data specific to this Player - everyone needs to know
        const playerData = new PlayerData(playerName, settings);
        //Master Player object    
        player = new Player(socket.id, playerConfig, playerData);
        players.push(player);
        
        ackCallback({orbs, indexInPlayers:playersForUsers.length - 1}); //send obj back as an acknowledgement function
    });

    socket.on('tock', (data)=>{

        // a tock has been received before the player is setup.
        //this is because client "tock" from setTimeout after disconnect
        if(!player.config){
            return;
        }
        speed = player.playerConfig.speed;
        const xV = player.playerConfig.xVector = data.xVector;   //vector from player to mouse
        const yV = player.playerConfig.yVector = data.yVector;   //vector from player to mouse

        //OUT OF BOUNDS: restrict on X -> allow only Y
        if((player.locX < 5 && xV < 0) || (player.locX > 500) && (xV > 0)){
            player.locY -= speed * yV;
        }
        
        //OUT OF BOUNDS: restrict on Y -> allow only X
        else if((player.locY < 5 && yV > 0) || (player.locY > 500) && (yV < 0)){
            player.locX += speed * xV;
        }
        
        //move normally
        else{
            player.locX += speed * xV;
            player.locY -= speed * yV;
        }    
    });
});
```

```js
//SERVER
//public/socketStuff/classes/PlayerConfig.js

//data that no other player needs to know about - specific data for this player
class PlayerConfig{
    constructor(settings){
        this.xVector = 0;   //where mouse is relative to player
        this.yVector = 0;   //where mouse is relative to player
        this.speed = settings.defaultSpeed;
        this.zoom = settings.defaultZoom;
    }
}

module.exports = PlayerConfig;
```

---

# 61 - check collisions (math) 
- add to PLayersData.js

```js
//constructor
class PlayerData{
    constructor(playerName, settings){
        //...
        this.playersAbsorbed = 0;
    }
}
```

# 62 - check collisions (code)
- after removing old orb (collision), need to replace
- add a new Orb
- emit to all sockets playing the game, the orbSwitch event so that it can update orbs...(just the new orb)

### checkForOrbCollisions
- its more math intensive to check if orbs overlap so solution is to first check if squares overlap (AABB test) then check orbs
- first do AABB (axis align bounding boxes) test - square collision test
- then do circle overlap check (pythagoras test (Circle))

### checkForPlayerCollisions
- playerId prop is so that you dont have to check for collisions with itself...
- then get pLocX, pLocY, pR
- AABBTest (square)
- Pythogoras test (circle)
- if player who "tocked" is bigger, then other person is absorbed.
- remove player from server players array: `players.splice(i, 1)`
- remove player from players array used by clients: `playersForUsers.splice(i, 1)`
- return collisionData

```js
//socketMain.js
//import collisions
const checkForOrbCollisions = require('./checkCollisions').checkForOrbCollisions;
const checkForPlayerCollisions = require('./checkCollisions').checkForPlayerCollisions;

```

# 63 Leaderboard (at 3min 52sec)
- updating leaderboard will happen inside a sockets 'tock' when score update because of
    1. confirmed orb collision
    2. confirmed player collision
- we only want to update client when necessary (NOT every tick)
- add a new event..

```js
//socketMain.js
//...

//orb collision
if(capturedOrbI !== null){
    //...
    //emit to all playing game because someone just scored
    io.to('game').emit('updateLeaderBoard', getLeaderBoard());
}

//player collision
if(absorbData){
    //...
    io.to('game').emit('updateLeaderBoard', getLeaderBoard());
}

```
