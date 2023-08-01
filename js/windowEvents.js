/*global cellServices, d3Services*/
(function () {
    'use strict';
    var rtime,
        timeout = false,
        delta = 200,

        addEvent = function (object, type, callback) {
            if (object === null || typeof (object) === 'undefined') {
                return;
            }
            if (object.addEventListener) {
                object.addEventListener(type, callback, false);
            } else if (object.attachEvent) {
                object.attachEvent('on' + type, callback);
            } else {
                object['on' + type] = callback;
            }
        },

        onEndResize = function () {
            var width,
                height;

            if (new Date() - rtime < delta) {
                setTimeout(onEndResize, delta);

            } else {
                timeout = false;
                width = document.getElementById('grid').offsetWidth;
                height = width;

                cellServices.resizeCells(width, height);
                d3Services.remove();
                d3Services.draw(width, height, cellServices.getCells());
            }
        };

    addEvent(window, 'resize', function (event) {
        rtime = new Date();
        if (timeout === false) {
            timeout = true;
            setTimeout(onEndResize, delta);
        }
    });

}());
