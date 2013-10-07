/*jshint bitwise: false*/
define({
    generateX: function (boardWidth, platform) {
        var seed = Math.random();
        var offset = platform.width * seed;
        var direction = ~~(Math.random() * 2) ? -1 : 1;
        var pos = platform.x + (direction * offset);
        return pos;
    }
});