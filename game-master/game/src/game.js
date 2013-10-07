define(
    ["jquery", "easeljs", "data", "board", "clouds", "controls",
        "platforms", "player", "points"],
    function ($, createjs, data, board, clouds, controls, platforms, player, points) {
        "use strict";
        var args = Array.prototype.slice.call(arguments),
            checkCollisions,
            drawAllPieces,
            endGame,
            gameLoop,
            toggleGameLoop,
            self = { gamePieces: args.slice(2) },
            settingKey = $(location).attr('pathname').substring(1),
            share,
            updateEachPiece,
            updatePieces,
            updateView;

        self.applySettings = function ($settings) {
            var i, l = this.gamePieces.length, source = JSON.parse($settings);
            for (i = 0; i < l; i = i + 1) {
                this.gamePieces[i].applySettings(source);
            }
        };

        if (settingKey) {
            data.collectDataAsync("Game", "Settings", settingKey);
            data.loadSettingsAsync(settingKey, self);
        } else {
            data.collectDataAsync("Game", "Settings", "Default");
        }

        controls.control.togglePlay = function () {
            toggleGameLoop();
        };

        player.checkEndGame = function () {
            if (points.value !== 0) {
                endGame();
            }
        };

        checkCollisions = function ($player, $platforms) {
            for (var i = 0; i < $platforms.count; i++) {
                var platform = $platforms[i];
                if (!platform) {
                    continue;
                }

                if ($player.isFalling
                    && $player.X < platform.x + platform.width
                    && $player.X + $player.width > platform.x
                    && $player.Y + $player.height > platform.y
                    && $player.Y + $player.height < platform.y
                    + platform.height) {
                    platform.onCollide($player);
                }
            }
        };

        updateEachPiece = function ($clouds, $platforms, $player, $points) {
            var speed;

            checkCollisions($player, $platforms);
            speed = $player.update();
            $clouds.update(speed * 0.5);
            $platforms.update(speed);
            $points.update($player, $player.jumpSpeed);
        };

        updatePieces = updateEachPiece;

        drawAllPieces = function () {
            var i, l = arguments.length;
            for (i = 0; i < l; i++) {
                arguments[i].draw();
            }
        };
        updateView = drawAllPieces;

        gameLoop = function () {
            updatePieces(clouds, platforms, player, points);
            updateView(board, clouds, platforms, player, points);
        };

        self.start = (function (u) {
            var halt, resume, startGame;
            createjs.Ticker.setFPS(60);
            createjs.Ticker.useRAF = true;

            startGame = function () {
                data.collectDataAsync("Game", "Play", "Start");
                createjs.Ticker.addEventListener("tick", u);
            };

            resume = function () {
                startGame();
                toggleGameLoop = halt;
            };

            halt = function () {
                data.collectDataAsync("Game", "Play", "Stop");
                createjs.Ticker.removeEventListener("tick", u);
                toggleGameLoop = resume;
            };

            return resume;
        })(function () {
            gameLoop();
        });

        endGame = function () {
            var ctx = board.context(), tp = controls.control.togglePlay;
            controls.control.togglePlay = function () {
                resetAll(player, points, clouds, platforms);
                updatePieces = updateEachPiece;
                updateView = drawAllPieces;
                updateView(board, clouds, player, platforms, points);
                data.collectDataAsync("Game", "Reset", "Reset");
                controls.control.togglePlay = tp;
            };

            updatePieces = function () {
            };

            updateView = function () {
                board.draw();
                ctx.fillStyle = "Black";
                ctx.font = "10pt Arial";
                ctx.fillText("GAME OVER", (board.width / 2) - 60,
                    (board.height / 2) - 50);
                ctx.fillText("YOUR RESULT:" + points.value,
                    board.width / 2 - 60, board.height / 2 - 30);
            };

            toggleGameLoop();
            data.collectDataAsync("Game", "Score", points.value);
        };

        function resetAll() {
            var i, l = arguments.length;
            for (i = 0; i < l; i++) {
                arguments[i].reset();
            }
        }

        self.getSettings = function () {
            var l = this.gamePieces.length, settings = {};

            for (var i = 0; i < l; i++) {
                this.gamePieces[i].addSettingsTo(settings);
            }
            return settings;
        };

        share = function () {
            var entity, link, settings = self.getSettings();
            entity = data.saveSettingsAsync(settings);

            link = $("<a/>", {
                href: "/" + entity.rowKey,
                id: "shareLink",
                "class": "btn btn-success",
            });
            link.text(link.prop("href"));
            $("#shareLink").remove();
            $("#shareKey").removeClass("hidden")
                .append(link);

            data.getShortLink(link);
        };

        $(function () {
            $("#share").click(share);
        });

        return self;
    });