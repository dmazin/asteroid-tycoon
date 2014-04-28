var activeBots = [];
var deadBots = [];

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

    // Set initial displays
    $('.money-stats .amount').text('$' + parseInt(resourceAmounts['money']));

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
        return resourceAmounts[resource] || 0;
    };

    state.changeResource = function(resource, amount) {
        resourceAmounts[resource] = resourceAmounts[resource] || 0;
        resourceAmounts[resource] += amount;

        $('.money-stats .amount').text('$' + parseInt(resourceAmounts['money']));
        $('.notification.money .amount').text(parseInt(resourceAmounts['money']));

        if (resource === 'money' || resources[resource].harvestable === false) {
            return;
        }

        $('.general-stats .' + resource).html(statTemplate({
            name: resource,
            amount: parseInt(resourceAmounts[resource])
        }));

        if (resource === 'fatlootium') {
            $('.notification.fatlootium .amount').text(parseInt(resourceAmounts[resource]));
        }

        if (resource === 'iron') {
            $('.notification.iron .amount').text(parseInt(resourceAmounts[resource]));
        }
    };

    function getArtifactValue() {
        var r = Math.random();
        var val = r * (60 - 5) + 5;
        val *= currentAsteroid.artifactScaleValue;
        return val;
    }

    state.addResources = function(resourceAmountsByType) {
        for (var resourceType in resourceAmountsByType) {
            var resourceAmount = resourceAmountsByType[resourceType];
            state.changeResource(resourceType, resourceAmount);

            var resourceValue;
            if (resourceType === 'artifact') {
                resourceValue = getArtifactValue();
            } else {
                resourceValue = resources[resourceType].value;
            }
            state.changeResource('money', resourceValue * resourceAmount);

        }
    };

    state.getAsteroid = function() {
        return currentAsteroid;
    };

    state.setAsteroid = function(asteroid) {
        currentAsteroid = asteroid;
        activeBots = [];
        deadBots = [];

        if (stage) {
            stage.removeAllChildren();
            stage.clear();
        }

        window.stage = new createjs.Stage("mainCanvas");

        currentAsteroid.init();
        currentAsteroid.refresh();

        init_stage();
    };

    state.unlockedRobots = ['squirrelBot'];

    return state;
})();
