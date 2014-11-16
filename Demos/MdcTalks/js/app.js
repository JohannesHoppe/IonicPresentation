angular.module('app', ['ionic'])

    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('side-menu1', {
                url: '/menu',
                templateUrl: 'side-menu1.html',
                controller: function ($scope, getData) {

                    var result = getData();
                   
                }
            });

        $urlRouterProvider.otherwise('/menu');

    });
