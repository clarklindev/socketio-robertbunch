//player from uiStuff.js

const init = ()=>{
    console.log('canvasStuff.js init()');
    draw();
}

//-------------------------
//---------DRAW------------
//-------------------------
player.locX = Math.floor( (Math.random() * 500) + 10);    //horizontal
player.locY = Math.floor( (Math.random() * 500) + 10);    //vertical

//player.locX and player.locY is the only dynamic values, everything else remains same
const draw = ()=>{
    //clear context
    context.clearRect(0,0, canvas.width, canvas.height);

    //reset context translate to default
    //parameter 1 - horizontal scale
    //parameter 2 - vertical skew
    //parameter 3 - horizontal skew
    //parameter 4 - vertical scale
    //parameter 5 - horizontal translate
    //parameter 6 - vertical translate
    context.setTransform(1,0,0,1,0,0);

    //clamp the screen / viewport (vp) to the players location
    const camX = -player.locX + canvas.width/2;
    const camY = -player.locY + canvas.height/2;
    context.translate(camX, camY);

    //draw player
    const sAngle = 0; 
    const eAngle = Math.PI * 2;

    context.beginPath();    
    context.fillStyle = 'rgb(255, 0, 0)';
    //arg1 (center x) of arc, 
    //arg2 (center y) of arc
    //arg3: radius
    //arg4: start drawing - 0 is the 3oclick position of the arcs circle
    //arg5: end drawing - ending angle in radians (full circle = 2xMath.PI())
    context.arc(player.locX, player.locY, 10, sAngle, eAngle);
    
    //draw an arc
    context.arc(200,200, 10, sAngle, eAngle);
    
    context.fill(); //fill circle
    context.lineWidth = 3; //how wide to draw a line
    context.strokeStyle = 'rgb(0,255,0)';    //draw a green stroke
    context.stroke(); //draw the line (border)

    //requestAnimationFrame is like a controlled loop (recursive at every paint/frame)
    //if fps is 35, it will call draw 35 times/sec
    requestAnimationFrame(draw);    //continuously redraw
    
    //clamp window to player
    //add mouse listeners to move player towards mouse
}

//updates player position (player.locX, player.locY)
canvas.addEventListener('mousemove',(event)=>{
    console.log(event)

    //relative to center of screen
    const mousePosition = {
        x: event.clientX,
        y: event.clientY
    };

    //spits out angle relative to player (which is where player should move towards)
    const angleDeg = Math.atan2(mousePosition.y - (canvas.height/2), mousePosition.x - (canvas.width/2)) * 180 / Math.PI;
    if(angleDeg >= 0 && angleDeg < 90){
        xVector = 1 - (angleDeg/90);
        yVector = -(angleDeg/90);
        console.log('mouse is BOTTOM RIGHT of player');
    }else if(angleDeg >= 90 && angleDeg <= 180){
        xVector = -(angleDeg-90)/90;
        yVector = -(1 - ((angleDeg-90)/90));
        console.log('mouse is BOTTOM LEFT of player');
    }else if(angleDeg >= -180 && angleDeg < -90){
        xVector = (angleDeg+90)/90;
        yVector = (1 + ((angleDeg+90)/90));
        console.log('mouse is TOP LEFT of player');
    }else if(angleDeg < 0 && angleDeg >= -90){
        xVector = (angleDeg+90)/90;
        yVector = (1 - ((angleDeg+90)/90));
        console.log('mouse is TOP RIGHT of player');
    }

    speed = 10;
    xV = xVector;   //vector from player to mouse
    yV = yVector;   //vector from player to mouse

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
})
