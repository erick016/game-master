define(["game", "player", "platforms", "board"], function (game, player, platforms, board) {
    describe("game settings", function () {
        it("looks like this at startup", function () {
            expect(JSON.stringify(game.getSettings()))
                .toEqual('{"board":{"size":"small"},"platforms":{"bounce":"canvas","platformsCount":7,"move":false,"grouping":"mostly-centered"},"player":{"playerAgility":"normally"}}');
        });

        it("looks like this when completly populated", function () {
            board.size("huge");
            player.agility("quickly");
            platforms.grouping("anywhere");
            platforms.bounce("flubber");
            platforms.resize(20);
            platforms.move(true);
            expect(JSON.stringify(game.getSettings()))
                .toEqual('{"board":{"size":"huge"},"platforms":{"bounce":"flubber","platformsCount":20,"move":true,"grouping":"anywhere"},"player":{"playerAgility":"quickly"}}');
        });
    });
});