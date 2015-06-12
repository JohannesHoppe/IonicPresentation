/**
 * A simple crawler to get the events from the "MDC - Mobile Developer Conference kompakt 2014" page.
 */

var fs = require('fs'),
    DwxCrawler = require('./mdcCrawler'),
    dwxCrawler,

    crawlerConfig = {
        host: 'www.mobile-developer-conference.de',
        initialPath: '/Programm',
        discoverRegex: [
            /(\shref\s?=\s?)['"](\/Programm\/[^"']+)/ig
        ],
        userAgent: 'TalkDataCrawler (by Johannes Hoppe)'
    },
    fileNameJson = '../talks_fallback.json',
    fileNameJsonP = '../talks_callback.json';

var saveStringify = function(obj) {
    return JSON.stringify(obj)
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u??2029');
}

var writeFile = function (fileName, content) {
    fs.writeFile(fileName, content, 'utf8', console.log);
};

dwxCrawler = new DwxCrawler(crawlerConfig);
dwxCrawler.on('complete', function (talks, offlineElement) {

    console.log("Writing talks to disk!");

    writeFile(fileNameJson, saveStringify([offlineElement].concat(talks)));
    writeFile(fileNameJsonP, 'angular.callbacks._0(' + saveStringify(talks) + ');');
});

dwxCrawler.start();