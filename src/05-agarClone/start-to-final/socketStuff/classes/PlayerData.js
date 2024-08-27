//All data that everybody needs to know about each other

class PlayerData{
    constructor(playerName, settings){
        this.name = playerName;
        this.locX = Math.floor(settings.worldWidth * Math.random() + 10);
        this.locY = Math.floor(settings.worldHeight * Math.random() + 10);
        this.radius = settings.defaultSize;
        this.color = this.getRandomColor();
        this.score = 0;
        this.orbsAbsorbed = 0;
        this.playersAbsorbed = 0;   
    }

    getRandomColor(){
        const r = Math.floor((Math.random() * 200) + 50);
        const g = Math.floor((Math.random() * 200) + 50);
        const b = Math.floor((Math.random() * 200) + 50);

        //rgb(r,g,b);
        return `rgb(${r}, ${g}, ${b})`;
    }
}

module.exports = PlayerData;
