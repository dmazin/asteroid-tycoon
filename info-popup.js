var infoPopupActive = false;

$('#mainCanvas').click(function (e) {
    if (!infoPopupActive) {
        var x = e.offsetX,
        y = e.offsetY,
        popup = infoPopup(tileInfo(tileTypeAt(x, y)));

        $('#game').append(popup);
        infoPopupActive = true;
        return false;
    } else {
        hidePopups();
    }
});

$('body').click(hidePopups);

// Hides all the current info popups.
function hidePopups() {
    if (infoPopupActive) {
        $('.info-popup').remove();
        infoPopupActive = false;
    }
}

// Create an info popup element using the given tile info object. The
// tile description object should look like this:
function infoPopup(tile) {
    return $(_.template($("#info-popup-template").html())(tile));
}

// Return the tile type at the given physical coordinates on the
// canvas, in pixels.
function tileTypeAt(canvasX, canvasY) {
    var grid         = playerState.getAsteroid().getGrid(),
        canvasWidth  = $("#mainCanvas").width(),
        canvasHeight = $("#mainCanvas").height(),
        stepX        = canvasWidth / game_width, 
        stepY        = canvasHeight / game_height,
        tile = grid[Math.floor(canvasX / stepX)][Math.floor(canvasY / stepY)];

    return tile.explored ? tile.type : null;
}

// Returns a tile info object given the type of a tile.
function tileInfo(type) {
    var stats = type ? resources[type] : resources['unexplored'];

    return {
        name     : type,
        image    : stats.imagePath,
        hardness : stats.hardness,
        value    : stats.value
    };
}

