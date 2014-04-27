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
        'money': 5000
    };

    var currentAsteroid = null;

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
        resourceAmounts[resource] = resourceAmounts[resource] || 0;
        resourceAmounts[resource] += amount;

        $('.money-stats .amount').text(parseInt(resourceAmounts['money']));
        $('.notification.money .amount').text(parseInt(resourceAmounts['money']));

        if (resource === 'money' || resources[resource].harvestable === false) {
            return;
        }

        var statTemplate = _.template($('#mineral-stat-template').html());

        if ($('.general-stats .' + resource).length > 0) {
            $('.general-stats .' + resource).html(statTemplate({
                name: resource,
                amount: parseInt(resourceAmounts[resource])
            }));
        } else {
            $('.general-stats').append(statTemplate({
                name: resource,
                amount: parseInt(resourceAmounts[resource])
            }));
        }

        if (resource === 'iron') {
            $('.notification.iron .amount').text(parseInt(resourceAmounts[resource]));
        }
    };

    state.getAsteroid = function() {
        return currentAsteroid;
    };

    state.setAsteroid = function(asteroid) {
        currentAsteroid = asteroid;
    };

    return state;
})();
