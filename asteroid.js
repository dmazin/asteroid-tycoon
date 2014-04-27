var Asteroid = function (terrainParameters) {
    var grid = [];

    this.init = function () {
        initialize_grid();
    }

    this.getGrid = function () {
        return grid;
    }

    function initialize_grid() {
        for (var i = 0; i < game_width; i++) {
            var line = [];
            for (var j = 0; j < game_height; j++) {
                var resourceName = generate_terrain(j, game_height);
                if (j === 0) {
                    resourceName = "dirt";
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
        function normalize(array) {
            var total = _.reduce(array,
                    function(m, n) { return m + n;},
                    0);
            return _.map(array, function(x) { return x / total; });
        }

        var resources = [];
        var maxDepth = game_height;
        var probs = _.map(resource_weights, function(x, r) {
            resources.push(r);
            if (depth < x.minDepth) {
                return 0;
            } else {
                return (maxDepth - depth) * x.pTop + depth * x.pBottom;
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
