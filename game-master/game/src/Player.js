/*jshint bitwise: false*/
define(["board", "data"], function (board, data) {
    "use strict";
    var Tangle = window.Tangle,
        defaultSpeed = 5,
        factor,
        self = new Image(),
        speed,
        settings = { playerAgility: "normally" };

    self.frames = 1;
    self.height = 95;
    self.src = "img/angel.png";
    self.width = 65;

    speed = defaultSpeed;

    self.agility = function (agility) {
        if (/slowly/i.test(agility)) {
            factor = 1 / 3;
        }
        else if (/quickly/i.test(agility)) {
            factor = 3;
        } else {
            factor = 1;
        }

        speed = defaultSpeed * factor;
        data.collectDataAsync("Player", "Agility", agility);
        settings.playerAgility = agility;
    };

    self.checkEndGame = function () {
    };

    self.draw = function () {
        try {
            board.context().drawImage(
                self,
                0,
                self.height * self.actualFrame,
                self.width,
                self.height,
                self.X,
                self.Y,
                self.width,
                self.height);
        } catch (e) {
        }

        if (self.interval === 4) {
            if (self.actualFrame === self.frames) {
                self.actualFrame = 0;
            } else {
                self.actualFrame++;
            }
            self.interval = 0;
        }
        self.interval++;
    };

    self.fallStop = function () {
        self.isFalling = false;
        self.fallSpeed = 0;
    };

    self.jump = function (deltaY) {
        deltaY = Math.floor(deltaY);
        if (!self.isJumping && !self.isFalling) {
            self.isJumping = true;
            self.jumpSpeed = deltaY;
        }
    };

    self.moveLeft = function () {
        if (self.X > 0) {
            self.moveTo(self.X - speed, self.Y);
        }
    };

    self.moveRight = function () {
        if (self.X + self.width < board.width) {
            self.moveTo(self.X + speed, self.Y);
        }
    };

    self.moveTo = function (x, y) {
        self.X = x;
        self.Y = y;
    };

    self.pt = (function () {
        var e = $('#player')[0], t = null;
        if (e) {
            t = new Tangle(e, {
                initialize: function () {
                    this.playerAgility = "normally";
                },
                update: function () {
                    self.agility(this.playerAgility);
                }
            });
        }
        return t;
    })();

    self.addSettingsTo = function (target) {
        target.player = settings;
        return target;
    };

    self.applySettings = function ($settings) {
        var playerSettings = $settings.player;
        if (playerSettings && playerSettings.playerAgility) {
            self.pt.setValue("playerAgility", playerSettings.playerAgility);
        }
    };

    self.reset = function () {
        self.actualFrame = 0;
        self.interval = 0;
        self.moveTo(
            ~~((board.width - self.width) / 2),
            ~~((board.height - self.height) / 2));
        self.isJumping = false;
        self.isFalling = false;
        self.jump(17);
    };

    self.update = function () {
        var remainder = 0;
        if (this.isJumping) {
            if (this.Y > board.height * 0.4) {
                this.moveTo(this.X, this.Y - this.jumpSpeed);
            } else {
                remainder = this.jumpSpeed;
            }

            this.jumpSpeed--;
            if (this.jumpSpeed === 0) {
                this.isJumping = false;
                this.isFalling = true;
                this.fallSpeed = 1;
            }
        }

        if (this.isFalling) {
            if (this.Y < board.height - this.height) {
                this.moveTo(this.X, this.Y + this.fallSpeed);
                this.fallSpeed++;
            } else {
                this.checkEndGame();
                this.fallStop();
            }
        }

        return remainder;
    };

    self.reset();
    return self;
});