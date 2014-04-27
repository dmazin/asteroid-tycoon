// Definitions of base-level robots - spawn using robotLevels, not robots
var robots = {
    'squirrelBot': {
        'description': 'SquirrelBot 1.0 - Scout',
        'hardness': 0.13,
        'baseEnergy': 2000,
        'storage': 0,
        'wobble': 0.9,
        'harvestEfficiency': 0,
        'cost': 150,
        'klass': SquirrelBot,
        'spriteSheet': 'pics/scout0_2x.png',
        'spriteSpeed': 0.3,
        'gif': 'pics/scout0.gif'

    },
    'bearBot': {
        'description': 'BearBot 1.0 - All Around',
        'hardness': 0.25,
        'baseEnergy': 1200,
        'storage': 100,
        'wobble': 0.7,
        'harvestEfficiency': 0.6,
        'cost': 300,
        'klass': BearBot,
        'spriteSheet': 'pics/allaround0_2x.png',
        'spriteSpeed': 0.3,
        'gif': 'pics/allaround0.gif'
    },
    'antBot': {
        'description': 'AntBot 1000 - Harvester',
        'hardness': 0.35,
        'baseEnergy': 1000,
        'storage': 200,
        'wobble': 0.4,
        'harvestEfficiency': 0.8,
        'cost': 550,
        'klass': AntBot,
        'spriteSheet': 'pics/harvester0_2x.png',
        'spriteSpeed': 0.3,
        'gif': 'pics/harvester0.gif'
    },
    'goatBot': {
        'description': 'GoatBot 1000 - Smasher',
        'hardness': 0.55,
        'baseEnergy': 1000,
        'storage': 0,
        'wobble': 0.5,
        'harvestEfficiency': 0,
        'cost': 1050,
        'klass': GoatBot,
        'spriteSheet': 'pics/smasher0_2x.png',
        'spriteSpeed': 0.3,
        'gif': 'pics/smasher0.gif'
    },
    'vultureBot': {
        'description': 'VultureBot 1000 - Scavenger',
        'hardness': 0.1,
        'baseEnergy': 1500,
        'storage': 200,
        'wobble': 0.1,
        'harvestEfficiency': 0.7,
        'cost': 650,
        'klass': VultureBot,
        'spriteSheet': 'pics/vulture0_2x.png',
        'spriteSpeed': 0.3,
        'gif': 'pics/scavenger0.gif'
    }
};

var buy_button_template = _.template($('#robot-buy-button-template').html());
_.each(robots, function(val, key) {
    var data = _.extend(val, {'name': key});
    var rendered = buy_button_template(data);
    $('.controls .robot-spawn').append(rendered);
});

var WobbleConstant = 0.5;

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

var resources = {
    'backfill': {
        'hardness': 0,
        'harvestable': false,
        'value': 0,
        'image': 'pics/backfill_2x.png'
    },
    'dirt': {
        'hardness': 0,
        'harvestable': false,
        'value': 0,
        'image': 'pics/rock11.png'
    },
    'rock': {
        'hardness': 0.3,
        'harvestable': false,
        'value': 0,
        'image': 'pics/rock08.png'
    },
    'iron': {
        'hardness': 0.35,
        'harvestable': true,
        'value': 10,
        'image': 'pics/rock04.png'
    },
    'unexplored': {
        'hardness': 0.1,
        'harvestable': false,
        'value': 0,
        'image': 'pics/defaultTile_2x.png'
    }
};
