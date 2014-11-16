angular.module('app', ['ionic'])

    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('side-menu1', {
                url: '/menu',
                templateUrl: 'side-menu1.html'
            });

        $urlRouterProvider.otherwise('/menu');

    });
