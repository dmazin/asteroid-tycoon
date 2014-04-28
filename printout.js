var envelopes = [];

function cycle(envelope, k) {
    if (envelopes.length >= 4) {
        var toRemove = envelopes.shift();
        toRemove.remove();
    }

    envelopes.forEach(function (e) {
        var opacity = e.css('opacity'),
            top     = e.css('top').replace(/px/, "");

        e.css({'opacity' : opacity - 0.2});
        e.currOpacity = opacity - 0.2;
        e.animate({'top' : top - 25}, 500);
    });

    envelopes.push(envelope);

    setTimeout(k, 150);
}

function printout(text) {
    var lines    = text.split(/\n/),
        printout = $("<pre class='printout'>"),
        envelope  = $("<img src='pics/other/envelope.png' alt='envelope' />");

    var height = 0;

    envelope.currOpacity = 1;

    envelope.css({'opacity' : 0});
    envelope.click(show);
    printout.insertAfter("div.title");

    insert();

    function hideFirst() {
        cycle(envelope, function () {
            $("#messages").append(envelope);
            hide();
        });
    }

    function insert() {
        var i = 0;

        printout.fadeIn(100);
        $("#game").one('click', hideFirst);

        var interval = setInterval(function () {
            printout.prepend(lines[lines.length -i - 1] + '\n');
            printout.css('clip', 'rect(0, 670px, ' + i * 20 + 'px, 0)');
            i++;
            if (i === lines.length) {
                clearInterval(interval);
            }
        }, 50);
    }

    function hide() {
        height = $('.printout').css('height');
        printout.css('cursor', 'default');
        envelope.animate({'opacity' : envelope.currOpacity}, 600);
        printout.animate({'top': 110,
                           'left' : 350,
                           'width' : 15,
                           'height' : 15,
                           'opacity': 0},
                          1000,
                          function () {
                              printout.hide();
                          });
    }

    function show() {
        printout.show();
        printout.animate({'top' : 128,
                          'left' : '50%',
                          'width' : 670,
                          'height' : height,
                          'opacity' : 1 },
                         1000);

        envelope.animate({'opacity' : 0}, 600);
        setTimeout(function () {$("#game").one('click', hide);}, 0);
    }

    return {
        printout : printout,
        envelope : envelope
    }
}
