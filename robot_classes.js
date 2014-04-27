var SquirrelBot = {}, BearBot = {}, AntBot = {}, GoatBot = {}, VultureBot = {};

SquirrelBot.defaultBehavior = function(_this) {
	_this.makeRandomMove();
};

BearBot.defaultBehavior = function(_this) {
	var otherBehaviors = [SquirrelBot, AntBot, GoatBot];
	var randomChoice = Math.floor(Math.random() * 3);
	otherBehaviors[randomChoice].defaultBehavior(_this);
};

//Sseeks out nearest minerals to harvest
AntBot.defaultBehavior = function(_this) {
	var harvestableSelectionCallback = function(tile) {
		return resources[tile.getType()].harvestable === true;
	};
	var dest = findNearestResource(_this.position, harvestableSelectionCallback);
	if(dest) {
		_this.goToward(dest.x, dest.y);
	} else {
		_this.makeRandomMove();
	}
};

//seeks out nearest hard rocks to smash
GoatBot.defaultBehavior = function(_this) {
	var rockSelectionCallback = function(tile) {
		return tile.getType() === 'rock';
	};
	var dest = findNearestResource(_this.position, rockSelectionCallback);
	if(dest) {
		_this.goToward(dest.x, dest.y);
	} else {
		_this.makeRandomMove();
	}
};

//seeks out rubble to suck up
VultureBot.defaultBehavior = function(_this) {
	var dest = findNearestBot(_this.position);  // TODO: find nearest rubble vs. nearest bot?
	if(dest) {
		_this.goToward(dest.x, dest.y);
	} else {
		_this.makeRandomMove();
	}
};

//activeBots for vulture
var findNearestBot = function(position) {
	var currDiff = 1000;
	var nearestBot = activeBots[0];
	activeBots.forEach(function(bot) {
		var diffX = Math.abs(bot.position.x - position.x);
		var diffY = Math.abs(bot.position.y - position.y);
		if((diffX + diffY) < currDiff) {
			currDiff = diffX + diffY;
			nearestBot = bot;
		}
	});
	return nearestBot.position;
};

var findNearestItem = function(position, itemPositionArray) {
	var currDiff = 1000;
	var nearestPosition = itemPositionArray[0];
	itemPositionArray.forEach(function(itemPos) {
		var diffX = Math.abs(itemPos.x - position.x);
		var diffY = Math.abs(itemPos.y - position.y);
		if((diffX + diffY) < currDiff) {
			currDiff = diffX + diffY;
			nearestPosition = itemPos;
		}
	});
	return nearestPosition;
};

var findNearestResource = function(position, resourceSelectionCallback) {
	var resourcePositions = [];
	grid.forEach(function(row, x) {
		row.forEach(function(val, y) {
			if (resourceSelectionCallback(val)) {
				resourcePositions.push({'x': x, 'y': y});
			}
		});
	});

	return findNearestItem(position, resourcePositions);
};