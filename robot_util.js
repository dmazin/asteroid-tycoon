var upgradeBot = function(type, level) {
    var cost = upgradeCosts[type][level];

    if (playerState.getResource('money') < cost) {
        return;
    }

    playerState.changeResource('money', -cost);
    playerState.setRobotLevel(type, level);
};

var spawnBot = function(type, startX) {
    var robotAttrs = robotLevels[type][state.getRobotLevel(type)];
    // Canvas act different if you can now spawn a bot
    $('canvas').addClass('botSpawner');

    // Have stage listen to mouseup once and make a new bot based on that
    stage.on('stagemouseup', function(e) {
        // Change canvas back
        $('canvas').removeClass('botSpawner');

        // Reset if the mouse is out of bounds.
        if(!stage.mouseInBounds) { return; }

        //Update the player
        updatePlayerMoney(type);

        // Make a new bot based on the position.
        var destX = parseInt(e.stageX / 40);
        var destY = parseInt(e.stageY / 40);
        var bot = new Robot(robotAttrs, startX, destX, destY);
        activeBots.push(bot);
        return bot;
    }, null, true);
};

var updatePlayerMoney = function(robotType) {
    playerState.changeResource('money', -robots[robotType].cost);
};
