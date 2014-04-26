var drills = {
    'shit': {
        'hardness': .1,
        'price': 0
    },
    'steel': {
        'hardness': .7,
        'price': 20
    }
};

var robots = {
    'squirrelBot': {
        'description': 'Basic scout robot',
        'drill': drills['shit'],
        'baseEnergy': 1000,
        'storage': 0,
        'wobble': 5,
        'harvestEfficiency': 0,
        'cost': 10,
        'ability': //stuff
    }
};

var resources = {
    'dirt': {
        'hardness': .1,
        'harvestable': false,
        'value': 0
    },
    'rock': {
        'hardness': .3,
        'harvestable': false,
        'value': 0
    },
    'iron': {
        'hardness': .35,
        'harvestable': true,
        'value': 10
    }
};

var Robot = function(type) {
    var baseAttrs = robots[type];
    this.energy = baseAttrs.baseEnergy;
    this.storage = baseAttrs.storage;
    this.resources = {}; //The stuff you pick up
    
    this.position = {x: 0, y: 0};
    
    this.move = function(xDelta, yDelta) {
        if (!this.canMove) {
            return;
        }
        
        this.position.x += xDelta;
        this.position.y += yDelta;
    };
    
    this.hit = function(tile) {
        var tileHardness = tile.getHardness();
        var drillHardness = baseAttrs.hardness;
        if(drillHardness > tileHardness) {
            //The math should totally be double checked here, but here's a rough draft
            var changePercentage = tileHardness / drillHardness;
            var changeAmount = Math.ceil(tile.amount * changePercentage);
            this.energy -= Math.ceil(changePercentage);
            if(tile.harvestable && this.storage) {
                this.storage -= changeAmount;
                this.resources[tile.type] = (this.resources[tile.type] + changeAmount) || changeAmount;
            }
        }
        this.canMove = (tile.amount === 0); //You can move if you're not blocked by a tile.
        //Can you move if you can't pick up stuff on a tile.
    };
};

new Robot('basic');

var Tile = function(type, amount) {
    this.type = type; //So you can store the resources by their name.
    this.amount = amount;
};

new Tile('iron', 30);
