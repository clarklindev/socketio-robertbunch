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