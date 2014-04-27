// Definitions of base-level robots - spawn using robotLevels, not robots
var robots = {
    'squirrelBot': {
        'description': 'Basic scout robot',
        'hardness': .3,
        'baseEnergy': 2000,
        'storage': 0,
        'wobble': .9,
        'harvestEfficiency': 0,
        'cost': 10
    }
};

var upgradeCosts = {
    'squirrelBot': [0, 500, 1000]
};

var robotLevels = {
    'squirrelBot': [
        robots['squirrelBot'],
        _.extend(robots['squirrelBot'], {
            energy: 2500,
            wobble: .75
        },
        _.extend(robots['squirrelBot'], {
            energy: 3000,
            wobble: .6
        },
    ],
};

var resources = {
    'dirt': {
        'hardness': .1,
        'harvestable': false,
        'value': 0
    },
    'rock': {
        'hardness': .3,
        'harvestable': false,
        'value': 0
    },
    'iron': {
        'hardness': .35,
        'harvestable': true,
        'value': 10
    }
};
