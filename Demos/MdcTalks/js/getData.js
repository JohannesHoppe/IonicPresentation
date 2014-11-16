angular.module('app')

    .factory(function () {

        var url = 'http://johanneshoppe.github.io/IonicPresentation/Demos/TalkDataCrawler/talks_callback.json';
        var urlFallback = 'js/talks_fallback.json';

        var getData = function() {

            var deferred = $q.defer();
            
            $http.jsonp(url).

                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });



        }

});









    var request = $.Deferred(function (deferred) {

        $.ajax({
            url: url,
            dataType: 'jsonp',
            jsonpCallback: 'callback',
            timeout: 5000
        })
        .done(function (data, textStatus, jqXHR) {

            deferred.resolveWith(this, [data, textStatus, jqXHR]);
        })
        .fail(function (jqXHR, textStatus) {

            jQuery.getJSON(urlFallback, function (data) {
                filterData(data);
                deferred.resolveWith(this, [data, textStatus, jqXHR]);
            });

        });
    }).promise();

    return request;
}