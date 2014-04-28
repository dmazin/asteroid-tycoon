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

    $('.robot-shop').on('click', '.upgrade.enabled', function() {
        var robot = $(this).data('robot');
        var nextLevel = playerState.getRobotLevel(robot) + 1;
        upgradeBot(robot, nextLevel);
    });

    $('.level').click(function() {
        var asteroidName = $(this).attr('id');
        playerState.setAsteroid(asteroids[asteroidName]);
    });

    // prevents text select cursor
    $('canvas').mousedown(function(event){
        event.preventDefault();
    });

    updateRobotShop();
    setInterval(updateRobotShop, 1000);
});

var updateRobotShop = function() {
    _.each(robots, function(val, key) {
        var data = _.extend(val, {'name': key});
        var rendered = buy_button_template(data);

        var level = playerState.getRobotLevel(key) + 1;

        if (upgradeUnlocked(key, level)) {
            $('.controls .robot-shop .robot-container.' + key + ' .upgrade').addClass('enabled');
            $('.controls .robot-shop .robot-container.' + key + ' .upgradeCost').text('$' + currentUpgradeCost(key));
        } else {
            $('.controls .robot-shop .robot-container.' + key + ' .upgrade').removeClass('enabled');
            $('.controls .robot-shop .robot-container.' + key + ' .upgradeCost').text('locked');
        }

        if (Robot.unlocked(key)) {
            $('.robot-container.' + key).removeClass('disabled');
        } else {
            $('.robot-container.' + key).addClass('disabled');
        }

        var robotGif = robotLevels[key][playerState.getRobotLevel(key)].gif;
        $('.robot[data-robot=' + key + '] img').attr('src', robotGif);
    });
};
