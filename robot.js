var Robot = function(baseAttrs, startX, destX, destY) {
    var _this = this;

    this.energy = baseAttrs.baseEnergy;
    this.storage = baseAttrs.storage;
    this.resourceAmountByType = {}; // the stuff you pick up
    this.position = {'x': startX, 'y': 0};
    this.reachedDestination = false;

    this.destX = destX;
    this.destY = destY;

    this.init = function () {
        var spriteSheet = new createjs.SpriteSheet({
            images: [baseAttrs.spriteSheet],
            frames: {width:40, height:40},
            animations: {
                run: {
                    frames: [0,1],
                    speed: baseAttrs.spriteSpeed,
                }
            }
        });
        this.animation = new createjs.Sprite(spriteSheet, "run");
        this.animation.scaleX = -1;
        this.animation.scaleY = 1;
        this.animation.gotoAndPlay("run");
        stage.addChild(this.animation);
        this.render();
    };

    this.moveToward = function(destX, destY) {
        //It can't move if it's dead.
        if(this.energy === 0) { return; }

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
        canMoveToward = canPassTile(grid[destX][destY]);
        if(canMoveToward && !(this.position.x === destX && this.position.y === destY)) {
            var randomVal = Math.random();
            if(randomVal > (baseAttrs.wobble * WobbleConstant) || this.currentlyDigging) {
                canMoveToward = this.goToward(destX, destY);
            } else {
                canMoveToward = this.makeRandomMove();
            }
        } else if (this.position.x === destX && this.position.y === destY) {
            this.reachedDestination = true;
        }
    };

    this.setDestination =function(destinX, destinY){
        this.destX=destinX;
        this.destY=destinY;
    };


    this.goToward = function (destX, destY) {
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
            this.moveTo(result[0].pos.x, result[0].pos.y);
        }
    };

    this.makeRandomMove = function() {
        var dirs = [[-1,0], [1,0], [0,-1], [0,1]].filter(function(dir) {
            var dest = {'x': _this.position.x + dir[0], 'y': _this.position.y + dir[1]};
            return grid[dest.x] && grid[dest.x][dest.y] && canPassTile(grid[dest.x][dest.y]);
        });
        if(dirs.length === 0) { return false; } //In case it's trapped somehow
        var randomDir = Math.floor(Math.random() * dirs.length);
        chosenDir = dirs[randomDir];
        _this.moveTo(_this.position.x + chosenDir[0], _this.position.y + chosenDir[1]);
        return true;
    };

    this.moveTo = function(newX, newY) {
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
        _this.energy -= 1;

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
    }p

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
