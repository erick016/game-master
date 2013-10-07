/*jshint bitwise: false*/

define(
    ["grouping/bimodal", "grouping/centered", "grouping/left", "grouping/right", ],
    function (bimodal, centered, left, right) {
        "use strict";

        return {
            bimodal: bimodal,
            centered: centered,
            left: left,
            right: right
        };
    });