angular.module('app', ['ionic'])
    .config(function($stateProvider, $urlRouterProvider, $compileProvider) {

        $stateProvider
            .state('side-menu1', {
                url: '/menu',
                templateUrl: 'side-menu1.html',
                controller: function($scope, $ionicSideMenuDelegate, $timeout, talksService) {

                    $scope.talks = [
                        {
                            "title": "Lade Daten",
                            "description": "Bitte warten Sie einen Moment, bis die Datan geladen sind.",
                            "start": null,
                            "speaker": null
                        }
                    ];

                    talksService.loadTalkData().then(function(talks) {

                        $scope.talks = talks;
                        $scope.activeTalk = $scope.talks[talksService.getLastActiveIndex()];
                    });

                    $scope.selectTalk = function(talk, index) {
                        $scope.activeTalk = talk;
                        talksService.setLastActiveIndex(index);
                        $ionicSideMenuDelegate.toggleLeft(false);
                    };

                    $timeout(function() {
                        $ionicSideMenuDelegate.toggleLeft(true);
                    });
                }
            });

        $urlRouterProvider.otherwise('/menu');
    });
