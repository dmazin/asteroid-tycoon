var activeBots = [];

var playerState = (function() {
    var robotLevels = {
        'squirrelBot': 0
    };

    var resourceAmounts = {
        'money': 0,
        'iron': 0
    };

    state = {};

    state.getRobotLevel = function(robotType) {
        return robotLevels[robotType];
    };

    state.setRobotLevel = function(robotType, level) {
        if (level <= robotLevels[robotType]) {
            return;
        }

        robotLevels[robotType] = level;
    };

    state.getResource = function(resource) {
        return resourceAmounts[resource];
    };

    state.changeResource = function(resource, amount) {
        resourceAmounts['resource'] += amount;
    };

    return state;
})();
