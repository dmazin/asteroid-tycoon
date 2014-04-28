function Tile(pixel_x, pixel_y, size, type, amount, pos) {
    /* create the easeljs shape object that
     * draws this Tile, and add it to the
     * stage
     */

    var deteriorationSpriteSheet = new createjs.SpriteSheet({
        images: ["pics/other/deterioration.png"],
        frames: {width:40, height:40}
    });

    this.init = function () {
        this.addToStage();

        this.amount = amount;
        this.baseAmount = amount;
        this.type = type;
        this.explored = false; // true to disable fog of war
        if (pos[1] < 2) { // no FOW on first two rows, let's say
            this.explored = true;
        }

        this.refresh();
    };

    this.addToStage = function () {
        this.shape = new createjs.Bitmap(resources[this.getType()].image);
        this.shape.x = pixel_x;
        this.shape.y = pixel_y;
        stage.addChild(this.shape);

        this.deterioration = new createjs.Sprite(deteriorationSpriteSheet);
        this.deterioration.gotoAndStop(0);
        this.deterioration.x = pixel_x;
        this.deterioration.y = pixel_y;
        stage.addChild(this.deterioration);
    };

    this.refresh = function () {
        this.shape.image = resources[this.getType()].image;
        if (this.baseAmount == 0) {
            this.deterioration.gotoAndStop(0);
        } else {
            this.deterioration.gotoAndStop(Math.floor((1 - this.amount / this.baseAmount) * 3.99));
        }
    };

    this.getType = function() {
        return this.explored ? (this.type || type) : "unexplored";
    };

    this.setExplored = function() {
        this.explored = true;
        this.refresh();
    };

    this.setType = function (newType) {
        this.type = newType;
        this.refresh();
    };

    this.mineAmount = function (amtMined) {
        this.amount -= amtMined;
        this.refresh();
    }

    this.init();
}
