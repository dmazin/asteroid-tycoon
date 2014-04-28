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

function printout(text, type) {
    playSound('dingdong');

    var lines    = text.split(/\n/),
        printout = $("<pre class='printout " + (type ? type : '') + "'>"),
        envelope  = $("<img src='pics/other/envelope.png' alt='envelope' />");

    var height = lines.length * 15;

    envelope.currOpacity = 1;

    envelope.css({'opacity' : 0});
    envelope.click(show);
    printout.insertAfter("div.title");

    insert();

    function hideFirst() {
        if (type == 'modalyesno') { return; }
        cycle(envelope, function () {
            if (hide()) {
                $("#messages").append(envelope);
            }
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
                if (type == 'modalyesno') {
                    $('#modalyesno').show().css({
                        'top': (i+1) * 20
                    })
                }
                clearInterval(interval);
            }
        }, 50);
    }

    function hide() {
        if (type == 'modalyesno') { return false; }
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
        return true;
    }

    function show() {
        playSound('dingdong');
        printout.show();
        printout.animate({'top' : 100,
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
