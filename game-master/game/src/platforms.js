/*jshint bitwise: false*/
define(
    ["data", "board", "points", "groups"],
    function (data, board, points, groups) {
        "use strict";
        var Tangle = window.Tangle,
            bounceFactors = [1 / 3, 1 / 2, 1, 2, 3, 4],
            createPlatform,
            defaultBounce = 17,
            factor = 2,
            groupWith,
            position = 0,
            settings = {
                bounce: "canvas",
                platformsCount: 7,
                move: false,
                grouping: "mostly-centered"
            };

        var self = [];
        self.count = settings.platformsCount;
        self.canMove = false;

        createPlatform = function (x, y, type) {
            var platform = { width: 70, height: 20 };
            platform.isMoving = ~~(Math.random() * 2);
            platform.direction = ~~(Math.random() * 2) ? -1 : 1;
            platform.x = ~~x;
            platform.y = y;
            platform.type = type;
            platform.firstColor = type === 1 ? '#AADD00' : '#FF8C00';
            platform.secondColor = type === 1 ? '#698B22' : '#EEEE00';

            platform.onCollide = function (hero) {
                hero.fallStop();
                var index = factor;
                if (type === 1) {
                    index++;
                }
                hero.jump(defaultBounce * bounceFactors[index]);
            };
            return platform;
        };

        self.bounce = function (bounce) {
            if (/metal/i.test(bounce)) {
                factor = 0;
            } else if (/wood/i.test(bounce)) {
                factor = 1;
            } else if (/rubber/i.test(bounce)) {
                factor = 3;
            }
            else if (/flubber/i.test(bounce)) {
                factor = 4;
            } else {
                factor = 2;
            }

            data.collectDataAsync("Platforms", "Bounce", bounce);
            settings.bounce = bounce;
        };

        self.reset = function () {
            position = 0;
            for (var j = 0; j < self.count; j++) {
                self[j] = createPlatform(
                    0,
                    position,
                    ~~(Math.random() * 5) === 0 ? 1 : 0);
                self[j].x = Math.random() * (board.width - self[j].width);

                if (position < board.height - self[j].height) {
                    position += ~~(board.height / self.count);
                }
            }
        };

        self.draw = function () {
            var ctx = board.context();
            for (var i = 0; i < this.count; i++) {
                ctx.fillStyle = 'rgba(255, 255, 255, 1)';
                var gradient = ctx.createRadialGradient(
                    this[i].x + (this[i].width / 2),
                    this[i].y + (this[i].height / 2),
                    5,
                    this[i].x + (this[i].width / 2),
                    this[i].y + (this[i].height / 2),
                    45);
                gradient.addColorStop(0, this[i].firstColor);
                gradient.addColorStop(1, this[i].secondColor);
                ctx.fillStyle = gradient;
                ctx.fillRect(
                    this[i].x,
                    this[i].y,
                    this[i].width,
                    this[i].height);
            }
        };

        self.grouping = function (algorithm) {
            if (this.groupingAlgorithm !== algorithm) {
                data.collectDataAsync("Platforms", "Grouping", algorithm);
                settings.grouping = algorithm;
                this.groupingAlgorithm = algorithm;
                switch (this.groupingAlgorithm) {
                    case "anywhere":
                        groupWith = groups.random;
                        break;
                    case "slightly-shifted":
                        groupWith = groups.close;
                        break;
                    case "mostly-centered":
                        groupWith = groups.histogram.centered;
                        break;
                    case "mostly-on-left":
                        groupWith = groups.histogram.left;
                        break;
                    case "mostly-on-right":
                        groupWith = groups.histogram.right;
                        break;
                    case "mostly-on-left&right":
                        groupWith = groups.histogram.bimodal;
                        break;
                    default:
                        groupWith = groups.random;
                }
            }
        };

        self.move = function (canMove) {
            if (this.canMove !== canMove) {
                data.collectDataAsync("Platforms", "CanMove", canMove);
                settings.move = canMove;
            }
            this.canMove = canMove;
        };

        self.update = function (deltaY) {
            for (var i = 0; i < this.count; i++) {
                if (this[i].isMoving && this.canMove) {
                    if (this[i].x < 0) {
                        this[i].direction = 1;
                    } else if (this[i].x > board.width - this[i].width) {
                        this[i].direction = -1;
                    }
                    this[i].x += this[i].direction * (i / 2) * ~~(points.value / 100);
                }

                this[i].y += deltaY;

                if (this[i].y > board.height) {
                    this[i] = createPlatform(
                        groupWith.generateX(board.width, this[i]),

                        this[i].y - board.height,
                        ~~(Math.random() * 5) === 0 ? 1 : 0);
                }
            }
        };

        self.resize = function (size) {
            if (size !== this.length) {
                data.collectDataAsync("Platforms", "Count", size);
                settings.platformsCount = size;
                this.count = size;
                while (this.count < this.length) {
                    this.pop();
                }
                this.reset();
            }
        };

        self.tangle = (function () {
            var t = null, e = $('#platforms')[0];
            if (e) {
                t = new Tangle(e, {
                    initialize: function () {
                        this.platformsBounce = "canvas";
                        this.platformsCount = 7;
                        this.platformsMove = false;
                        this.platformsGrouping = "mostly-centered";
                    },
                    update: function () {
                        self.bounce(this.platformsBounce);
                        self.resize(this.platformsCount);
                        self.move(this.platformsMove);
                        self.grouping(this.platformsGrouping);
                    }
                });
            }
            return t;
        })();

        self.addSettingsTo = function (target) {
            target.platforms = settings;
            return target;
        };

        self.applySettings = function ($settings) {
            var platformSettings = $settings.platforms;
            if (platformSettings) {
                if (platformSettings.bounce) {
                    self.tangle.setValue("platformsBounce", platformSettings.bounce);
                }

                if (platformSettings.platformsCount) {
                    self.tangle.setValue("platformsCount", platformSettings.platformsCount);
                }

                if (platformSettings.move) {
                    self.tangle.setValue("platformsMove", platformSettings.move);
                }

                if (platformSettings.grouping) {
                    self.tangle.setValue("platformsGrouping", platformSettings.grouping);
                }
            }
        };

        self.reset();
        return self;
    });