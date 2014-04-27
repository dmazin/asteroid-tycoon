// Definitions of base-level robots - spawn using robotLevels, not robots
var robots = {
    'squirrelBot': {
        'description': 'Basic scout robot',
        'hardness': 0.13,
        'baseEnergy': 200,
        'storage': 0,
        'wobble': 0.9,
        'harvestEfficiency': 0,
        'cost': 150
    },
    'bearBot': {
        'energy': 1200,
        'storage': 100,
        'wobble': .7,
        'harvestEfficiency': .6,
        'cost': 300
    },
    'antBot': {
        'energy': 1000,
        'storage': 200,
        'wobble': .4,
        'harvestEfficiency': .8,
        'cost': 550
    },
    'goatBot': {
        'energy': 1000,
        'storage': 0,
        'wobble': .5,
        'harvestEfficiency': .3,
        'cost': 1050
    },
    'vultureBot': {
        'energy': 1500,
        'storage': 200,
        'wobble': .1,
        'harvestEfficiency': .7,
        'cost': 650
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
    'bearBot': [
        robots['bearBot']
    ],
    'antBot': [
        robots['antBot']
    ],
    'goatBot': [
        robots['goatBot']
    ],
    'vultureBot': [
        robots['vultureBot']
    ]
};

var resources = {
    'backfill': {
        'hardness': 0,
        'harvestable': false,
        'value': 0
    },
    'dirt': {
        'hardness': 0.04,
        'harvestable': false,
        'value': 0
    },
    'rock': {
        'hardness': 0.14,
        'harvestable': false,
        'value': 0
    },
    'iron': {
        'hardness': 0.35,
        'harvestable': true,
        'value': 10
    },
    'unexplored': {
        'hardness': 0.04,
        'harvestable': false,
        'value': 0
    }
};
