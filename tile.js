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
        var _this = this;

        this.shape = new createjs.Bitmap(resources[this.getType()].image);
        this.shape.x = pixel_x;
        this.shape.y = pixel_y;
        /*this.shape.on('click', function() {
            _this.displayInfo();
        });*/
        stage.addChild(this.shape);

        if (resources[this.getType()].sprite) {
            this.sprite = new createjs.Sprite(resources[this.getType()].sprite);
            this.sprite.gotoAndPlay(0);
            this.sprite.x = pixel_x;
            this.sprite.y = pixel_y;
            stage.addChild(this.sprite);
        }

        this.deterioration = new createjs.Sprite(deteriorationSpriteSheet);
        this.deterioration.gotoAndStop(0);
        this.deterioration.x = pixel_x;
        this.deterioration.y = pixel_y;
        stage.addChild(this.deterioration);
    };

    this.refresh = function () {
        this.shape.image = resources[this.getType()].image;

        if (resources[this.getType()].sprite && !this.sprite) {
            this.sprite = new createjs.Sprite(resources[this.getType()].sprite);
            this.sprite.gotoAndPlay(0);
            this.sprite.x = pixel_x;
            this.sprite.y = pixel_y;
            stage.addChild(this.sprite);
        }

        if (this.baseAmount == 0) {
            this.deterioration.gotoAndStop(0);
        } else if (this.amount <= 0) {
            this.deterioration.gotoAndStop(3);
            if (this.sprite) {
                this.sprite.visible = false;
            }
        } else {
            this.deterioration.gotoAndStop(Math.min(Math.floor((1 - this.amount / this.baseAmount) * 4), 3));
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

    this.displayInfo = function() {
        //console.log(this.type);
        var msg = resources[this.type].text;
        if (typeof msg === 'undefined') {
            throw "Undefined resource text";
        }
        var text = new createjs.Text(msg, "10px Arial", "#ffffff");
        text.x = this.shape.x;
        text.y = this.shape.y;
        text.timeout = 40;
        var fadeout = 20;

        stage.addChild(text);
        createjs.Ticker.addEventListener('tick', function() {
            text.timeout -= 1;
            if (text.timeout <= fadeout) {
                text.alpha -= (1/fadeout);
            }

            if (text.timeout === 0) {
                stage.removeChild(text);
                createjs.Ticker.removeEventListener('tick', arguments.callee);
            }
        });
    }

    this.init();
}
