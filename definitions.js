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
        'displayName' : 'SquirrelBot',
        'displayText' : 'A scout that sees further than its peers.',
        'description': 'SquirrelBot 1.0 - Scout',
        'hardness': 0.13,
        'baseEnergy': 2000,
        'storage': 0,
        'wobble': 0.9,
        'harvestEfficiency': 0,
        'cost': 100,
        'affinity': {},
        'klass': SquirrelBot,
        'spriteSheet': 'pics/bots/scout0.png',
        'spriteSpeed': 0.3,
        'gifName': 'scout',
        'lockedTil': null,
        'exploreRadius' : 3,
        'level' : 0
    },
    'bearBot': {
        'uiName': 'Bear',
        'displayName' : 'BearBot',
        'displayText' : 'Clears dirt quickly and harvests minerals.',
        'description': 'BearBot 1.0 - All Around',
        'hardness': 0.25,
        'baseEnergy': 1200,
        'storage': 100,
        'wobble': 0.7,
        'harvestEfficiency': 0.5,
        'cost': 250,
        'affinity': {
            'dirtite': 3,
            'dregsite': 2,
            'rubbishite': 1
        },
        'klass': BearBot,
        'spriteSheet': 'pics/bots/allaround0.png',
        'spriteSpeed': 0.3,
        'gifName': 'allaround',
        'lockedTil': {
            asteroid: 'Paydirteroid',
            row: 3
        },
        'exploreRadius' : 1,
        'level' : 0
    },
    'antBot': {
        'uiName': 'Ant',
        'displayName' : 'AntBot',
        'displayText' : 'Most effective mineral harverster.',
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
        'gifName': 'harvester',
        'lockedTil': {
            asteroid: 'Cheddaroid',
            row: 20
        },
        'exploreRadius' : 1,
        'level' : 0
    },
    'goatBot': {
        'uiName': 'Goat',
        'displayName' : 'GoatBot',
        'displayText' : 'Smashes rocks!',
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
        'gifName': 'smasher',
        'lockedTil': {
            asteroid: 'Fatlooteroid',
            row: 15
        },
        'exploreRadius' : 1,
        'level' : 0
    },
    'vultureBot': {
        'uiName': 'Vulture',
        'displayName' : 'VultureBot',
        'displayText' : 'Reclaims the wreckage of dead bots.',
        'description': 'VultureBot 1000 - Scavenger',
        'hardness': 0.01,
        'baseEnergy': 1500,
        'storage': 0,
        'wobble': 0.1,
        'harvestEfficiency': 0.2,
        'cost': 650,
        'affinity': {},
        'klass': VultureBot,
        'canSalvage': true,
        'spriteSheet': 'pics/bots/scavenger0.png',
        'spriteSpeed': 0.3,
        'gifName': 'scavenger',
        'lockedTil': {
            asteroid: 'Paydirteroid',
            row: 20
        },
        'exploreRadius' : 1,
        'level' : 0
    },
    'badgerBot': {
        'uiName': 'Badger',
        'displayName' : 'BadgerBot',
        'displayText' : 'Destroys all in its path.',
        'description': 'BadgerBot 9000',
        'hardness': 1,
        'baseEnergy': 5000,
        'storage': 1000,
        'wobble': 0.1,
        'harvestEfficiency': 1,
        'cost': 5000,
        'affinity': {
            'motherlodium': 1.05
        },
        'klass': BadgerBot,
        'canSalvage': false,
        'spriteSheet': 'pics/bots/mecha.png',
        'spriteSpeed': 0.3,
        'gifName': 'mecha',
        'lockedTil': {
            asteroid: 'Cashmonoid',
            row: 27,
            specialCondition: true
        },
        'exploreRadius' : 1,
        'level' : 0
    }
};

var upgrades = {
    'squirrelBot': {
        // costs: [0, 1500, 3000],
        costs: [0, 1500, 4500],
        lockedTil: [
            null,
            {
                asteroid: 'Cheddaroid',
                row: 27
            },
            {
                asteroid: 'Affluoid',
                row: 27
            }
        ]
    },
    'bearBot': {
        // costs: [0, 3000, 6000],
        costs: [0, 3000, 9000],
        lockedTil: [
            null,
            {
                asteroid: 'Cheddaroid',
                row: 27
            },
            {
                asteroid: 'Affluoid',
                row: 27
            }
        ]
    },
    'antBot': {
        // costs: [0, 5500, 11000],
        costs: [0, 5500, 16500],
        lockedTil: [
            null,
            {
                asteroid: 'Fatlooteroid',
                row: 27
            },
            {
                asteroid: 'Affluoid',
                row: 27
            }
        ]
    },
    'goatBot': {
        // costs: [0, 10500, 21000],
        costs: [0, 10500, 31500],
        lockedTil: [
            null,
            {
                asteroid: 'Fatlooteroid',
                row: 27
            },
            {
                asteroid: 'Affluoid',
                row: 27
            }
        ]
    },
    'vultureBot': {
        // costs: [0, 6500, 13000],
        costs: [0, 6500, 19500],
        lockedTil: [
            null,
            {
                asteroid: 'Fatlooteroid',
                row: 27
            },
            {
                asteroid: 'Affluoid',
                row: 27
            }
        ]
    },
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
            'exploreRadius' : 4,
            'level' : 1
        }),
        _.extend(_.clone(robots['squirrelBot']), {
            'baseEnergy': 3000,
            'wobble': 0.6,
            'hardness': 0.35,
            'spriteSheet': 'pics/bots/scout2.png',
            'spriteSpeed': 1.0,
            'exploreRadius' : 5,
            'level' : 2
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
                'dirtite': 1,
                'dregsite': 3,
                'rubbishite': 3,
                'junkite': 2
            },
            'hardness': 0.35,
            'spriteSheet': 'pics/bots/allaround1.png',
            'spriteSpeed': 0.6,
            'level' : 1
        }),
        _.extend(_.clone(robots['bearBot']), {
            'baseEnergy': 1600,
            'storage': 150,
            'wobble': 0.6,
            'harvestEfficiency': 0.8,
            'affinity': {
                'dirtite': 1,
                'dregsite': 1,
                'rubbishite': 2,
                'junkite': 2,
                'scrapite': 3,
                'densite': 3,
            },
            'hardness': 0.55,
            'spriteSheet': 'pics/bots/allaround2.png',
            'spriteSpeed': 1.0,
            'level' : 2
        }),
    ],
    'antBot': [
        robots['antBot'],
        _.extend(_.clone(robots['antBot']), {
            'baseEnergy': 1250,
            'storage': 300,
            'harvestEfficiency': 0.9,
            'hardness': 0.55,
            'spriteSheet': 'pics/bots/harvester1.png',
            'spriteSpeed': 0.6,
            'level' : 1
        }),
        _.extend(_.clone(robots['antBot']), {
            'baseEnergy': 1500,
            'storage': 400,
            'harvestEfficiency': 1.0,
            'hardness': 0.65,
            'spriteSheet': 'pics/bots/harvester2.png',
            'spriteSpeed': 1.0,
            'level' : 2
        }),
    ],
    'goatBot': [
        robots['goatBot'],
        _.extend(_.clone(robots['goatBot']), {
            'baseEnergy': 1100,
            'hardness': 0.75,
            'spriteSheet': 'pics/bots/smasher1.png',
            'spriteSpeed': 0.6,
            'level' : 1
        }),
        _.extend(_.clone(robots['goatBot']), {
            'baseEnergy': 1200,
            'hardness': 0.95,
            'spriteSheet': 'pics/bots/smasher2.png',
            'spriteSpeed': 1.0,
            'level' : 2
        }),
    ],
    'vultureBot': [
        robots['vultureBot'],
        _.extend(_.clone(robots['vultureBot']), {
            'baseEnergy': 1750,
            'storage': 250,
            'harvestEfficiency': 0.4,
            'spriteSheet': 'pics/bots/scavenger1.png',
            'spriteSpeed': 0.6,
            'level' : 1
        }),
        _.extend(_.clone(robots['vultureBot']), {
            'baseEnergy': 2000,
            'storage': 300,
            'harvestEfficiency': 0.6,
            'spriteSheet': 'pics/bots/scavenger2.png',
            'spriteSpeed': 1.0,
            'level' : 2
        }),
    ],
    'badgerBot': [
        robots['badgerBot']
    ]
};

function loadImage(src) {
    var i = new Image();
    i.src = src;
    return i;
}

function loadImageFromSpriteSheet(src) {
    var sheet = new createjs.SpriteSheet({
        images: [src],
        frames: {width:40, height:40}
    });
    return sheet;
}

var resources = {
    'backfill': {
        'hardness': 0,
        'harvestable': false,
        'value': 0,
        'imagePath' : 'pics/tiles/backfill.png',
        'image': loadImage('pics/tiles/backfill.png'),
        'text': "Backfill from mining operation."
    },
    'dirtite': {
        'hardness': 0.04,
        'harvestable': false,
        'value': 0,
        'imagePath' : 'pics/tiles/dirt1.png',
        'image': loadImage('pics/tiles/dirt1.png'),
        'text': "It's just dirt."
    },
    'dregsite': {
        'hardness': 0.14,
        'harvestable': false,
        'value': 0,
        'imagePath' : 'pics/tiles/dirt2.png',
        'image': loadImage('pics/tiles/dirt2.png'),
        'text' : 'The very dregs of an alien society.'
    },
    'rubbishite': {
        'hardness': 0.24,
        'harvestable': false,
        'value': 0,
        'imagePath' : 'pics/tiles/dirt3.png',
        'image': loadImage('pics/tiles/dirt3.png'),
        'text' : 'Down in the dumps.'
    },
    'junkite': {
        'hardness': 0.34,
        'harvestable': false,
        'value': 0,
        'imagePath' : 'pics/tiles/dirt4.png',
        'image': loadImage('pics/tiles/dirt4.png'),
        'text' : 'One man\'s trash is our trash too.'
    },
    'scrapite': {
        'hardness': 0.44,
        'harvestable': false,
        'value': 0,
        'imagePath' : 'pics/tiles/dirt5.png',
        'image': loadImage('pics/tiles/dirt5.png'),
        'text' : 'Not even the useful kind of scrap.'
    },
    'crapite': {
        'hardness': 0.54,
        'harvestable': false,
        'value': 0,
        'imagePath' : 'pics/tiles/dirt6.png',
        'image': loadImage('pics/tiles/dirt6.png'),
        'text' : "Oh, crap!"
    },
    'densite': {
        'hardness': 0.64,
        'harvestable': false,
        'value': 0,
        'imagePath' : 'pics/tiles/rock1.png',
        'image': loadImage('pics/tiles/rock1.png'),
        'text' : 'Don\'t be dense.'
    },
    'rigidite': {
        'hardness': 0.74,
        'harvestable': false,
        'value': 0,
        'imagePath' : 'pics/tiles/rock2.png',
        'image': loadImage('pics/tiles/rock2.png'),
        'text' : 'A particularly stubborn sort of rock.'
    },
    'toughite': {
        'hardness': 0.84,
        'harvestable': false,
        'value': 0,
        'imagePath' : 'pics/tiles/rock3.png',
        'image': loadImage('pics/tiles/rock3.png'),
        'text' : 'This one\'s a toughie.'
    },
    'unyieldite': {
        'hardness': 0.94,
        'harvestable': false,
        'value': 0,
        'imagePath' : 'pics/tiles/rock4.png',
        'image': loadImage('pics/tiles/rock4.png'),
        'text' : 'It won\'t budge an inch.'
    },
    'imperviousite': {
        'hardness': 0.99,
        'harvestable': false,
        'value': 0,
        'imagePath' : 'pics/tiles/rock5.png',
        'image': loadImage('pics/tiles/rock5.png'),
        'text' : 'Hmm, how do we get through this?'
    },
    'paydirtium': {
        'hardness': 0.2,
        'harvestable': true,
        'value': 20,
        'imagePath' : 'pics/tiles/mineral1.png',
        'image': loadImage('pics/tiles/mineral1.png'),
        'text' : "It's just dirt. Or is it?",
        'abbrev': 'PAYD'
    },
    'cheddarium': {
        'hardness': 0.3,
        'harvestable': true,
        'value': 30,
        'imagePath' : 'pics/tiles/mineral2.png',
        'image': loadImage('pics/tiles/mineral2.png'),
        'text' : 'Delicious AND valuable.',
        'abbrev': 'CHED'
    },
    'fatlootium': {
        'hardness': 0.4,
        'harvestable': true,
        'value': 40,
        'imagePath' : 'pics/tiles/mineral3.png',
        'image': loadImage('pics/tiles/mineral3.png'),
        'text' : 'Not to be confused with \'phatlootium\'.',
        'abbrev': 'FATL'
    },
    'affluentium': {
        'hardness': 0.5,
        'harvestable': true,
        'value': 50,
        'imagePath' : 'pics/tiles/mineral4.png',
        'image': loadImage('pics/tiles/mineral4.png'),
        'text' : 'This mineral is comfortably well-off.',
        'abbrev': 'AFFL'
    },
    'cashmonium': {
        'hardness': 0.6,
        'harvestable': true,
        'value': 60,
        'imagePath' : 'pics/tiles/mineral5.png',
        'image': loadImage('pics/tiles/mineral5.png'),
        'text' : 'The rarest of all asteroid minerals.',
        'abbrev': 'CASH'
    },
    'artifact': {
        'hardness': 0,
        'harvestable': true,
        'value': null,
        'imagePath' : 'pics/2x_gifs/artifact.gif',
        'image': loadImage('pics/tiles/dirt1.png'),
        'sprite': loadImageFromSpriteSheet('pics/other/artifact.png'),
        'text' : "I wonder what it is.",
        'abbrev': 'ARTI'
    },
    'motherlodium': {
        'hardness': 0.99,
        'harvestable': true,
        'value': 1000,
        'imagePath' : 'pics/tiles/mineral6.png',
        'image': loadImage('pics/tiles/mineral6.png'),
        'text' : 'Mmm, weapons grade...',
        'abbrev': 'MOTH'
    },
    'unexplored': {
        'hardness': 0,
        'harvestable': false,
        'value': 0,
        'imagePath' : 'pics/tiles/undiscovered.png',
        'image': loadImage('pics/tiles/undiscovered.png'),
        'text' : '???!'
    },
    'lava': {
        'hardness': 0,
        'harvestable': false,
        'value': 0,
        'imagePath' : 'pics/tiles/totally_lava.png',
        'image': loadImage('pics/tiles/totally_lava.png'),
        'text' : 'Oh my!'
    }
};


var asteroids = {
    "Paydirteroid": new Asteroid({
        'name': "Paydirteroid",
        'bgImage': 'pics/asteroids/paydirtoidbg.png',
        'terrainParameters': {
            //dirt and rocks
            'dirtite': {pTop: 1, pBottom: 1, minDepth: 0},
            'dregsite': {pTop: .1, pBottom: .8, minDepth: .05},
            'rubbishite': {pTop: 0.1, pBottom: 0.6, minDepth: 0.25},
            'junkite': {pTop: 0.2, pBottom: 0.7, minDepth: 0.7},
            // 'scrapite': {pTop: 0, pBottom: 0, minDepth: 0.},
            // 'crapite': {pTop: 0, pBottom: 0, minDepth: 0},
            // 'densite': {pTop: 0, pBottom: 0, minDepth: 0},
            // 'rigidite': {pTop: 0, pBottom: 0, minDepth: 0},
            // 'toughite': {pTop: 0, pBottom: 0, minDepth: 0},
            // 'unyieldite': {pTop: 0, pBottom: 0, minDepth: 0},

            // minerals and goodies
            'artifact': {pTop: 0, pBottom: 0.1, minDepth: 0},
            'paydirtium':{pTop: 0.1, pBottom: 1, minDepth: 0},
            'cheddarium':{pTop: 0.4, pBottom: 1, minDepth: 0.6},
            'fatlootium': {pTop: 0.3, pBottom: 0.3, minDepth: 0.85},
            // 'affluentium': {pTop: 0, pBottom: 0, minDepth: 0},
            // 'cashmonium': {pTop: 0, pBottom: 0, minDepth: 0},
            'motherlodium': {pTop: 1, pBottom: 1, minDepth: .95},

            // pain and death
            // 'lava': {pTop: 0, pBottom: 0, minDepth: 0}
        },
        'artifactValueScale': 1.0
    }),

    "Cheddaroid": new Asteroid({
        'name': "Cheddaroid",
        'bgImage': 'pics/asteroids/cheddariodbg.png',
        'terrainParameters': {
            //dirt and rocks
            'dirtite': {pTop: 1.5, pBottom: .5, minDepth: 0},
            'dregsite': {pTop: 1, pBottom: 1, minDepth: 0},
            'rubbishite': {pTop: 0.1, pBottom: .6, minDepth: 0.5},
            'junkite': {pTop: 0.1, pBottom: 0.4, minDepth: 0.7},
            // 'scrapite': {pTop: 0, pBottom: 0, minDepth: 0},
            // 'crapite': {pTop: 0, pBottom: 0, minDepth: 0},
            // 'densite': {pTop: 0, pBottom: 0, minDepth: 0},
            // 'rigidite': {pTop: 0, pBottom: 0, minDepth: 0},
            // 'toughite': {pTop: 0, pBottom: 0, minDepth: 0},
            // 'unyieldite': {pTop: 0, pBottom: 0, minDepth: 0},

            // minerals and goodies
            'artifact': {pTop: 0, pBottom: 0.1, minDepth: 0},
            'paydirtium':{pTop: 0.3, pBottom: 0.2, minDepth: 0},
            'cheddarium':{pTop: 0.2, pBottom: 1, minDepth: 0},
            'fatlootium': {pTop: 0.2, pBottom: 0.8, minDepth: 0.6},
            // 'affluentium': {pTop: 0, pBottom: 0, minDepth: 0},
            // 'cashmonium': {pTop: 0, pBottom: 0, minDepth: 0},

            // pain and death
            'lava': {pTop: 0, pBottom: 0, minDepth: 0}
        },
        'artifactValueScale': 1.0
    }),

    "Fatlooteroid": new Asteroid({
        'name': "Fatlooteroid",
        'bgImage': 'pics/asteroids/fatlootiodbg.png',
        'terrainParameters': {
            //dirt and rocks
            // 'dirtite': {pTop: 0, pBottom: 0, minDepth: 0},
            // 'dregsite': {pTop: 0, pBottom: 0, minDepth: 0},
            'rubbishite': {pTop: 1, pBottom: 0, minDepth: 0},
            'junkite': {pTop: 1, pBottom: 0.1, minDepth: 0},
            'scrapite': {pTop: 0.1, pBottom: 1, minDepth: 0},
            'crapite': {pTop: 0.3, pBottom: 0.6, minDepth: 0.6},
            // 'densite': {pTop: 0, pBottom: 0, minDepth: 0},
            // 'rigidite': {pTop: 0, pBottom: 0, minDepth: 0},
            // 'toughite': {pTop: 0, pBottom: 0, minDepth: 0},
            // 'unyieldite': {pTop: 0, pBottom: 0, minDepth: 0},

            // minerals and goodies
            'artifact': {pTop: 0, pBottom: 0.1, minDepth: 0},
            'paydirtium':{pTop: 0.5, pBottom: 0, minDepth: 0},
            'cheddarium':{pTop: 1, pBottom: 0.1, minDepth: 0},
            'fatlootium': {pTop: 0.1, pBottom: 1, minDepth: 0},
            'affluentium': {pTop: 0.5, pBottom: 0.5, minDepth: 0.8},
            // 'cashmonium': {pTop: 0, pBottom: 0, minDepth: 0},

            // pain and death
            // 'lava': {pTop: 0, pBottom: 0, minDepth: 0}
        },
        'artifactValueScale': 1.25
    }),

    "Affluoid": new Asteroid({
        'name': "Affluoid",
        'bgImage': 'pics/asteroids/affluoidbg.png',
        'terrainParameters': {
            //dirt and rocks
            // 'dirtite': {pTop: 0, pBottom: 0, minDepth: 0},
            // 'dregsite': {pTop: 0, pBottom: 0, minDepth: 0},
            // 'rubbishite': {pTop: 0, pBottom: 0, minDepth: 0},
            // 'junkite': {pTop: 0.5, pBottom: 0, minDepth: 0},
            'scrapite': {pTop: 1, pBottom: 0, minDepth: 0},
            'crapite': {pTop: 0.5, pBottom: 0.7, minDepth: 0},
            'densite': {pTop: 0.3, pBottom: 0.7, minDepth: 0.3},
            'rigidite': {pTop: 0.2, pBottom: 0.5, minDepth: 0.5},
            // 'toughite': {pTop: 0, pBottom: 0, minDepth: 0},
            // 'unyieldite': {pTop: 0, pBottom: 0, minDepth: 0},

            // minerals and goodies
            'artifact': {pTop: 0, pBottom: 0.1, minDepth: 0},
            // 'paydirtium':{pTop: 0, pBottom: 0, minDepth: 0},
            // 'cheddarium':{pTop: 0, pBottom: 0, minDepth: 0},
            'fatlootium': {pTop: 0.8, pBottom: 0, minDepth: 0},
            'affluentium': {pTop: 0.1, pBottom: 1, minDepth: 0},
            'cashmonium': {pTop: 0.5, pBottom: 0.5, minDepth: 0.8},

            // pain and death
            // 'lava': {pTop: 0, pBottom: 0, minDepth: 0}
        },
        'artifactValueScale': 1.5
    }),

    "Cashmonoid": new Asteroid({
        'name': "Cashmonoid",
        'bgImage': 'pics/asteroids/cashmonoidbg.png',
        'terrainParameters': {
            //dirt and rocks
            // 'dirtite': {pTop: 0, pBottom: 0, minDepth: 0},
            // 'dregsite': {pTop: 0, pBottom: 0, minDepth: 0},
            // 'rubbishite': {pTop: 0, pBottom: 0, minDepth: 0},
            // 'junkite': {pTop: 0, pBottom: 0, minDepth: 0},
            // 'scrapite': {pTop: 0.5, pBottom: 0, minDepth: 0},
            // 'crapite': {pTop: 0.5, pBottom: 0, minDepth: 0},
            'densite': {pTop: 0.6, pBottom: 0.01, minDepth: 0},
            'rigidite': {pTop: 0.5, pBottom: 0.1, minDepth: 0},
            'toughite': {pTop: 0.2, pBottom: 0.4, minDepth: 0.2},
            'unyieldite': {pTop: 0.01, pBottom: 1, minDepth: 0},

            // minerals and goodies
            'artifact': {pTop: 0, pBottom: 0.1, minDepth: 0},
            // 'paydirtium':{pTop: 0, pBottom: 0, minDepth: 0},
            // 'cheddarium':{pTop: 0, pBottom: 0, minDepth: 0},
            // 'fatlootium': {pTop: 0, pBottom: 0, minDepth: 0},
            'affluentium': {pTop: 0.8, pBottom: 0.01, minDepth: 0},
            'cashmonium': {pTop: 0.1, pBottom: 1, minDepth: 0},

            // pain and death
            'lava': {pTop: 0, pBottom: 0, minDepth: 0}
        },
        'artifactValueScale': 2.0
    }),

    /*"Lavaroid": new Asteroid({
        'name': "Lavaroid",
        "terrainParameters: {
            'dirtite': {pTop: 1, pBottom: 1, minDepth: 0},
            'dregsite': {pTop: 0.1, pBottom: 0.4, minDepth: 1},
            'rubbishite': {pTop: 0.01, pBottom: 0.2, minDepth: 1},
            'imperviousite': {pTop: 100, pBottom: 0, minDepth: 25},
            'paydirtium': {pTop: 0.4, pBottom: 0.4, minDepth: 1},
            'cheddarium': {pTop: 0.01, pBottom: 0.05, minDepth: 10},
            'fatlootium': {pTop: 0.01, pBottom: 0.05, minDepth: 10},
            'lava': {pTop:.1, pBottom: .3, minDepth:5}
        },
        'artifactValueScale': 2.5
    })*/
};
