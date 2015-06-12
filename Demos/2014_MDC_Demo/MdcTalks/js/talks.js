angular.module('app')

    /**
     * The Talks factory handles saving and loading talks
     * from local storage, and also lets us save and load the
     * last active talk index.
     */
    .factory('talksService', function($window, $http, $q) {

        var url = 'http://johanneshoppe.github.io/IonicPresentation/Demos/TalkDataCrawler/talks_callback.json';

        // tries to load talk data from internet, or uses localStorage as fallback
        var loadTalkData = function() {

            var deferred = $q.defer();

            $http.jsonp(url)
                .success(function(talks) {

                    window.localStorage.setItem('talks', angular.toJson(talks));
                    deferred.resolve(talks);
                })
                .error(function() {

                    var talksString = $window.localStorage.getItem('talks');
                    var talks = talksString ? angular.fromJson(talksString) : [];
                    deferred.resolve(talks);
                });

            return deferred.promise;

        };

        var getLastActiveIndex = function() {
            return parseInt($window.localStorage.getItem('lastActiveTalk'), 10) || 0;
        };

        var setLastActiveIndex = function(index) {
            $window.localStorage.setItem('lastActiveTalk', index + "");
        }

        return {
            loadTalkData: loadTalkData,
            getLastActiveIndex: getLastActiveIndex,
            setLastActiveIndex: setLastActiveIndex
        }
    })
    .filter('imagePath', function() {

        return function (talk) {

            if (!talk) {
                return undefined;
            }

            var r = talk.speaker.toLowerCase();

            r = r.replace(new RegExp("\\s", 'g'), "");
            r = r.replace(new RegExp("[абвгде]", 'g'), "a");
            r = r.replace(new RegExp("ж", 'g'), "ae");
            r = r.replace(new RegExp("з", 'g'), "c");
            r = r.replace(new RegExp("[ийкл]", 'g'), "e");
            r = r.replace(new RegExp("[мноп]", 'g'), "i");
            r = r.replace(new RegExp("с", 'g'), "n");
            r = r.replace(new RegExp("[туфхц]", 'g'), "o");
            r = r.replace(new RegExp("њ", 'g'), "oe");
            r = r.replace(new RegExp("[щъыь]", 'g'), "u");
            r = r.replace(new RegExp("[эя]", 'g'), "y");
            r = r.replace(",", "-");

            return "img/" + r + ".jpg";
        };
    });