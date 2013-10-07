define(["jquery", "data"], function ($, data) {
    "use strict";
    var Tangle = window.Tangle,
        defaultWidth = 320,
        cvs,
        ctx,
        lazyCanvas,
        lazyContext,
        self = {
            width: defaultWidth,
            height: 500,
            color: '#d0e7f9'
        },
        settings = { size: "small" };

    lazyCanvas = function () {
        if (!cvs) {
            cvs = $('#c')[0];
            cvs.resize = function () {
                this.width = self.width;
                this.height = self.height;
            };
            cvs.resize();
        }

        return cvs;
    };

    lazyContext = function () {
        if (!ctx) {
            ctx = lazyCanvas().getContext('2d');
        }
        return ctx;
    };

    self.draw = function () {
        lazyCanvas().resize();
        lazyContext().fillStyle = this.color;
        lazyContext().beginPath();
        lazyContext().rect(0, 0, this.width, this.height);
        lazyContext().closePath();
        lazyContext().fill();
    };

    self.size = function (size) {
        var factor;
        if (/huge/i.test(size)) {
            factor = 3;
        } else if (/medium/i.test(size)) {
            factor = 2;
        } else {
            factor = 1;
        }

        this.width = defaultWidth * factor;
        data.collectDataAsync("Board", "Size", size);
        settings.size = size;
    };

    self.addSettingsTo = function (target) {
        target.board = settings;
        return target;
    };

    self.bt = (function () {
        var e = $('#board')[0], bt = null;

        if (e) {
            bt = new Tangle(e, {
                initialize: function () {
                    this.boardSize = "small";
                },
                update: function () {
                    self.size(this.boardSize);
                }
            });
        }
        return bt;
    })();

    self.applySettings = function ($settings) {
        var boardSettings = $settings.board;
        if (boardSettings && boardSettings.size) {
            self.bt.setValue("boardSize", boardSettings.size);
        }
    };

    self.canvas = lazyCanvas;
    self.context = lazyContext;

    return self;
});