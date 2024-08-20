//CLIENT
//player from uiStuff.js


//-------------------------
//---------DRAW------------
//-------------------------
//NOT USED
// player.locX = Math.floor( (Math.random() * 500) + 10);    //horizontal
// player.locY = Math.floor( (Math.random() * 500) + 10);    //vertical

//player.locX and player.locY is the only dynamic values, everything else remains same
const draw = ()=>{

    //reset context translate to default
    //parameter 1 - horizontal scale
    //parameter 2 - vertical skew
    //parameter 3 - horizontal skew
    //parameter 4 - vertical scale
    //parameter 5 - horizontal translate
    //parameter 6 - vertical translate
    context.setTransform(1,0,0,1,0,0);

    //clear context
    context.clearRect(0,0, canvas.width, canvas.height);

    //clamp the screen / viewport (vp) to the players location
    const camX = -player.locX + canvas.width/2;
    const camY = -player.locY + canvas.height/2;

    context.translate(camX, camY);

    //draw player
    const sAngle = 0; 
    const eAngle = Math.PI * 2;

    //draw all the players
    players.forEach((p)=>{
        if(!p.playerData){
            //if the playerData does not exist, this is an absorbed player and we dont draw
            return;
        }

        context.beginPath();    
        context.fillStyle = p.playerData.color;
        //arg1 (center x) of arc, 
        //arg2 (center y) of arc
        //arg3: radius
        //arg4: start drawing - 0 is the 3oclick position of the arcs circle
        //arg5: end drawing - ending angle in radians (full circle = 2xMath.PI())
        context.arc(p.playerData.locX, p.playerData.locY, p.playerData.radius, sAngle, eAngle);
        
        context.fill(); //fill circle
        context.lineWidth = 3; //how wide to draw a line
        context.strokeStyle = 'rgb(0,255,0)';    //draw a green stroke
        context.stroke(); //draw the line (border)
    });

    //draw orbs 
    orbs.forEach((orb)=>{
        context.beginPath(); //starts new path
        context.fillStyle = orb.color;
        context.arc(orb.locX, orb.locY, orb.radius, 0, Math.PI * 2);
        context.fill();
    });

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

    player.xVector = xVector ? xVector : .1;
    player.yVector = yVector ? yVector : .1;
})
