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

