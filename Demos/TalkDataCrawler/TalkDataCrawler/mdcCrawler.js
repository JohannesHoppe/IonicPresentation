var util = require('util'),
    extend = require('extend'),
    events = require('events'),
    cheerio = require('cheerio'),
    SimpleCrawler = require("simplecrawler"),
    dateformat = require("dateformat"),
    endsWith = require('string.prototype.endswith');

function Crawler(config) {

    this.config = config;
    this.talks = [];
    this.offlineElement = {
        title: "OFFLINE",
        description: "There was a connection problem. All shown talks are retrieved from an offline archive.",
        start: dateformat(new Date(), "isoUtcDateTime"),
        track: "",
        speaker: ""
    };

    this._crawler = new SimpleCrawler(this.config.host);
    extend(this._crawler, config);
    
    this._crawler.on("fetchcomplete", this._fetchcomplete.bind(this));
    this._crawler.on("complete", function () {

        this._sortTalks();
        this.emit('complete', this.talks, this.offlineElement);
    }.bind(this));

}

util.inherits(Crawler, events.EventEmitter);

// sorts by start time and on same time by title
Crawler.prototype._sortTalks = function() {
    
    this.talks.sort(function (a, b) {

        if (a.start < b.start) {
            return -1;
        }

        if (a.start > b.start) {
            return 1;
        }
        
        var textA = a.title.toUpperCase();
        var textB = b.title.toUpperCase();

        return textA.localeCompare(textB);
    });
}

Crawler.prototype._jQuerifyHtml = function (html) {
    var $ = cheerio.load(html);
    return $;
}

Crawler.prototype._isHtml = function(queueItem) {
    return queueItem.stateData.contentType.indexOf("text/html") !== -1;
}

Crawler.prototype._isProgrammPage = function (queueItem) {
    return !queueItem.url.endsWith('Programm');
}

Crawler.prototype._reformatGermanDate = function (germanDate) {

    // example
    // var germanDate = "14.07.2014 11:45 - 12:45 Uhr";

    // 14.07.2014 11:45
    var fromDate = germanDate.split(" - ")[0];
    
    // ["14.07.2014", "11:45"]
    var date_and_time = fromDate.split(" ");
    
    // ["14", "07", "2014"]
    var date_parts = date_and_time[0].split(".");
    
    // ["11", "45"]
    var time_parts = date_and_time[1].split(":");

    var year = parseFloat(date_parts[2]);
    var month = parseFloat(date_parts[1]) - 1;
    var day = parseFloat(date_parts[0]);
    var hour = parseFloat(time_parts[0]);
    var minute = parseFloat(time_parts[1]);
    var second = 0;

    var localDate = new Date(year, month, day, hour, minute, second);
    var isoDate = dateformat(localDate, "isoUtcDateTime");
    return isoDate;
}

Crawler.prototype._fetchcomplete = function(queueItem , responseBuffer , response) {

    console.log("Completed fetching resource:", queueItem.url);

    if (!this._isHtml(queueItem) ||
        !this._isProgrammPage(queueItem)) {
        return;
    }

    var html = responseBuffer.toString();
    var $ = this._jQuerifyHtml(html);

    var title = $(".content-view-full h2").text().trim();
    var description = $(".content-view-full p").text().trim();
    var germanDate = $(".content-view-full .ezagenda_date").text().trim();     
    var start = this._reformatGermanDate(germanDate);
    var speaker = $("h4").next().find("a").text().trim();

    if (!title) {
        return;
    }

    this.talks.push({
        title: title,
        description: description,
        start: start,
        speaker: speaker
    });
};

Crawler.prototype._fetcherror = function(queueItem, response) {
    console.log("Error fetching resource:", queueItem.url);
};

Crawler.prototype.start = function() {
    this._crawler.start();
};

module.exports = Crawler;