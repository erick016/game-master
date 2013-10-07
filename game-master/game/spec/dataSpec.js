define(["data"], function (data) {
    "use strict";

    var beforeEach = window.beforeEach,
        describe = window.describe,
        expect = window.expect,
        it = window.it,
        expected = {
            partitionKey: "fa404b90-2b8a-41e4-a3c6-e232bb7c9bfa",
            createDate: "2013-09-02T22:31:41.918Z",
            category: "Platforms",
            label: "Bounce",
            value: "flubber"
        };

    describe("sending game settings", function () {
        it("should return the settings it sent", function () {
            var sent,
                entity = {
                    rowKey: 'c32a3d825df6bd7bfc6fd7c7daf2da837dd98281e972632cda7e41a8e4f12228',
                    settings: '{"board":{"width":320},"platforms":{"bounce":2,"count":7,"move":false,"grouping":"anywhere"},"player":{"agility":3}}'
                },
            sending = {
                "board": {
                    "width": 320
                },
                "platforms": {
                    "bounce": 2,
                    "count": 7,
                    "move": false,
                    "grouping": "anywhere"
                },
                "player": {
                    "agility": 3
                }
            };

            sent = data.saveSettingsAsync(sending);

            expect(sent).toEqual(entity);
        });
    });

    describe("the data model", function () {
        it("should generate uuids", function () {
            var uuid = data.uuid();
            expect(uuid).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
        });

        describe("the collected data", function () {
            beforeEach(function () {
                document.cookie = "sessionid= ;expires=Sat Aug 31 2013 20:56:22 GMT-0700 (Pacific Daylight Time)";
                delete data.sessionid;
                data.uuid = function () {
                    return "fa404b90-2b8a-41e4-a3c6-e232bb7c9bfa";
                };
                data.getDate = function () {
                    return new Date('2013-09-02T22:31:41.918Z').toJSON();
                };
            });

            it("should get the cached session id when available", function () {
                data.sessionid = "fa404b90-2b8a-41e4-a3c6-e232bb7c9bfa";
                var result = data.collectDataAsync(
                    "Platforms",
                    "Bounce",
                    "flubber");
                expect(result).toEqual(expected);
            });

            it("should get session id from cookie when available", function () {
                document.cookie = "sessionid=fa404b90-2b8a-41e4-a3c6-e232bb7c9bfa";
                var result = data.collectDataAsync(
                    "Platforms",
                    "Bounce",
                    "flubber");

                expect(result).toEqual(expected);
                expect(data.sessionid).toEqual("fa404b90-2b8a-41e4-a3c6-e232bb7c9bfa");
            });

            it("should get the session id from global.uuid when needed", function () {
                var result = data.collectDataAsync(
                    "Platforms",
                    "Bounce",
                    "flubber");
                expect(result)
                    .toEqual(expected);
                expect(data.parseCookie().sessionid)
                    .toEqual("fa404b90-2b8a-41e4-a3c6-e232bb7c9bfa");
            });
        });
    });
});