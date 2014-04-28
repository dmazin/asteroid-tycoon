var Asteroid = function (name, terrainParameters, artifactValueScale) {
    var grid = [];
    var deadBots = [];
    var initialized = false;
    var startSeed = Math.random();
    var seed;

    this.artifactValueScale = artifactValueScale;

    this.init = function () {
        seed = startSeed;
        if (!initialized) {
            initialized = true;
            initialize_grid();
        }
    }

    this.getName = function () {
        return name;
    }

    this.getGrid = function () {
        return grid;
    }

    this.getDeadBots = function () {
        return deadBots;
    }

    this.refresh = function () {
        for (var i = 0; i < game_width; i++) {
            for (var j = 0; j < game_height; j++) {
                grid[i][j].addToStage();
            }
        }
    }

    this.reachLine = function (lineNum) {
        _.each(robots, function (robot, robotType) {
            if (robot.lockedTil && robot.lockedTil.asteroid == name
                    && robot.lockedTil.row <= lineNum) {
                Robot.unlock(robotType);
            }
        });

        _.each(upgrades, function (upgrade, robotType) {
            _.each(upgrade.lockedTil, function (level, levelNum) {
                if (level && level.asteroid == name && level.row <= lineNum) {
                    unlockUpgrade(robotType, levelNum);
                }
            });
        });
    }

    function initialize_grid() {
        for (var i = 0; i < game_width; i++) {
            var line = [];
            for (var j = 0; j < game_height; j++) {
                var resourceName = generate_terrain(j, game_height);
                if (j === 0) {
                    resourceName = "dirtite";
                }
                var amount = Math.floor(Math.random() * 20);
                var g = new Tile(i * grid_size,
                                 surface_height + j * grid_size,
                                 grid_size,
                                 resourceName,
                                 amount,
                                 [i, j]);

                line.push(g);
            }
            grid.push(line);
        }
    }

    function generate_terrain(depth) {
        function random () {
            var x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        }

        function normalize(array) {
            var total = _.reduce(array,
                    function(m, n) { return m + n;},
                    0);
            return _.map(array, function(x) { return x / total; });
        }


        var resources = [];
        var maxDepth = game_height;

        if (depth == maxDepth - 3) {
            // row of imperviousite
            return 'imperviousite';
        }

        var probs = _.map(terrainParameters, function(x, r) {
            var minDepth = Math.round(x.minDepth * maxDepth); // % -> row #
            resources.push(r);
            if (depth < minDepth) {
                return 0;
            } else {
                return (maxDepth - depth - 1) * x.pTop + (depth - minDepth) * x.pBottom;
            }
        });

        probs = normalize(probs);
        var rand = Math.random();

        var accum = 0;
        for (var i = 0; i < resources.length; i++) {
            accum += probs[i];
            if (rand < accum) {
                return resources[i];
            }
        }
    }
}

function drawAsteroidSelectionScreen() {
    $('canvas').addClass('asteroidSelect');
    $('canvas')[0].height = 600;

    var asteroidCoords;
    var currentAsteroid = playerState.getAsteroid().getName();
    if (currentAsteroid == "Paydirteroid") {
        asteroidCoords = {
            "Paydirteroid": {
                x: 100,
                y: 300,
                src: "pics/asteroids/paydirteroidbig.png",
                width: 778,
                height: 486
            },
            "Cheddaroid": {
                x: 730,
                y: 130,
                src: "pics/asteroids/cheddaroid.png",
                width: 389,
                height: 243
            },
            "Fatlooteroid": {
                x: 580,
                y: 25,
                src: "pics/asteroids/fatlootoidsmall.png",
                width: 195,
                height: 122
            },
            "Affluoid": {
                x: 300,
                y: 0,
                src: "pics/asteroids/affluoidsmall.png",
                width: 195,
                height: 122
            },
            "Cashmonoid": {
                x: -35,
                y:  95,
                src: "pics/asteroids/cashmoniod.png",
                width: 389,
                height: 243
            }
        };
    } else if (currentAsteroid == "Cheddaroid") {
        asteroidCoords = {
            "Cheddaroid": {
                x: 100,
                y: 300,
                src: "pics/asteroids/cheddaroidbig.png",
                width: 778,
                height: 486
            },
            "Fatlooteroid": {
                x: 730,
                y: 130,
                src: "pics/asteroids/fatlootoid.png",
                width: 389,
                height: 243
            },
            "Affluoid": {
                x: 580,
                y: 25,
                src: "pics/asteroids/affluoidsmall.png",
                width: 195,
                height: 122
            },
            "Cashmonoid": {
                x: 300,
                y: 0,
                src: "pics/asteroids/cashmoniodsmall.png",
                width: 195,
                height: 122
            },
            "Paydirteroid": {
                x: -35,
                y:  95,
                src: "pics/asteroids/paydirteroid.png",
                width: 389,
                height: 243
            }
        };
    } else if (currentAsteroid == "Fatlooteroid") {
        asteroidCoords = {
            "Fatlooteroid": {
                x: 100,
                y: 300,
                src: "pics/asteroids/fatlootoidbig.png",
                width: 778,
                height: 486
            },
            "Affluoid": {
                x: 730,
                y: 130,
                src: "pics/asteroids/affluoid.png",
                width: 389,
                height: 243
            },
            "Cashmonoid": {
                x: 580,
                y: 25,
                src: "pics/asteroids/cashmoniodsmall.png",
                width: 195,
                height: 122
            },
            "Paydirteroid": {
                x: 300,
                y: 0,
                src: "pics/asteroids/paydirteroidsmall.png",
                width: 195,
                height: 122
            },
            "Cheddaroid": {
                x: -35,
                y:  95,
                src: "pics/asteroids/cheddaroid.png",
                width: 389,
                height: 243
            }
        };
    } else if (currentAsteroid == "Affluoid") {
        asteroidCoords = {
            "Affluoid": {
                x: 100,
                y: 300,
                src: "pics/asteroids/affluoidbig.png",
                width: 778,
                height: 486
            },
            "Cashmonoid": {
                x: 730,
                y: 130,
                src: "pics/asteroids/cashmoniod.png",
                width: 389,
                height: 243
            },
            "Paydirteroid": {
                x: 580,
                y: 25,
                src: "pics/asteroids/paydirteroidsmall.png",
                width: 195,
                height: 122
            },
            "Cheddaroid": {
                x: 300,
                y: 0,
                src: "pics/asteroids/cheddaroidsmall.png",
                width: 195,
                height: 122
            },
            "Fatlooteroid": {
                x: -35,
                y:  95,
                src: "pics/asteroids/fatlootoid.png",
                width: 389,
                height: 243
            }
        };
    } else if (currentAsteroid == "Cashmonoid") {
        asteroidCoords = {
            "Cashmonoid": {
                x: 100,
                y: 300,
                src: "pics/asteroids/cashmoniodbig.png",
                width: 778,
                height: 486
            },
            "Paydirteroid": {
                x: 730,
                y: 130,
                src: "pics/asteroids/paydirteroid.png",
                width: 389,
                height: 243
            },
            "Cheddaroid": {
                x: 580,
                y: 25,
                src: "pics/asteroids/cheddaroidsmall.png",
                width: 195,
                height: 122
            },
            "Fatlooteroid": {
                x: 300,
                y: 0,
                src: "pics/asteroids/fatlootoidsmall.png",
                width: 195,
                height: 122
            },
            "Affluoid": {
                x: -35,
                y:  95,
                src: "pics/asteroids/affluoid.png",
                width: 389,
                height: 243
            }
        };
    } else

    stage.removeAllChildren();
    stage.clear();

    stage = new createjs.Stage("mainCanvas");

    stage.backdrop = new createjs.Bitmap('pics/asteroids/asteroidscreenbg.png');
    stage.backdrop.x = 0;
    stage.backdrop.y = 0;
    stage.addChild(stage.backdrop);

    for (asteroid in asteroidCoords) {
        var asteroidShape = new createjs.Bitmap(asteroidCoords[asteroid].src);
        asteroidShape.x = asteroidCoords[asteroid].x;
        asteroidShape.y = asteroidCoords[asteroid].y;
        stage.addChild(asteroidShape);

        asteroidHitbox = new createjs.Shape();
        asteroidHitbox.graphics.beginFill('blue')
            .drawEllipse(0, 0, asteroidCoords[asteroid].width, asteroidCoords[asteroid].height);
        asteroidHitbox.x = asteroidCoords[asteroid].x;
        asteroidHitbox.y = asteroidCoords[asteroid].y;
        asteroidHitbox.alpha = 0.01;
        asteroidHitbox.on('click', function (e, data) {
            playerState.setAsteroid(asteroids[data.asteroid]);
        }, {}, false, {asteroid: asteroid});
        stage.addChild(asteroidHitbox);
    }
}
