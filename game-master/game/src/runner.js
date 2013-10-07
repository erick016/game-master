require.config({
    paths: {
        easeljs: "../lib/easeljs-0.6.0/easeljs-0.6.0.min",
        jquery: "../lib/jquery-1.10.1/jquery-1.10.1",
        bootstrap: "../lib/bootstrap/bootstrap",
        jshashes: "../lib/jshashes/hashes.min",
    },
    shim: {
        easeljs: { exports: 'createjs' },
        bootstrap: { deps: ["jquery"] },
    }
});

require(["game"], function (game) {
    game.start();
});