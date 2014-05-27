'use strict';

var projetBDD = angular.module('bdd', [
        'ngRoute',
        'ngCookies'
    ]).config(function ($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
});

projetBDD.run(function ($http, $cookies) {
    $http.defaults.headers.common['X-CSRFToken'] = $cookies['csrftoken'];
})

projetBDD.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
                  templateUrl: '/static/app/views/home.html',
                  controller: 'HomeCtrl'
              });
    $routeProvider.otherwise({redirectTo: '/'});
}]);

