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
            spawnBot(robotType, Math.floor(spawner.x/grid_size + 3));
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

        var level = playerState.getRobotLevel(key) + 1;

        if (canUpgrade(key, level)) {
            $('.controls .robot-shop .robot-container.' + key + ' .upgrade').addClass('enabled');
        } else {
            $('.controls .robot-shop .robot-container.' + key + ' .upgrade').removeClass('enabled');
        }
    });
};

setInterval(updateRobotShop, 1000);

$('.robot-shop').on('click', '.upgrade.enabled', function() {
    var robot = $(this).data('robot');
    var nextLevel = playerState.getRobotLevel(robot) + 1;
    upgradeBot(robot, nextLevel);
});
