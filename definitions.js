// Definitions of base-level robots - spawn using robotLevels, not robots
var robots = {
    'squirrelBot': {
        'description': 'Basic scout robot',
        'hardness': 0.3,
        'baseEnergy': 2000,
        'storage': 0,
        'wobble': 0.9,
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
            baseEnergy: 2500,
            wobble: 0.75
        }),
        _.extend(robots['squirrelBot'], {
            baseEnergy: 3000,
            wobble: 0.6
        }),
    ],
};

var resources = {
    'backfill': {
        'hardness': 0,
        'harvestable': false,
        'value': 0
    },
    'dirt': {
        'hardness': 0.1,
        'harvestable': false,
        'value': 0
    },
    'rock': {
        'hardness': 0.3,
        'harvestable': false,
        'value': 0
    },
    'iron': {
        'hardness': 0.35,
        'harvestable': true,
        'value': 10
    }
};
