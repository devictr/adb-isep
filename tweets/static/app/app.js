'use strict';

var projetBDD = angular.module('bdd', [
    'ngRoute',
    'ngCookies',
    'highcharts-ng',
    'projetBDD.services',
]).config(function ($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
});

projetBDD.config(function ($httpProvider, requestNotificationProvider) {
    $httpProvider.defaults.transformRequest.push(function (data) {
        requestNotificationProvider.fireRequestStarted(data);
        return data;
    });

    $httpProvider.defaults.transformResponse.push(function (data) {
        requestNotificationProvider.fireRequestEnded(data);
        return data;
    });
});

angular.module('projetBDD.services', []).provider(
    'requestNotification', function () {
        // This is where we keep subscribed listeners
        var onRequestStartedListeners = [];
        var onRequestEndedListeners = [];

        // This is a utility to easily increment the request count
        var count = 0;
        var requestCounter = {
            increment: function () {
                count++;
            },
            decrement: function () {
                if (count > 0) count--;
            },
            getCount: function () {
                return count;
            }
        };
        // Subscribe to be notified when request starts
        this.subscribeOnRequestStarted = function (listener) {
            onRequestStartedListeners.push(listener);
        };

        // Tell the provider, that the request has started.
        this.fireRequestStarted = function (request) {
            // Increment the request count
            requestCounter.increment();
            //run each subscribed listener
            angular.forEach(onRequestStartedListeners, function (listener) {
                // call the listener with request argument
                listener(request);
            });
            return request;
        };

        // this is a complete analogy to the Request START
        this.subscribeOnRequestEnded = function (listener) {
            onRequestEndedListeners.push(listener);
        };


        this.fireRequestEnded = function () {
            requestCounter.decrement();
            var passedArgs = arguments;
            angular.forEach(onRequestEndedListeners, function (listener) {
                listener.apply(this, passedArgs);
            });
            return arguments[0];
        };

        this.getRequestCount = requestCounter.getCount;

        //This will be returned as a service
        this.$get = function () {
            var that = this;
            // just pass all the
            return {
                subscribeOnRequestStarted: that.subscribeOnRequestStarted,
                subscribeOnRequestEnded: that.subscribeOnRequestEnded,
                fireRequestEnded: that.fireRequestEnded,
                fireRequestStarted: that.fireRequestStarted,
                getRequestCount: that.getRequestCount
            };
        };
    });

projetBDD.directive('loadingWidget', function (requestNotification, $location) {
    return {
        restrict: "AC",
        link: function (scope, element) {
            // hide the element initially
            element.hide();

            //subscribe to listen when a request starts
            requestNotification.subscribeOnRequestStarted(function () {
                // show the spinner!
                element.show();
            });

            requestNotification.subscribeOnRequestEnded(function () {
                // hide the spinner if there are no more pending requests
                if (requestNotification.getRequestCount() === 0) element.hide();
            });
        }
    };
});

projetBDD.run(function ($http, $cookies) {
    $http.defaults.headers.common['X-CSRFToken'] = $cookies['csrftoken'];
});

projetBDD.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/static/app/views/home.html',
            controller: 'HomeCtrl'
        });
    $routeProvider.otherwise({redirectTo: '/'});
}]);

