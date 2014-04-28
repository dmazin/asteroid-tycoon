$(document).ready(function () {
    init_ui();

    playerState.setAsteroid(asteroids['Paydirteroid']);

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

    $('.level').click(function() {
        var asteroidName = $(this).attr('id');
        playerState.setAsteroid(asteroids[asteroidName]);
    });
});
