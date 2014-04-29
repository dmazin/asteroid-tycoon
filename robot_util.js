Robot.prototype.render = function() {
    var _this = this;

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

    this.capacitybar.x = grid_size*x;
    this.capacitybar.y = grid_size*y + surface_height - grid_size / 3 + 6;
    if (this.storage == 0) {
        this.capacitybar.visible = false;
    } else {
        this.capacitybar.gotoAndStop(Math.floor(this.currentCapacity() / this.baseAttrs.storage * 20));
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
    var radius = this.exploreRadius;
    var xs = _.range(-radius, radius + 1).map(function (x) {return p.x + x;});
    var ys = _.range(-radius, radius + 1).map(function (y) {return p.y + y;});
    xs.forEach(function (x) {
        ys.forEach(function (y) {
            if (_this.getGrid()[x] && _this.getGrid()[x][y]) {
                var tile = _this.getGrid()[x][y];
                var explored = tile.explored;
                tile.setExplored();
                var resource = resources[tile.getType()];
                if(resource.harvestable && !explored) {
                    playerState.changeResource('money', resource.hardness * explorationBonus);
                }
            }
        });
    });
};

Robot.unlock = function (type) {
    if (!Robot.unlocked(type)) {
        playerState.unlockedRobots.push(type);
        printout($('#unlock-' + type).text());
        updateRobotShop();
    }
};

Robot.unlocked = function(type) {
    return playerState.unlockedRobots.indexOf(type) != -1;
};

var unlockUpgrade = function (type, level) {
    if (!upgradeUnlocked(type, level)) {
        playerState.unlockedUpgrades[type] = level;
        updateRobotShop();
        if (type == 'bearBot' && level == 1) {
            printout($('#upgrade1').text());
        } else if (type == 'antBot' && level == 1) {
            printout($('#motherlodium-two').text());
        } else if (level == 2) {
            printout($('#upgrade3').text());
        }
    }
};

// Determines if an upgrad is possible for a bot
// based on it's type, which level it wants to upgrade to
// and whether the player has collected enough of the right
// mineral.
var canUpgrade = function(type, level) {
    var upgrade = upgrades[type];
    var cost = upgrade.costs[level];
    return playerState.getResource('money') >= cost && upgradeUnlocked(type, level);
};

var upgradeUnlocked = function(type, level) {
    return playerState.unlockedUpgrades[type] >= level;
};

var currentUpgradeCost = function(type) {
    var upgrade = upgrades[type];
    var level = playerState.getRobotLevel(type);
    return upgrade.costs[level + 1];
};

var upgradeBot = function(type, level) {
    if (!canUpgrade(type, level)) {
        return;
    }

    var cost = upgrades[type].costs[level];
    playerState.changeResource('money', -cost);
    playerState.setRobotLevel(type, level);

    updateRobotShop();

    playerState.totalUpgradesReceived++;
    if (playerState.totalUpgradesReceived == 10 && playerState.badgerFound) {
        Robot.unlock('badgerBot');
        $('.robot-shop').addClass('with-badger');
        $('.stat.motherlodium').addClass('uncovered');
    }
};

var remainingMineralsTillUpgrade = function(type, level) {
    var upgrade = upgrades[type];
    var cost = upgrade.costs[level];
    var mineralReq = upgrade.mineralReqs[level];
    var mineral = upgrade.mineral;
    return mineralReq - playerState.getResource(mineral);
};

var currentlySpawning = {};
var spawnBot = function(type, startX) {
    var robotAttrs = robotLevels[type][state.getRobotLevel(type)];
    $('canvas').addClass('botSpawner');
    currentlySpawning = {
        type: type,
        startX: startX,
        robotAttrs: robotAttrs
    };
};

var updatePlayerMoney = function(robotType) {
    playerState.changeResource('money', -robots[robotType].cost);
};
