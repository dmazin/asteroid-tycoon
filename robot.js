var Robot = function(baseAttrs) {
    this.energy = baseAttrs.baseEnergy;
    this.storage = baseAttrs.storage;
    this.resourceAmountByType = {}; //The stuff you pick up
    var _this = this;

    this.position = {x: 0, y: 0};

    // should return [xDelta, yDelta] (one of [-1,0], [1,0], [0,-1], [0,1])
    this.goTo = function (destX, destY, grid) {
        // let's do Uniform Cost Search?

        function popMinNode(frontier) {
            var bestCost = 9999;
            var bestNode = null;
            frontier.forEach(function (node) {
                if (node.pathCost < bestCost) {
                    bestNode = node;
                    bestCost = node.pathCost;
                }
            });
            frontier.splice(frontier.indexOf(bestNode), 1);
            return bestNode;
        }

        var startNode = {
            'x': this.position.x,
            'y': this.position.y,
            'pathCost': 0,
            'path': []
        };
        var frontier = [startNode];
        var explored = [];

        while (true) {
            if (frontier.length === 0) {
                return false; // failure :-(
            }
            var node = popMinNode(frontier);
            if (node.x == destX && node.y == destY) {
                return node.path[0];
            }
            explored.push(node.x + ',' + node.y);
            [[-1,0], [1,0], [0,-1], [0,1]].forEach(function (dir) {
                var dest = {'x': node.x + dir[0], 'y': node.y + dir[1]};

                var tile = grid[dest.x][dest.y];

                if(!canPassTile(tile)) { return; } // cause the tile is impassable

                var child = {
                    'x': dest.x,
                    'y': dest.y,
                    'pathCost': node.pathCost + timeToPassTile(tile),
                    'path': path.concat(dir)
                };

                if (explored.indexOf(node.x + ',' + node.y) == -1 &&
                        !frontier.some(function (n) {n.x == child.x && n.y == child.y})) {
                    // if child state is not in explored or frontier,
                    // insert into frontier
                    frontier.push(child);
                } else if (frontier.some(function (n) {n.x == child.x && n.y == child.y})) {
                    // if child state is in frontier *with a higher path-cost*,
                    // replace that frontier node with child
                    frontier = frontier.map(function (node) {
                        if (node.x === child.x && node.y === child.y &&
                                node.pathCost > child.pathCost) {
                            return child;
                        } else {
                            return node;
                        }
                    });
                }
            });
        }
    };

    this.move = function(xDelta, yDelta) {
        if (!this.canMove) {
            return;
        }

        this.position.x += xDelta;
        this.position.y += yDelta;
    };

    this.hit = function(tile) {
        // Amount harvested based per frame on harvest efficiency
        // amount resource broken down per frame based on drill hardness vs resource hardness
        if (canPassTile(tile)) {
            updateTileandResources(tile);
        }
        this.canMove = (tile.amount === 0); //You can move if you're not blocked by a tile.
        //Can you move if you can't pick up stuff on a tile.
    };

    var updateTileAndResources = function(tile) {
        //The math should totally be double checked here, but here's a rough draft
        var changePercentage = baseAttrs.hardness - tile.getHardness();
        _this.energy -= 1;
        var changeAmount = Math.ceil(tile.amount * changePercentage);
        if (tile.harvestable && _this.storage > 0) {
            addResouces(changeAmount, tile.type);
        }
        tile.amount -= changeAmount; //Reduce the amount left on the tile
    };

    var addResources = function(changeAmount, resourceType) {
        var amountHarvested = Math.min(changeAmount, _this.storage);
        _this.storage -= amountHarvested;
        var resourceAmount = _this.resourceAmountByType[tile.type] || 0;
        //Store the resources we've collected by the name to amount.
        //i.e { name: amount }
        _this.resourceAmountByType[tile.type] = resourceAmount + amountHarvested;
    };

    //If the tile is passable in multiple turns (including whether it can get
    // everything on the tile).
    var canPassTile = function(tile) {
        var tileHardness = tile.getHardness();
        var drillHardness = baseAttrs.hardness;
        return (drillHardness > tileHardness);
    };

    var timeToPassTile = function(tile) {
        return (baseAttrs.hardness - tile.getHardness()) * tile.resistance;
    }
};

// Keep track what level each type should be spawned as
var typeLevels = {
    'squirrelBot': 0
};

var upgradeBot = function(type, level) {
    typeLevels[type] = level;
};

var spawnBot = function(type) {
    var robotAttrs = robotLevels[type][typeLevels[type]];
    var bot = new Robot(robotAttrs);
    activeBots.push(bot);
};
