define({
    generateX: function (boardWidth, platform) {
        return Math.random() * (boardWidth - platform.width);
    }
});