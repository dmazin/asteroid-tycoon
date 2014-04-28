$(document).ready(function () {
    playerState.setAsteroid(asteroids['Bananasteroid']);

    init_stage();

    var buy_button_template = _.template($('#robot-buy-button-template').html());
    _.each(robots, function(val, key) {
        var data = _.extend(val, {'name': key});
        var rendered = buy_button_template(data);
        $('.controls .robot-shop').append(rendered);
    });

    $('.robot').click(function() {
        var $this = $(this);
        var robotType = $this.data('robot');

        var money = playerState.getResource('money');

        if (money > robots[robotType].cost) {
            spawnBot(robotType, Math.floor(spawner.x/grid_size));
        }
    });
});
