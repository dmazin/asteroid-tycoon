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

    displayPrintout('#first-email');
});

var displayPrintout = function (msg) {
    var lines = $(msg).text().split('\n');

    $('.printout').fadeIn(100);
    $("#game").one('click', hidePrintout);
    var i = 0;
    var interval = setInterval(function() {
        $('.printout').prepend(lines[lines.length - i - 1] + '\n');
        $('.printout').css('clip', 'rect(0, 670px, ' + i * 20 + 'px, 0)');
        i++;
        if (i === lines.length) {
            clearInterval(interval);
        }
    }, 50);
}

var hidePrintout = function () {
    $('.printout').css('cursor', 'default');
    $("#messages").fadeIn(1000);
    $('.printout').animate({'top': 110,
                            'left' : 350,
                            'width' : 15,
                            'height' : 15,
                            'opacity': 0},
                           1000,
                           function () {
                               $('.printout').hide();
                           });
}

var showPrintout = function () {
    $('.printout').show();
    $(".printout").animate({'top' : 128,
                            'left' : '50%',
                            'width' : 670,
                            'height' : '390',
                            'opacity' : 100 },
                           1000);

    $("#messages").fadeOut(600);

    setTimeout(function () {$("#game").one('click', hidePrintout);}, 0);
}

$("#messages").click(showPrintout);

var updateRobotShop = function() {
    _.each(robots, function(val, key) {
        var data = _.extend(val, {'name': key});
        var rendered = buy_button_template(data);
        var level = playerState.getRobotLevel(key) + 1;

        if (Robot.unlocked(key)) {
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
