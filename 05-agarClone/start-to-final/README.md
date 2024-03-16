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