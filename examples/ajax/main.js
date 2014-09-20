require.config({
    packages: [{ name: 'gremlins', location: '../../src' }]
});

require(['gremlins', '../../src/vendor/chance.js'], function(gremlins, Chance) {

    var requestEl = document.getElementById('request');
    var i = 0;

    var interval = setInterval(function() {
        requestEl.innerHTML += '<dt>Test ' + ++i +'</dt>';
        requestEl.innerHTML += '<dd>';
        var req = new XMLHttpRequest();
        //0 or 1
        var rand = Math.round(Math.random());
        var start = (new Date()).getTime();
        if (rand) {
            req.open('GET', '/', true);
            requestEl.innerHTML += 'Requesting / ... ';
        } else {
            req.open('GET', '/404', true);
            requestEl.innerHTML += 'Requesting /404 ... ';
        }
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                var end = (new Date()).getTime();
                if(req.status == 200) {
                    requestEl.innerHTML += 'Success! ';
                } else {
                    requestEl.innerHTML += 'Error! ';
                }
                requestEl.innerHTML += '(response time: ' + (end - start) + ' ms)';
                requestEl.innerHTML += '</dd>';
            }
        };
        req.send(null);
    }, 1100);

    var ajaxDelayer = gremlins.species.ajaxDelayer().logger(console).delayer(function () {
        var randomizer = new Chance();

        return randomizer.natural({max : 1000});
    });


    setTimeout(function() {
        requestEl.innerHTML += '<p>Enter ajaxDelayer Gremlin</p>';
        gremlins
            .createHorde()
            .gremlin(ajaxDelayer)
            .mogwai(function () {})
            .after(function () {
                setTimeout(function() {
                    requestEl.innerHTML += '<p>ajaxDelayer Gremlin is gone.</p>';
                }, 1000);
            })
            .unleash()
        ;

    }, 3500);

    setTimeout(function() {
        clearInterval(interval);
        requestEl.innerHTML += '<p>End of test.</p>';
    }, 20000);
});
