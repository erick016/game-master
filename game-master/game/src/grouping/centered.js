/*jshint bitwise: false*/
define({
    generateX: function (boardWidth, platform) {
        var side = ~~(Math.random() * 2) ? "left" : "right";
        var rand = Math.random();

        if (rand < 0.68) {
            //68-95-99.7 rule
            return ((boardWidth / 3 + (Math.random() * (boardWidth / 3))) - platform.width / 2);
        }

        if (rand < 0.95 && rand >= 0.68) {
            if (side === "left") {
                return ((boardWidth / 6 + (Math.random() * (boardWidth / 6))) - platform.width / 2);
            }

            return ((2 * boardWidth / 3 + (Math.random() * (boardWidth / 6))) - platform.width / 2);
        }

        if (rand >= 0.95) {
            if (side === "left") {
                return (((Math.random() * (boardWidth / 6))) - platform.width / 2);
            }

            return ((5 * boardWidth / 6 + (Math.random() * (boardWidth / 6))) - platform.width / 2);
        }
    }
});