$(document).ready(function () {
    init_stage();

    $('.robot').click(function() {
        var $this = $(this);
        var robotType = $this.data('robot');

        var money = playerState.getResource('money');

        if (money > robots[robotType].cost) {
            spawnBot(robotType, Math.floor(spawner.x/grid_size));
        }
    });
});
