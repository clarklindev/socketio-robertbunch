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
    document.querySelector('.player-name').innerHTML = player.name;
    loginModal.hide();
    spawnModal.show();
    console.log(player);
});

document.querySelector('.start-game').addEventListener('click', ()=>{
    //hide start modal
    spawnModal.hide();
    //show the hiddenOnStart elements
    const elArray = Array.from(document.querySelectorAll('.hiddenOnStart'));
    elArray.forEach(el=> el.removeAttribute('hidden'));
    init(); //call canvasStuff.js init()
});