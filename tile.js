var Tile = function(type, amount) {
    this.type = type;
    this.resource = resources[type]; //So you can store the resources by their name.
    this.amount = amount;
    
    this.getHardness = function() {
        return this.resource.hardness;
    };
};

var setTile = function(x, y, type, amount) {
    new Tile(type, amount);
};
