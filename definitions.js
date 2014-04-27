// Definitions of base-level robots - spawn using robotLevels, not robots
var robots = {
    'squirrelBot': {
        'description': 'Basic scout robot',
        'hardness': 0.13,
        'baseEnergy': 2000,
        'storage': 0,
        'wobble': 0.9,
        'harvestEfficiency': 0,
        'cost': 150
    },
    'bearBot': {
        'description': 'All-around robot',
        'hardness': 0.25,
        'baseEnergy': 1200,
        'storage': 100,
        'wobble': 0.7,
        'harvestEfficiency': 0.6,
        'cost': 300
    }
};

var WobbleConstant = 0.5;

var upgradeCosts = {
    'squirrelBot': [0, 500, 1000],
    'bearBot': [0, 500, 1000]
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
    'bearBot': [
        robots['bearBot'],
        _.extend(robots['bearBot'], {
            baseEnergy: 1400
        }),
        _.extend(robots['bearBot'], {
            baseEnergy: 1600
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
    },
    'unexplored': {
        'hardness': 0.1,
        'harvestable': false,
        'value': 0
    }
};
