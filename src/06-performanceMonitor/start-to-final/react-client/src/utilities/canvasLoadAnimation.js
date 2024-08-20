//currentLoad is percentage to draw
const drawCircle = (canvas, currentLoad)=>{
    if(canvas){
        const context = canvas.getContext('2d');
        // Draw Inner Circle
        context.clearRect(0,0,500,500)
        context.fillStyle = "#ccc";
        context.beginPath();
        context.arc(100,100,90,Math.PI*0,Math.PI*2);    //100,100 is center, 90 is radius
        context.closePath();
        context.fill();

        // Draw the outter line
        // 10px wide line
        context.lineWidth = 10;
        if(currentLoad < 20){
            context.strokeStyle = '#00ff00';    //green
        }else if(currentLoad < 40){
            context.strokeStyle = '#337ab7';    //green-yellow
        }else if(currentLoad < 60){
            context.strokeStyle = '#f0ad4e';    //orange
        }else{
            context.strokeStyle = '#d9534f';    //red
        }
        context.beginPath();
        //because lineWidth is 10, 5px will be inside, 5px will be outside fillCircle above
        //Math.PI * 1.5 -> start at 12o'clock not 3 o'clock
        //draw as much as needed based on current cpu load: `(Math.PI * 2 * currentLoad/100)`
        //+ Math.PI*1.5) make sure its adjusted for 12o'clock
        context.arc(100,100,95,Math.PI*1.5,(Math.PI * 2 * currentLoad/100) + Math.PI*1.5);  //100, 100 is center
        context.stroke();
    }
}

export default drawCircle;
