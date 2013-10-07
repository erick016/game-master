define(
    ["board", "data"],
    function (board, data) {
        "use strict";
        var initialThreshold, self = {
            value: 0,
            threshold: 100,
            addSettingsTo: function () { },
            applySettings: function () { }
        };

        initialThreshold = self.threshold;

        self.update = function (player, deltaY) {
            var highBar = (board.height * 0.5);
            var upHigh = player.Y < highBar;
            if (10 < deltaY && upHigh) {
                this.value++;
                if (0 < (this.value - this.threshold)) {
                    data.collectDataAsync(
                        "Points",
                        "Threshold",
                        this.threshold);
                    this.threshold += initialThreshold;
                }
            }
        };

        self.draw = function () {
            var ctx = board.context();
            ctx.fillStyle = "Black";
            ctx.fillText("POINTS:" + this.value, 10, board.height - 10);
        };

        self.reset = function () {
            this.value = 0;
        };

        return self;
    });