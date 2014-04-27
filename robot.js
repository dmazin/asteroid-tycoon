var Robot = function(baseAttrs, startX, destX, destY) {
    var _this = this;

    this.energy = baseAttrs.baseEnergy;
    this.baseEnergy = baseAttrs.baseEnergy;
    this.storage = baseAttrs.storage;
    this.resourceAmountByType = {}; // the stuff you pick up
    this.position = {'x': startX, 'y': 0};
    this.reachedDestination = false;

    this.destX = destX;
    this.destY = destY;

    this.init = function () {
        var spriteSheet = new createjs.SpriteSheet({
            images: [baseAttrs.spriteSheet, "pics/explosion_2x.png", "pics/rubble_2x.png"],
            frames: {width:40, height:40},
            animations: {
                run: [0, 1, 'run', baseAttrs.spriteSpeed],
                explode: [2, 8, 'rubble', 0.5],
                rubble: [9, 9, 'rubble', 1]
            }
        });
        this.animation = new createjs.Sprite(spriteSheet, "run");
        this.animation.gotoAndPlay("run");
        stage.addChild(this.animation);

        var healthbarSpriteSheet = new createjs.SpriteSheet({
            images: ["pics/healthbar_2x.png"],
            frames: {width:40, height:4}
        });
        this.healthbar = new createjs.Sprite(healthbarSpriteSheet);
        this.healthbar.gotoAndStop(19);
        stage.addChild(this.healthbar);

        this.render();
    };

    this.giveUpDigging =  function(perseverance){
        if (arguments.length === 0) {
            perseverence = .95;
        }
        if (Math.random() > perseverence){
            return true;
        }
        else{
            return false;
        }
    };

    this.moveToward = function(destX, destY) {
        //top level robot move function
        //move the robot in the general direction of destination, allowing for some veering off course

        //It can't move if it's dead.
        if (this.energy <= 0) {
            if (!this.dead) {
                this.animation.gotoAndPlay('explode');
                this.healthbar.visible = false;                
                this.salvageValue = 10;
            }
            this.dead = true;
            return;
        }

        // If they have reached their destination they should do
        // default behavior.
        if (this.reachedDestination ||
            (this.position.x === destX && this.position.y === destY)) {
            this.reachedDestination = this.reachedDestination || true;
            baseAttrs.klass.defaultBehavior(this);
            return;
        }

        //If they haven't reached their destination, try to
        // go to the given destination
        if (this.currentlyDigging && !this.giveUpDigging()){ //if digging continue to dig unless the robot decides to give up
            this.moveTo(this.currentlyDigging.x, this.currentlyDigging.y);
        }
        else{
            if (grid[destX] && grid[destX][destY]) {
                var canMoveToward = canPassTile(grid[destX][destY]); //checks if will be able to reach destination.  If hopeless, just move randomly.
                if(canMoveToward && !(this.position.x === destX && this.position.y === destY)) {
                    var randomVal = Math.random();
                    if(randomVal > (baseAttrs.wobble * WobbleConstant)) { 
                        this.goToward(destX, destY);
                    } else {
                        //changed wobble so robots will not move in the complete opposite direction
                        this.makeSemiRandomMove(destX,destY);
                    }
                }
            } else {
                this.makeRandomMove();
            }
        }
    };

    this.setDestination =function(destinX, destinY){
        this.destX=destinX;
        this.destY=destinY;
    };


    this.getHeading = function (destX, destY){
        //returns the direction and coordinates of the start of the path to our intended destination.
        var g = grid.map(function (row) {
            return row.map(function (tile) {
                return canPassTile(tile) ? 1 : 0;
            });
        });
        var graph = new Graph(g);
        var start = graph.nodes[this.position.x][this.position.y];
        var end = graph.nodes[destX][destY];
        var result = astar.search(graph.nodes, start, end);
        if (result && result.length > 0) {
            var direction ={'x': result[0].pos.x -this.position.x, 'y': result[0].pos.y - this.position.y}; 
            var coordinates = {'x': result[0].pos.x, 'y': result[0].pos.y};
            var pathExists = true;
        } else{
            var direction ={};
            var coordinates ={};
            var pathExists = false;
        } 
        return {'direction':direction, 'coordinates': coordinates, 'pathExists': pathExists};
    };

    this.goToward = function (destX, destY) {
        //finds the optimal path to the destination if it exists
        var heading = this.getHeading(destX,destY);

        if (heading.pathExists) {
            this.moveTo(heading.coordinates.x, heading.coordinates.y);
        } else {
            // can't reach destination - let's just move randomly
            this.makeRandomMove();
        }
    };

    this.makeSemiRandomMove =function(heading){
        //allows robots to veer off of heading, but not get totally lost by heading backwards
        var heading = this.getHeading(destX,destY);
        var reverseHeading = {'x': - heading.coordinates.x, 'y': - heading.coordinates.y};
        dirs = this.getViableDirections();
        dirs=dirs.filter(function(dir) {
            var dest = {'x': _this.position.x + dir[0], 'y': _this.position.y + dir[1]};
                if ((dir[0] === reverseHeading.x) && (dir[1] === reverseHeading.y)){
                    return false;
                }
                else {
                    return true;
                }

        });
        var randomDir = Math.floor(Math.random() * dirs.length);
        chosenDir = dirs[randomDir];
        _this.moveTo(_this.position.x + chosenDir[0], _this.position.y + chosenDir[1]);
        return true;

    };

    this.getViableDirections = function(){
        var dirs = [[-1,0], [1,0], [0,-1], [0,1]].filter(function(dir) {
            var dest = {'x': _this.position.x + dir[0], 'y': _this.position.y + dir[1]};
            return grid[dest.x] && grid[dest.x][dest.y] && canPassTile(grid[dest.x][dest.y]);
        });
        return dirs;
    };


    this.makeRandomMove = function() {
        //moves the robot in a random direction
        dirs = this.getViableDirections();
        if(dirs.length === 0) { return false; } //In case it's trapped somehow
        var randomDir = Math.floor(Math.random() * dirs.length);
        chosenDir = dirs[randomDir];
        _this.moveTo(_this.position.x + chosenDir[0], _this.position.y + chosenDir[1]);
        return true;
    };

    this.moveTo = function(newX, newY) {
        //once the tile to move to is determined, this function makes the final move step
        if (newY > this.position.y) {
            this.direction = 'down';
        } else if (newY < this.position.y) {
            this.direction = 'up';
        } else if (newX > this.position.x) {
            this.direction = 'right';
        } else if (newX < this.position.x) {
            this.direction = 'left';
        }

        var currentTile = grid[this.position.x][this.position.y];
        var newTile = grid[newX][newY];

        grid[this.position.x][this.position.y].setType('backfill');

        if (canPassTile(newTile)) {
            if (newTile.amount <= 0) {
                this.currentlyDigging = null;
                this.position.x = newX;
                this.position.y = newY;
                grid[this.position.x][this.position.y].setType('backfill');
            } else {
                this.hit(newTile);
                this.currentlyDigging = {x: newX, y: newY};

            }
        }
        this.energy -= 20;
        this.render();
    };

    this.hit = function(tile) {
        // Amount harvested based per frame on harvest efficiency
        // amount resource broken down per frame based on drill hardness vs resource hardness
        if (canPassTile(tile)) {
            updateTileAndResources(tile);
        }
        this.canMove = (tile.amount <= 0); //You can move if you're not blocked by a tile.
        //Can you move if you can't pick up stuff on a tile.
    };

    var updateTileAndResources = function(tile) {
        var resource = resources[tile.getType()];
        var proportionMined = baseAttrs.hardness - resource.hardness;
        var amountMined = tile.baseAmount * proportionMined;
        if (tile.harvestable && _this.storage > 0) {
            addResources(amountMined, tile.getType());
        }
        playerState.changeResource(tile.getType(), amountMined);
        tile.amount -= amountMined; //Reduce the amount left on the tile
    };

    var addResources = function(amountMined, resourceType) {
        var amountHarvested = Math.min(amountMined, _this.storage);
        _this.storage -= amountHarvested;
        var resourceAmount = _this.resourceAmountByType[resourceType] || 0;
        //Store the resources we've collected by the name to amount.
        //i.e { name: amount }
        _this.resourceAmountByType[resourceType] = resourceAmount + amountHarvested;
    };

    //If the tile is passable in multiple turns (including whether it can get
    // everything on the tile).
    var canPassTile = function(tile) {
        var resourceHardness = resources[tile.getType()].hardness;
        var drillHardness = baseAttrs.hardness;
        return (drillHardness > resourceHardness);
    };

    var timeToPassTile = function(tile) {
        var resource = resources[tile.getType()];
        return (baseAttrs.hardness - resource.hardness) * tile.amount;
    };

    this.init();
    return this;
};

Robot.prototype.render = function() {
    if (this.energy <= 0) {
        this.animation.stop();
    }

    if (this.currentlyDigging) {
        x = (3 * this.position.x + this.currentlyDigging.x) / 4;
        y = (3 * this.position.y + this.currentlyDigging.y) / 4;
    } else {
        x = this.position.x;
        y = this.position.y;
    }

    this.healthbar.x = grid_size*x;
    this.healthbar.y = grid_size*y + surface_height - grid_size / 3;
    this.healthbar.gotoAndStop(Math.floor(this.energy / this.baseEnergy * 20));

    this.animation.rotation = 0;
    this.animation.scaleX = 1;
    if (this.direction == 'down') {
        this.animation.scaleX = -1;
        this.animation.rotation = 90;
        y++;
        x++;
    } else if (this.direction == 'up') {
        this.animation.scaleX = -1;
        this.animation.rotation = 270;
    } else if (this.direction == 'right') {
        this.animation.scaleX = -1;
        x++;
    } else if (this.direction == 'left') {
    }

    this.animation.x = grid_size*x;
    this.animation.y = grid_size*y + surface_height;

    var p = this.position;
    [p.x-1, p.x, p.x+1].forEach(function (x) {
        [p.y-1, p.y, p.y+1].forEach(function (y) {
            if (grid[x] && grid[x][y]) {
                grid[x][y].setExplored();
            }
        });
    });
};

var upgradeBot = function(type, level) {
    var cost = upgradeCosts[type][level];

    if (playerState.getResource('money') < cost) {
        return;
    }

    playerState.changeResource('money', -cost);
    playerState.setRobotLevel(type, level);
};

var spawnBot = function(type, startX) {
    var robotAttrs = robotLevels[type][state.getRobotLevel(type)];

    // Have stage listen to mouseup once and make a new bot based on that
    stage.on('stagemouseup', function(stage) {
        var destX = parseInt(stage.stageX / 40);
        var destY = parseInt(stage.stageY / 40);
        var bot = new Robot(robotAttrs, startX, destX, destY);
        activeBots.push(bot);
        return bot;
    }, null, true);
};
