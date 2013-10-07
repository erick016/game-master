/*jshint bitwise: false*/
define({
    generateX: function (boardWidth, platform) {
        var rand = Math.random();
        if (rand < 0.68) {
            //68-95-99.7 rule
            return ((2 * boardWidth / 3 + (Math.random() * (boardWidth / 3))) - platform.width / 2);
        } else if (rand < 0.95 && rand >= 0.68) {
            return ((boardWidth / 3 + (Math.random() * (boardWidth / 3))) - platform.width / 2);
        } else if (rand >= 0.95) {
            return ((5 * boardWidth / 6 + (Math.random() * (boardWidth / 6))) - platform.width / 2);
        }
    }
});