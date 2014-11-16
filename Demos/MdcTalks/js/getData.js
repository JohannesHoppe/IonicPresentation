angular.module('app')
    .factory('getData', function($http, $q) {

        var url = 'http://johanneshoppe.github.io/IonicPresentation/Demos/TalkDataCrawler/talks_callback.json?callback=JSON_CALLBACK';
        var urlFallback = 'js/talks_fallback.json';

        return function() {

            var deferred = $q.defer();

            $http.jsonp(url, { callback: 'JSON_CALLBACK' }).
                success(function(data) {
                    deferred.resolve(data);
                }).
                error(function() {

                    $http.get(urlFallback)
                        .success(function(data_fallback) {
                            deferred.resolve(data_fallback);
                        });
                });

            return deferred;

        };
    });
