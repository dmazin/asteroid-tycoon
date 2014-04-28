$(document).ready(function () {
    init_ui();

    playerState.setAsteroid(asteroids['Paydirteroid']);

    _.each(robots, function(val, key) {
        var data = _.extend(val, {'name': key});
        var rendered = buy_button_template(data);
        $('.controls .robot-shop').append(rendered);
    });

    $('.robot-shop').on('click', '.robot', function() {
        var $this = $(this);
        var robotType = $this.data('robot');

        var money = playerState.getResource('money');

        if (money > robots[robotType].cost && Robot.unlocked(robotType)) {
            spawnBot(robotType, Math.floor(spawner.x/grid_size));
        }
    });

    $('.level').click(function() {
        var asteroidName = $(this).attr('id');
        playerState.setAsteroid(asteroids[asteroidName]);
    });
});

var updateRobotShop = function() {
    _.each(robots, function(val, key) {
        var data = _.extend(val, {'name': key});
        var rendered = buy_button_template(data);
        $('.controls .robot-shop .robot-container.' + key).replaceWith(rendered);
    });
};

setInterval(updateRobotShop, 5000);

$('.robot-shop').on('click', '.upgrade.enabled', function() {
    var robot = $(this).data('robot');
    var nextLevel = playerState.getRobotLevel(robot) + 1;
    upgradeBot(robot, nextLevel);
});
