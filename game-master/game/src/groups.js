define(
    ["grouping/random", "grouping/close", "grouping/histogram"],
    function (random, close, histogram) {
        return {
            close: close,
            histogram: histogram,
            random: random
        };
    });