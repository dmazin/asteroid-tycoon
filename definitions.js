// constants for scaling robot attributes for balancing purposes
var energy_scale = 0.1;
var WobbleConstant = 0.4;

// other constants
var explorationBonus = 10;
var salvageValueMultiplier = 0.5;

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
        // 'affinity': {
        //     'dirtite': 3
        // },
        'klass': SquirrelBot,
        'spriteSheet': 'pics/bots/scout0.png',
        'spriteSpeed': 0.3,
        'gif': 'pics/bots/scout0.gif'
    },
    'bearBot': {
        'uiName': 'Bear',
        'description': 'BearBot 1.0 - All Around',
        'hardness': 0.15,
        'baseEnergy': 1200,
        'storage': 100,
        'wobble': 0.7,
        'harvestEfficiency': 0.5,
        'cost': 300,
        'affinity': {
            'dirtite': 3
        },
        'klass': BearBot,
        'spriteSheet': 'pics/bots/allaround0.png',
        'spriteSpeed': 0.3,
        'gif': 'pics/bots/allaround0.gif'
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
        'spriteSheet': 'pics/bots/harvester0.png',
        'spriteSpeed': 0.3,
        'gif': 'pics/bots/harvester0.gif',
        'lockedTil': 'paydirtium'
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
        'spriteSheet': 'pics/bots/smasher0.png',
        'spriteSpeed': 0.3,
        'gif': 'pics/bots/smasher0.gif',
        'lockedTil': 'cheddarium'
    },
    'vultureBot': {
        'uiName': 'Vulture',
        'description': 'VultureBot 1000 - Scavenger',
        'hardness': 0.01,
        'baseEnergy': 1500,
        'storage': 0,
        'wobble': 0.1,
        'harvestEfficiency': 0.7,
        'cost': 650,
        'affinity': {},
        'klass': VultureBot,
        'canSalvage': true,
        'spriteSheet': 'pics/bots/scavenger0.png',
        'spriteSpeed': 0.3,
        'gif': 'pics/bots/scavenger0.gif',
        'lockedTil': 'fatlootium'
    }
};

// constants for scaling robot attributes for balancing purposes
var energy_scale = 0.1;
var WobbleConstant = 0.2;

var upgrades = {
    'squirrelBot': {
        costs: [0, 1500, 3000],
        mineralReqs: [0, 1, 200],
        mineral: "paydirtium"
    },
    'bearBot': {
        costs: [0, 3000, 6000],
        mineralReqs: [0, 3000, 6000],
        mineral: "cheddarium"
    },
    'antBot': {
        costs: [0, 5500, 11000],
        mineralReqs: [0, 5500, 11000],
        mineral: "fatlootium"
    },
    'goatBot': {
        costs: [0, 10500, 21000],
        mineralReqs: [0, 10500, 21000],
        mineral: "affluentium"
    },
    'vultureBot': {
        costs: [0, 6500, 13000],
        mineralReqs: [0, 6500, 13000],
        mineral: "cashmonium"
    }
};

var robotLevels = {
    'squirrelBot': [
        robots['squirrelBot'],
        _.extend(_.clone(robots['squirrelBot']), {
            'baseEnergy': 2500,
            'wobble': 0.75,
            'hardness': 0.25,
            'spriteSheet': 'pics/bots/scout1.png',
            'spriteSpeed': 0.6,
            'gif': 'pics/bots/scout1.gif'
        }),
        _.extend(_.clone(robots['squirrelBot']), {
            'baseEnergy': 3000,
            'wobble': 0.6,
            'hardness': 0.35,
            'spriteSheet': 'pics/bots/scout2.png',
            'spriteSpeed': 1.0,
            'gif': 'pics/bots/scout2.gif'
        }),
    ],
    'bearBot': [
        robots['bearBot'],
        _.extend(_.clone(robots['bearBot']), {
            'baseEnergy': 1400,
            'storage': 125,
            'wobble': 0.65,
            'harvestEfficiency': 0.6,
            'affinity': {
            'dirtite': 3,
            'dregsite': 3
        },
            'hardness': 0.25,
            'spriteSheet': 'pics/bots/allaround1.png',
            'spriteSpeed': 0.6,
            'gif': 'pics/bots/allaround1.gif'
        }),
        _.extend(_.clone(robots['bearBot']), {
            'baseEnergy': 1600,
            'storage': 150,
            'wobble': 0.6,
            'harvestEfficiency': 0.8,
            'affinity': {
            'dirtite': 3,
            'dregsite': 3,
            'rubbishite': 3
        },
            'hardness': 0.35,
            'spriteSheet': 'pics/bots/allaround2.png',
            'spriteSpeed': 1.0,
            'gif': 'pics/bots/allaround2.gif'
        }),
    ],
    'antBot': [
        robots['antBot'],
        _.extend(_.clone(robots['antBot']), {
            'baseEnergy': 1250,
            'storage': 300,
            'harvestEfficiency': 0.9,
            'hardness': 0.65,
            'spriteSheet': 'pics/bots/harvester1.png',
            'spriteSpeed': 0.6,
            'gif': 'pics/bots/harvester1.gif'
        }),
        _.extend(_.clone(robots['antBot']), {
            'baseEnergy': 1500,
            'storage': 400,
            'harvestEfficiency': 1.0,
            'hardness': 0.85,
            'spriteSheet': 'pics/bots/harvester2.png',
            'spriteSpeed': 1.0,
            'gif': 'pics/bots/harvester2.gif'
        }),
    ],
    'goatBot': [
        robots['goatBot'],
        _.extend(_.clone(robots['goatBot']), {
            'baseEnergy': 1100,
            'hardness': 0.75,
            'spriteSheet': 'pics/bots/smasher1.png',
            'spriteSpeed': 0.6,
            'gif': 'pics/bots/smasher1.gif'
        }),
        _.extend(_.clone(robots['goatBot']), {
            'baseEnergy': 1200,
            'hardness': 0.95,
            'spriteSheet': 'pics/bots/smasher2.png',
            'spriteSpeed': 1.0,
            'gif': 'pics/bots/smasher2.gif'

        }),
    ],
    'vultureBot': [
        robots['vultureBot'],
        _.extend(_.clone(robots['vultureBot']), {
            'baseEnergy': 1750,
            'storage': 250,
            'harvestEfficiency': 0.85,
            'spriteSheet': 'pics/bots/scavenger1.png',
            'spriteSpeed': 0.6,
            'gif': 'pics/bots/scavenger1.gif'
        }),
        _.extend(_.clone(robots['vultureBot']), {
            'baseEnergy': 2000,
            'storage': 300,
            'harvestEfficiency': 1.0,
            'spriteSheet': 'pics/bots/scavenger2.png',
            'spriteSpeed': 1.0,
            'gif': 'pics/bots/scavenger2.gif'
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
        'image': loadImage('pics/tiles/backfill.png')
    },
    'dirtite': {
        'hardness': 0.04,
        'harvestable': false,
        'value': 0,
        'image': loadImage('pics/tiles/dirt1.png')
    },
    'dregsite': {
        'hardness': 0.14,
        'harvestable': false,
        'value': 0,
        'image': loadImage('pics/tiles/dirt2.png')
    },
    'rubbishite': {
        'hardness': 0.24,
        'harvestable': false,
        'value': 0,
        'image': loadImage('pics/tiles/dirt3.png')
    },
    'junkite': {
        'hardness': 0.34,
        'harvestable': false,
        'value': 0,
        'image': loadImage('pics/tiles/dirt4.png')
    },
    'scrapite': {
        'hardness': 0.44,
        'harvestable': false,
        'value': 0,
        'image': loadImage('pics/tiles/dirt5.png')
    },
    'crapite': {
        'hardness': 0.54,
        'harvestable': false,
        'value': 0,
        'image': loadImage('pics/tiles/dirt6.png')
    },
    'densite': {
        'hardness': 0.64,
        'harvestable': false,
        'value': 0,
        'image': loadImage('pics/tiles/rock1.png')
    },
    'rigidite': {
        'hardness': 0.74,
        'harvestable': false,
        'value': 0,
        'image': loadImage('pics/tiles/rock2.png')
    },
    'toughite': {
        'hardness': 0.84,
        'harvestable': false,
        'value': 0,
        'image': loadImage('pics/tiles/rock3.png')
    },
    'unyieldite': {
        'hardness': 0.94,
        'harvestable': false,
        'value': 0,
        'image': loadImage('pics/tiles/rock4.png')
    },
    'imperviousite': {
        'hardness': 0.99,
        'harvestable': false,
        'value': 0,
        'image': loadImage('pics/tiles/rock5.png')
    },
    'paydirtium': {
        'hardness': 0.2,
        'harvestable': true,
        'value': 20,
        'image': loadImage('pics/tiles/mineral1.png')
    },
    'cheddarium': {
        'hardness': 0.3,
        'harvestable': true,
        'value': 30,
        'image': loadImage('pics/tiles/mineral2.png')
    },
    'fatlootium': {
        'hardness': 0.4,
        'harvestable': true,
        'value': 40,
        'image': loadImage('pics/tiles/mineral3.png')
    },
    'affluentium': {
        'hardness': 0.5,
        'harvestable': true,
        'value': 50,
        'image': loadImage('pics/tiles/mineral4.png')
    },
    'cashmonium': {
        'hardness': 0.6,
        'harvestable': true,
        'value': 60,
        'image': loadImage('pics/tiles/mineral5.png')
    },
    'unexplored': {
        'hardness': 0,
        'harvestable': false,
        'value': 0,
        'image': loadImage('pics/tiles/undiscovered.png')
    }
};


var asteroids = {
    "Paydirteroid": new Asteroid({
        'dirtite': {pTop: 1, pBottom: 1, minDepth: 0},
        'dregsite': {pTop: 0.1, pBottom: 0.4, minDepth: 1},
        'rubbishite': {pTop: 0.01, pBottom: 0.2, minDepth: 1},
        'imperviousite': {pTop: 100, pBottom: 0, minDepth: 25},
        'paydirtium': {pTop: 0.4, pBottom: 0.4, minDepth: 1},
        'cheddarium': {pTop: 0.01, pBottom: 0.05, minDepth: 10},
        'fatlootium': {pTop: 0.01, pBottom: 0.05, minDepth: 10}
    }),
    "Cheddaroid": new Asteroid({
        'dirtite': {pTop: 1, pBottom: 1, minDepth: 0},
        'dregsite': {pTop: 0.2, pBottom: 0.4, minDepth: 1},
        'rubbishite': {pTop: 0.2, pBottom: 0.2, minDepth: 1},
        'junkite': {pTop: 0.2, pBottom: 0.2, minDepth: 1},
        'scrapite': {pTop: 0.2, pBottom: 0.2, minDepth: 1},
        'crapite': {pTop: 0.1, pBottom: 0.2, minDepth: 1},
        'paydirtium': {pTop: 0.1, pBottom: 0.05, minDepth: 1},
        'cheddarium': {pTop: 0.1, pBottom: 0.5, minDepth: 1},
        'fatlootium': {pTop: 0.01, pBottom: 0.05, minDepth: 5}
    }),
    "Fatlooteroid": new Asteroid({
        'dirtite': {pTop: 1, pBottom: 1, minDepth: 0},
        'dregsite': {pTop: 0.2, pBottom: 0.4, minDepth: 1},
        'rubbishite': {pTop: 0.2, pBottom: 0.2, minDepth: 1},
        'junkite': {pTop: 0.2, pBottom: 0.2, minDepth: 1},
        'scrapite': {pTop: 0.2, pBottom: 0.2, minDepth: 1},
        'crapite': {pTop: 0.1, pBottom: 0.2, minDepth: 1},
        'densite': {pTop: 0.2, pBottom: 0.2, minDepth: 1},
        'rigidite': {pTop: 0.1, pBottom: 0.2, minDepth: 1},
        'paydirtium': {pTop: 0.05, pBottom: 0.05, minDepth: 1},
        'cheddarium': {pTop: 0.05, pBottom: 0.1, minDepth: 1},
        'fatlootium': {pTop: 0.3, pBottom: 0.5, minDepth: 10},
        'affluentium': {pTop: 0.01, pBottom: 0.05, minDepth: 15}
    }),
    "Affluoid": new Asteroid({
        'dirtite': {pTop: 1, pBottom: 1, minDepth: 0},
        'dregsite': {pTop: 0.2, pBottom: 0.4, minDepth: 1},
        'rubbishite': {pTop: 0.2, pBottom: 0.2, minDepth: 1},
        'junkite': {pTop: 0.2, pBottom: 0.2, minDepth: 1},
        'scrapite': {pTop: 0.2, pBottom: 0.2, minDepth: 1},
        'crapite': {pTop: 0.1, pBottom: 0.2, minDepth: 1},
        'densite': {pTop: 0.2, pBottom: 0.2, minDepth: 1},
        'rigidite': {pTop: 0.1, pBottom: 0.2, minDepth: 1},
        'toughite': {pTop: 0.1, pBottom: 0.2, minDepth: 1},
        'paydirtium': {pTop: 0.02, pBottom: 0.05, minDepth: 1},
        'cheddarium': {pTop: 0.02, pBottom: 0.1, minDepth: 1},
        'fatlootium': {pTop: 0.05, pBottom: 0.1, minDepth: 10},
        'affluentium': {pTop: 0.3, pBottom: 0.5, minDepth: 15},
        'cashmonium': {pTop: 0.01, pBottom: 0.05, minDepth: 15}
    }),
    "Cashmonoid": new Asteroid({
        'dirtite': {pTop: 1, pBottom: 1, minDepth: 0},
        'dregsite': {pTop: 0.2, pBottom: 0.4, minDepth: 1},
        'rubbishite': {pTop: 0.2, pBottom: 0.2, minDepth: 1},
        'junkite': {pTop: 0.2, pBottom: 0.2, minDepth: 1},
        'scrapite': {pTop: 0.2, pBottom: 0.2, minDepth: 1},
        'crapite': {pTop: 0.1, pBottom: 0.2, minDepth: 1},
        'toughite': {pTop: 0.1, pBottom: 0.2, minDepth: 1},
        'unyieldite': {pTop: 0.1, pBottom: 0.2, minDepth: 1},
        'cheddarium': {pTop: 0.02, pBottom: 0.3, minDepth: 1},
        'fatlootium': {pTop: 0.05, pBottom: 0.3, minDepth: 10},
        'affluentium': {pTop: 0.05, pBottom: 0.3, minDepth: 15},
        'cashmonium': {pTop: 0.2, pBottom: 0.5, minDepth: 15}
    })
};
