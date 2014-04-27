var activeBots = [];

var playerState = (function() {
    var robotLevels = {
        'squirrelBot': 0,
        'bearBot': 0,
        'antBot': 0,
        'goatBot': 0,
        'vultureBot': 0
    };

    var resourceAmounts = {
        'money': 5000,
        'iron': 0,
        'dirt': 0
    };

    state = {};

    state.setAsteroid = function(asteroid) {
        state.asteroid = asteroid;
    };

    state.setAsteroid(new Asteroid());

    state.getAsteroid = function() {
        return state.asteroid;
    };

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
        resourceAmounts[resource] += amount;

        // broken idk why
        //resourceAmounts['money'] += resources[resource].value;

        if (resource === 'iron') {
            $('.stats .iron').text(parseInt(resourceAmounts[resource]));
            $('.notification.iron .amount').text(parseInt(resourceAmounts[resource]));
        }
        if (resource === 'dirt') {
            $('.money-stats .amount').text(parseInt(resourceAmounts['money']));
            $('.notification.money .amount').text(parseInt(resourceAmounts['money']));
        }
    };

    return state;
})();
