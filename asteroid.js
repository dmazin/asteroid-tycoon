var Asteroid = function (name, terrainParameters, artifactValueScale) {
    var grid = [];
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

    this.getGrid = function () {
        return grid;
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
