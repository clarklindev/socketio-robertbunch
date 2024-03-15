const init = ()=>{
    console.log('canvasStuff.js init()');
    draw();
}

//-------------------------
//---------DRAW------------
//-------------------------
const draw = ()=>{
    //draw player
    let randomX = Math.floor( (Math.random() * 500) + 10);    //horizontal
    let randomY = Math.floor( (Math.random() * 500) + 10);    //vertical
    console.log(randomX, randomY);
    const sAngle = 0; 
    const eAngle = Math.PI * 2;

    context.beginPath();    
    context.fillStyle = 'rgb(255, 0, 0)';
    //arg1 (center x) of arc, 
    //arg2 (center y) of arc
    //arg3: radius
    //arg4: start drawing - 0 is the 3oclick position of the arcs circle
    //arg5: end drawing - ending angle in radians (full circle = 2xMath.PI())
    context.arc(randomX, randomY, 10, sAngle, eAngle);
    context.fill(); //fill circle
    context.lineWidth = 3; //how wide to draw a line
    context.strokeStyle = 'rgb(0,255,0)';    //draw a green stroke
    context.stroke(); //draw the line (border)
    
    //clamp window to player
    //add mouse listeners to move player towards mouse
}