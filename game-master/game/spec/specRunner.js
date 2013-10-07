require.config({
    baseUrl: "../src",
    paths: {
        easeljs: "../lib/easeljs-0.6.0/easeljs-0.6.0.min",
        jquery: "../lib/jquery-1.10.1/jquery-1.10.1",
        jasmine: "../lib/jasmine-1.3.1/jasmine",
        'jasmine-html': "../lib/jasmine-1.3.1/jasmine-html",
        spec: "../spec",
        jshashes: "../lib/jshashes/hashes.min",
    },
    shim: {
        easeljs: { exports: 'createjs' },
        jasmine: { exports: 'jasmine' },
        'jasmine-html': { deps: ['jasmine'], exports: 'jasmine' }
    }
});

require(["jquery", "jasmine-html"], function ($, jasmine) {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function (spec) {
        return htmlReporter.specFilter(spec);
    };

    var specs = ['spec/dataSpec', 'spec/gameSpec'];
    $(function () {
        require(specs, function () {
            jasmineEnv.execute();
        });
    });
});