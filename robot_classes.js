var SquirrelBot = {}, BearBot = {}, AntBot = {}, GoatBot = {}, VultureBot = {}, BadgerBot = {};

// move in a random direction for 10 moves at a time
SquirrelBot.defaultBehavior = function(_this) {
	var unexploredSelectionCallback = function(tile) {
		return resources[tile.getType()].harvestable === false
			&& resources[tile.getType()].hardness < _this.baseAttrs.hardness
			&& tile.getType() != 'backfill';
	};
	var dest = findNearestResource(_this.position, _this.getGrid(), unexploredSelectionCallback);
	if (dest && (dest.x != _this.position.x || dest.y != _this.position.y)) {
		_this.moveTowardDestination(dest.x, dest.y);
	} else {
		_this.makeRandomMove();
	}
};

BearBot.defaultBehavior = function(_this) {
	var otherBehaviors = [AntBot];
	if (!_this.currentBehaviorStep) _this.currentBehaviorStep = 0;
	// Idea: do the same behavior 3 times in a row to bounce around less.
	if (!_this.currentBehavior || !_this.currentBehaviorStep) {
		_this.currentBehavior = Math.floor(Math.random() * otherBehaviors.length);
	}
	otherBehaviors[_this.currentBehavior].defaultBehavior(_this);
 	_this.currentBehaviorStep++;
};

//Sseeks out nearest minerals to harvest
AntBot.defaultBehavior = function(_this) {
	var harvestableSelectionCallback = function(tile) {
		return resources[tile.getType()].harvestable === true
			&& resources[tile.getType()].hardness < _this.baseAttrs.hardness;
	};
	var dest = findNearestResource(_this.position, _this.getGrid(), harvestableSelectionCallback);
	if(dest) {
		_this.moveTowardDestination(dest.x, dest.y);
	} else {
		_this.makeRandomMove();
	}
};

//seeks out nearest hard rocks to smash
GoatBot.defaultBehavior = function(_this) {
	var rockSelectionCallback = function(tile) {
		return resources[tile.getType()].harvestable === false
			&& tile.getType() != 'backfill'
			&& tile.getType() != 'dirtite'
			&& tile.getType() != 'dregsite'
			&& resources[tile.getType()].hardness < _this.baseAttrs.hardness;
	};
	var dest = findNearestResource(_this.position, _this.getGrid(), rockSelectionCallback);
	if(dest) {
		_this.moveTowardDestination(dest.x, dest.y);
	} else {
		_this.makeRandomMove();
	}
};

//seeks out rubble to suck up
VultureBot.defaultBehavior = function(_this) {
	if (_this.currentlyVacuuming) {
		_this.moveTo(_this.position.x, _this.position.y); // stay in place
	} else {
		var dest = findNearestBot(_this.position, _this.asteroid);  // TODO: find nearest rubble vs. nearest bot?
		if(dest) {
			_this.moveTowardDestination(dest.x, dest.y);
		} else {
			_this.makeRandomMove();
		}
	}
};

BadgerBot.defaultBehavior = AntBot.defaultBehavior;

// nearest deadBot for vulture
var findNearestBot = function(position, asteroid) {
	deadBots = asteroid.getDeadBots();

	if (deadBots.length === 0) {
		return false;
	}

	var currDiff = 1000;
	var nearestBot = deadBots[0];
	deadBots.forEach(function(bot) {
		var diffX = Math.abs(bot.position.x - position.x);
		var diffY = Math.abs(bot.position.y - position.y);
		if((diffX + diffY) < currDiff && (diffX + diffY) > 0) {
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

	// console.log(itemPositionArray);
	// console.log(nearestPosition);
	return nearestPosition;
};

var findNearestResource = function(position, grid, resourceSelectionCallback) {
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
