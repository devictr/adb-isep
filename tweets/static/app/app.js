'use strict';

var projetBDD = angular.module('projetBDD', [
        'ngRoute',
        'ngCookies',
        function ($interpolateProvider) {
            $interpolateProvider.startSymbol("{$");
            $interpolateProvider.endSymbol("$}");
        }
    ]).config(function ($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
});

projetBDD.run(function ($http, $cookies) {
    $http.defaults.headers.common['X-CSRFToken'] = $cookies['csrftoken'];
})

projetBDD.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
                  templateUrl: '/assets/app/views/home.html',
                  controller: 'HomeCtrl'
              });
    $routeProvider.otherwise({redirectTo: '/'});
}]);

