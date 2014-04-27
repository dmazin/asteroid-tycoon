var activeBots = [];

var playerState = function() {
    var robotLevels = {
        'squirrelBot': 0
    };

    var resourceAmounts = {
        'money': 0,
        'iron': 0
    };

    this.setRobotLevel = function(robotType, level) {
        if (level <= robotLevels[robotType]) {
            return;
        }

        robotLevels[robotType] = level;
    };

    this.getResource = function(resource) {
        return resourceAmounts[resource];
    };

    this.changeResource = function(resource, amount) {
        resourceAmounts['resource'] += amount;
    };
};
