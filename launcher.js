// Is there a robot currently being placed?
var robotSelectionActive = false,
    menuIsShrunk         = false;

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
        playSound('blip');

        var $this = $(this);
        var robotType = $this.data('robot');

        robotSelectionActive = true;

        var money = playerState.getResource('money');

        if (money > robots[robotType].cost && Robot.unlocked(robotType)) {
            spawnBot(robotType, Math.floor(spawner.x/grid_size + 3));
        }
    });

    $('.robot-shop').on('click', '.upgradeEnabled', function() {
        playSound('blip');
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

    $('#asteroidButton').click(function () {
        if ($('canvas').hasClass('asteroidSelect')) {
            return;
        }

        if (_(activeBots).some(function (b) { return !b.dead })) {
            printout($('#nobotleftbehind').text(), 'modalyesno');
            $('#modalyesno #yes').click(function () {
                drawAsteroidSelectionScreen();
            });
        } else {
            playSound('blip');
            drawAsteroidSelectionScreen();
        }
    });

    $('.title-container').data('size', 'big');

    $('#modalyesno a').click(function () {
        $('.printout.modalyesno').remove();
        $('#modalyesno').hide();
    });

    $(window).scroll(updateTopMenuSize);
    setInterval(updateTopMenuSize, 1000);

    $('#muteButton').click(function () {
        if (muted) {
            muted = false;
            $('#muteButton').attr('src', 'pics/other/mute-off.png');
        } else {
            muted = true;
            $('#muteButton').attr('src', 'pics/other/mute-on.png');
        }
    });

    $('#musicMuteButton').click(function () {
        if (musicMuted) {
            musicMuted = false;
            document.getElementById('audio').play();
            $('#musicMuteButton').attr('src', 'pics/other/music-mute-off.png');
        } else {
            musicMuted = true;
            document.getElementById('audio').pause();
            $('#musicMuteButton').attr('src', 'pics/other/music-mute-on.png');
        }
    });

    $(window).focus(function () {
        if (!musicMuted) {
            document.getElementById('audio').play();
        }
    }).blur(function () {
        document.getElementById('audio').pause();
    });

    $('.money-stats .amount').css('right','9px'); // just in case
});

var updateTopMenuSize = function() {
    var options = { duration : 660, queue : false };

    if($(document).scrollTop() > 0) {
        menuIsShrunk = true;

        $('#asteroidButton, #messages').hide();

        if($('.title-container').data('size') == 'big') {
            $('.title-container').data('size','small');
            $('.title-container').stop().animate({
                height:'0px',
            }, options);
            $('#menu').stop().animate({
                height:'136px',
            }, options);
            $(".robot-shop .robot-container:not(.disabled) img")
                .animate({height : 0}, {
                    duration : 660,
                    queue : false,
                    complete : function () {
                        $(".robot-shop .robot-container:not(.disabled) img").hide();
                    }
                });
            $(".robot-shop").animate({height : 22}, options);
            $(".robot-container:not(.disabled) .robot-button")
                .animate({top : -44}, options);
            $(".robot-container.disabled *").addClass("shrunk");
            $(".robot-container.disabled")
                .animate({ paddingTop : 0, paddingBottom : 0, top : -42 }, options);
            setTimeout(function () {
                $('.title').hide();
                $('#menu').addClass('shrunk');
            }, 600);
            $('#game').click();
        }
    } else {
        menuIsShrunk = false;

        $('.title').show();
        $('#menu').removeClass('shrunk');
        $(".robot-shop .robot-container:not(.disabled) img").show();
        $(".robot-shop .robot-container:not(.disabled) img")
            .animate({height : 46}, options);
        $(".robot-shop").animate({height : 77}, options);

        if($('.title-container').data('size') == 'small') {
            $('.title-container').data('size','big');
            $('.title-container').show().stop().animate({
                height:'100px'
            }, options);
            $('#menu').stop().animate({
                height:'290px',
            }, options);
            $(".robot-shop .robot-container:not(.disabled) img").show();
            $(".robot-shop .robot-container:not(.disabled) img")
                .animate({height : 46}, options);
            $(".robot-shop").animate({height : 77}, options);
            $(".robot-container:not(.disabled) .robot-button")
                .animate({top : -88}, options);
            $(".robot-container *").removeClass("shrunk");
            $(".robot-container.disabled")
                .animate({ paddingTop : 15, paddingBottom : 15, top : -62 }, options);
            setTimeout(function () {
                $('#asteroidButton, #messages').show();
            }, 600);
            $('#game').click();
        }
    }
}

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
            $('.robot-container.' + key).css({
                paddingTop : 0,
                paddingBottom : 0
            });
        } else {
            $('.robot-container.' + key).addClass('disabled');
        }

        if (playerState.unlockedUpgrades[key] > playerState.getRobotLevel(key)) {
            $(".robot-container." + key + " .robot").css('background', '#60738B');
        } else {
            $(".robot-container." + key + " .robot").css('background', '');
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
        if (upgradeUnlocked(key, 1) && level == 1) {
            $('.robot-container.' + key + ' img.lvl2').addClass('upgradeEnabled')
                .attr('src', pathPrefix + '1.gif');
            $('.controls .robot-shop .robot-container.' + key + ' .upgradeCost.lvl2').text('$' + currentUpgradeCost(key));
        } else {
            $('.robot-container.' + key + ' img.lvl2').removeClass('upgradeEnabled');
            $('.controls .robot-shop .robot-container.' + key + ' .upgradeCost.lvl2').text('');
        }

        if (upgradeUnlocked(key, 2) && level == 2) {
            $('.robot-container.' + key + ' img.lvl3').addClass('upgradeEnabled')
                .attr('src', pathPrefix + '2.gif');
            $('.controls .robot-shop .robot-container.' + key + ' .upgradeCost.lvl3').text('$' + currentUpgradeCost(key));
        } else {
            $('.robot-container.' + key + ' img.lvl3').removeClass('upgradeEnabled');
            $('.controls .robot-shop .robot-container.' + key + ' .upgradeCost.lvl3').text('');
        }

        // cheat here because badger only has lvl1 but we're displaying lvl3
        if (key == 'badgerBot') {
            $('.robot-container.' + key + ' img.lvl3').addClass('current')
                .removeClass('unused')
                .attr('src', pathPrefix + '0.gif');
        }
    });
};

var muted = false;
var musicMuted = false;
var playSound = function(snd) {
    if (!muted) {
        document.getElementById('sfx_' + snd).play();
    }
}
