// Definitions of base-level robots - spawn using robotLevels, not robots
var robots = {
    'squirrelBot': {
        'uiName': 'Squirrel',
        'description': 'SquirrelBot 1.0 - Scout',
        'hardness': 0.13,
        'baseEnergy': 2000,
        'storage': 0,
        'wobble': 0.9,
        'harvestEfficiency': 0,
        'cost': 150,
        'affinity': {
            'dirt': 2
        },
        'klass': SquirrelBot,
        'spriteSheet': 'pics/scout0_2x.png',
        'spriteSpeed': 0.3,
        'gif': 'pics/scout0.gif'
    },
    'bearBot': {
        'uiName': 'Bear',
        'description': 'BearBot 1.0 - All Around',
        'hardness': 0.25,
        'baseEnergy': 1200,
        'storage': 100,
        'wobble': 0.7,
        'harvestEfficiency': 0.6,
        'cost': 300,
        'affinity': {},
        'klass': BearBot,
        'spriteSheet': 'pics/allaround0_2x.png',
        'spriteSpeed': 0.3,
        'gif': 'pics/allaround0.gif'
    },
    'antBot': {
        'uiName': 'Ant',
        'description': 'AntBot 1000 - Harvester',
        'hardness': 0.35,
        'baseEnergy': 1000,
        'storage': 200,
        'wobble': 0.4,
        'harvestEfficiency': 0.8,
        'cost': 550,
        'affinity': {},
        'klass': AntBot,
        'spriteSheet': 'pics/harvester0_2x.png',
        'spriteSpeed': 0.3,
        'gif': 'pics/harvester0.gif'
    },
    'goatBot': {
        'uiName': 'Goat',
        'description': 'GoatBot 1000 - Smasher',
        'hardness': 0.55,
        'baseEnergy': 1000,
        'storage': 0,
        'wobble': 0.5,
        'harvestEfficiency': 0,
        'cost': 1050,
        'affinity': {},
        'klass': GoatBot,
        'spriteSheet': 'pics/smasher0_2x.png',
        'spriteSpeed': 0.3,
        'gif': 'pics/smasher0.gif'
    },
    'vultureBot': {
        'uiName': 'Vulture',
        'description': 'VultureBot 1000 - Scavenger',
        'hardness': 0.1,
        'baseEnergy': 1500,
        'storage': 200,
        'wobble': 0.1,
        'harvestEfficiency': 0.7,
        'cost': 650,
        'affinity': {},
        'klass': VultureBot,
        'canSalvage': true,
        'spriteSheet': 'pics/vulture0_2x.png',
        'spriteSpeed': 0.3,
        'gif': 'pics/scavenger0.gif'
    }
};

// constants for scaling robot attributes for balancing purposes
var energy_scale = 0.1;
var WobbleConstant = 0.75;

// other constants
var salvageValueMultiplier = 0.5;

var upgradeCosts = {
    'squirrelBot': [0, 1500, 3000],
    'bearBot': [0, 3000, 6000],
    'antBot': [0, 5500, 11000],
    'goatBot': [0, 10500, 21000],
    'vultureBot': [0, 6500, 13000]
};

var robotLevels = {
    'squirrelBot': [
        robots['squirrelBot'],
        _.extend(_.clone(robots['squirrelBot']), {
            baseEnergy: 2500,
            wobble: 0.75,
            'spriteSheet': 'pics/scout1_2x.png',
            'spriteSpeed': 0.6
        }),
        _.extend(_.clone(robots['squirrelBot']), {
            baseEnergy: 3000,
            wobble: 0.6,
            'spriteSheet': 'pics/scout2_2x.png',
            'spriteSpeed': 1.0
        }),
    ],
    'bearBot': [
        robots['bearBot'],
        _.extend(_.clone(robots['bearBot']), {
            baseEnergy: 1400,
            storage: 125,
            wobble: 0.65,
            harvestEfficiency: 0.7,
            hardness: 0.45,
            'spriteSheet': 'pics/allaround1_2x.png',
            'spriteSpeed': 0.6
        }),
        _.extend(_.clone(robots['bearBot']), {
            baseEnergy: 1600,
            storage: 150,
            wobble: 0.6,
            harvestEfficiency: 0.8,
            hardness: 0.65,
            'spriteSheet': 'pics/allaround2_2x.png',
            'spriteSpeed': 1.0
        }),
    ],
    'antBot': [
        robots['antBot'],
        _.extend(_.clone(robots['antBot']), {
            baseEnergy: 1250,
            storage: 300,
            harvestEfficiency: 0.9,
            hardness: 0.65,
            'spriteSheet': 'pics/harvester0_2x.png',
            'spriteSpeed': 0.6
        }),
        _.extend(_.clone(robots['antBot']), {
            baseEnergy: 1500,
            storage: 400,
            harvestEfficiency: 1.0,
            hardness: 0.85,
            'spriteSheet': 'pics/harvester0_2x.png',
            'spriteSpeed': 1.0
        }),
    ],
    'goatBot': [
        robots['goatBot'],
        _.extend(_.clone(robots['goatBot']), {
            baseEnergy: 1100,
            hardness: 0.75,
            'spriteSheet': 'pics/smasher1_2x.png',
            'spriteSpeed': 0.6
        }),
        _.extend(_.clone(robots['goatBot']), {
            baseEnergy: 1200,
            hardness: 0.95,
            'spriteSheet': 'pics/smasher2_2x.png',
            'spriteSpeed': 1.0

        }),
    ],
    'vultureBot': [
        robots['vultureBot'],
        _.extend(_.clone(robots['vultureBot']), {
            baseEnergy: 1750,
            storage: 250,
            harvestEfficiency: 0.85,
            'spriteSheet': 'pics/vulture1_2x.png',
            'spriteSpeed': 0.6
        }),
        _.extend(_.clone(robots['vultureBot']), {
            baseEnergy: 2000,
            storage: 300,
            harvestEfficiency: 1.0,
            'spriteSheet': 'pics/vulture2_2x.png',
            'spriteSpeed': 1.0
        }),
    ]
};

function loadImage(src) {
    i = new Image();
    i.src = src;
    return i;
}

var resources = {
    'backfill': {
        'hardness': 0,
        'harvestable': false,
        'value': 0,
        'image': loadImage('pics/backfill03.png')
    },
    'dirt': {
        'hardness': 0,
        'harvestable': false,
        'value': 0,
        'image': loadImage('pics/rock11.png')
    },
    'rock': {
        'hardness': 0.3,
        'harvestable': false,
        'value': 0,
        'image': loadImage('pics/rock01.png')
    },
    'iron': {
        'hardness': 0.3,
        'harvestable': true,
        'value': 10,
        'image': loadImage('pics/rock04.png')
    },
    'mintium': {
        'hardness': 0.4,
        'harvestable': true,
        'value': 10,
        'image': loadImage('pics/rock09.png')
    },
    'junipum': {
        'hardness': 0.4,
        'harvestable': true,
        'value': 10,
        'image': loadImage('pics/rock08.png')
    },
    'paprikum': {
        'hardness': 0.4,
        'harvestable': true,
        'value': 10,
        'image': loadImage('pics/rock06.png')
    },
    'unexplored': {
        'hardness': 0.1,
        'harvestable': false,
        'value': 0,
        'image': loadImage('pics/defaultTile_2x.png')
    }
};

var asteroids = {
    "Bananasteroid": new Asteroid({
        'dirt': {pTop: 1, pBottom: 1, minDepth: 0},
        'rock': {pTop: 0.1, pBottom: 0.4, minDepth: 1},
        'iron': {pTop: 0.01, pBottom: 0.2, minDepth: 1},
        'mintium': {pTop: 0.01, pBottom: 0.05, minDepth: 10},
        'junipum': {pTop: 0.01, pBottom: 0.05, minDepth: 15},
        'paprikum': {pTop: 0.01, pBottom: 0.05, minDepth: 15}
    })
};
