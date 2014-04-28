// Is there a robot currently being placed?
var robotSelectionActive = false;

$(document).ready(function () {
    init_ui();
    playerState.setAsteroid(asteroids['Paydirteroid']);
    setup_stage_event_handler();

    _.each(robots, function(val, key) {
        var data = _.extend(val, {
            'name': key
        });
        var rendered = buy_button_template(data);
        $('.controls .robot-shop').append(rendered);
    });

    $('.robot-shop').on('click', '.robot, img.current', function() {
        var $this = $(this);
        var robotType = $this.data('robot');

        robotSelectionActive = true;

        var money = playerState.getResource('money');

        if (money > robots[robotType].cost && Robot.unlocked(robotType)) {
            spawnBot(robotType, Math.floor(spawner.x/grid_size + 3));
        }
    });

    $('.robot-shop').on('click', '.upgradeEnabled', function() {
        var robot = $(this).data('robot');
        var nextLevel = playerState.getRobotLevel(robot) + 1;
        upgradeBot(robot, nextLevel);
    });

    // prevents text select cursor
    $('canvas').mousedown(function(event){
        event.preventDefault();
    });

    robotButton('squirrelBot').appendTo($(".robot-container.squirrelBot"));

    updateRobotShop();
    setInterval(updateRobotShop, 1000);

    printout($('#first-email').text());
});

var updateRobotShop = function() {
    _.each(robots, function(val, key) {
        var data = _.extend(val, {'name': key});
        var rendered = buy_button_template(data);
        var level = playerState.getRobotLevel(key) + 1;

        if (Robot.unlocked(key)) {
            if ($('.robot-container.' + key).hasClass('disabled')) {
                $(".robot-container." + key).append(robotButton(key));
            }
            $('.robot-container.' + key).removeClass('disabled');
        } else {
            $('.robot-container.' + key).addClass('disabled');
        }

        // image warblegarb starts here

        $('.robot-container.' + key + ' img').removeClass('current').removeClass('unused');

        if (level == 1) {
            $('.robot-container.' + key + ' img.lvl1').addClass('current');
        } else {
            $('.robot-container.' + key + ' img.lvl1').addClass('unused');
        }

        if (level == 2) {
            $('.robot-container.' + key + ' img.lvl2').addClass('current');
        } else {
            $('.robot-container.' + key + ' img.lvl2').addClass('unused');
        }

        if (level == 3) {
            $('.robot-container.' + key + ' img.lvl3').addClass('current');
        } else {
            $('.robot-container.' + key + ' img.lvl3').addClass('unused');
        }

        var pathPrefix = 'pics/2x_gifs/' + data['gifName'];
        if (upgradeUnlocked(key, 1) && level < 2) {
            $('.robot-container.' + key + ' img.lvl2').addClass('upgradeEnabled')
                .attr('src', pathPrefix + '1.gif');
            $('.controls .robot-shop .robot-container.' + key + ' .upgradeCost.lvl2').text('$' + currentUpgradeCost(key));
        } else {
            $('.robot-container.' + key + ' img.lvl2').removeClass('upgradeEnabled');
            $('.controls .robot-shop .robot-container.' + key + ' .upgradeCost.lvl2').text('');
        }

        if (upgradeUnlocked(key, 2) && level < 3) {
            $('.robot-container.' + key + ' img.lvl3').addClass('upgradeEnabled')
                .attr('src', pathPrefix + '2.gif');
            $('.controls .robot-shop .robot-container.' + key + ' .upgradeCost.lvl3').text('$' + currentUpgradeCost(key));
        } else {
            $('.robot-container.' + key + ' img.lvl3').removeClass('upgradeEnabled');
            $('.controls .robot-shop .robot-container.' + key + ' .upgradeCost.lvl3').text('');
        }
    });
};
