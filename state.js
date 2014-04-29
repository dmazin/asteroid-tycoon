var activeBots = [];

var playerState = (function() {
    var robotLevels = {
        'squirrelBot': 0,
        'bearBot': 0,
        'antBot': 0,
        'goatBot': 0,
        'vultureBot': 0,
        'badgerBot': 0
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

    state.getResources = function() {
        return resourceAmounts;
    };

    state.getResource = function(resource) {
        return resourceAmounts[resource] || 0;
    };

    state.changeResource = function(resource, amount) {
        if (resource == 'motherlodium' && state.getMotherLodiumRemainingCount() < 0) {
            // we have mined all of the motherloadium!
            printout($('#theEnd').text());
        }

        if (resource == 'artifact' && amount > 0 && state.getResource('artifact') == 0) {
            // first artifact found?
            printout($('#alienArtifacts').text());
        }

        resourceAmounts[resource] = resourceAmounts[resource] || 0;
        resourceAmounts[resource] += amount;

        $('.money-stats .amount').text('$' + parseInt(resourceAmounts['money']));
        $('.notification.money .amount').text(parseInt(resourceAmounts['money']));

        if (resource === 'money' || resources[resource].harvestable === false) {
            return;
        }

        $('.general-stats .' + resource).html(statTemplate({
            name: resource,
            abbrev: resources[resource].abbrev,
            amount: parseInt(resourceAmounts[resource])
        }));

        $('.notification.' + resource + ' .amount').text(parseInt(resourceAmounts[resource]));
    };

    state.getArtifactValue = function() {
        var r = Math.random();
        var val = 10 * (r * (60 - 5) + 5);
        val *= currentAsteroid.artifactValueScale;
        return val;
    };

    state.addResources = function(resourceAmountsByType) {
        for (var resourceType in resourceAmountsByType) {
            var resourceAmount = resourceAmountsByType[resourceType];
            state.changeResource(resourceType, resourceAmount);

            var resourceValue;
            if (resourceType === 'artifact') {
                resourceValue = state.getArtifactValue();
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
        $('canvas').removeClass('asteroidSelect');

        currentAsteroid = asteroid;
        activeBots = [];

        if (stage) {
            stage.removeAllChildren();
            stage.clear();
        }

        window.stage = new createjs.Stage("mainCanvas");

        currentAsteroid.init();
        currentAsteroid.refresh();

        init_stage();

        asteroid.getDeadBots().forEach(function (bot) {
            stage.addChild(bot.animation);
            bot.render();
        });
    };

    state.totalUpgradesReceived = 0;
    state.badgerFound = false;

    state.unlockedRobots = ['squirrelBot'];

    state.unlockedUpgrades = {
        'squirrelBot': 0,
        'bearBot': 0,
        'antBot': 0,
        'goatBot': 0,
        'vultureBot': 0
    };

    state.robotsKilled = {
        'squirrelBot': 0,
        'bearBot': 0,
        'antBot': 0,
        'goatBot': 0,
        'vultureBot': 0
    };

    state.eventsTriggered = {
        'motherlodium-one': false
    }

    state.getTotalRobotsKilled = function () {
        return _.reduce(state.robotsKilled, function(memo, num) {
            return memo + num;
        }, 0);
    }

    state.getMotherLodiumRemainingCount = function () {
        return _(_(_(asteroids).map(function (a) {return a.getGrid().map(function (row) {return row[29].amount})})).flatten()).reduce(function(x,y) {return x+y})
    }

    return state;
})();
