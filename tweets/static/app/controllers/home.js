projetBDD.controller("HomeCtrl", function ($scope, $http, $timeout) {
    $http.get("/api/tweets/names").success(function (data, status, headers, config) {
        $scope.tvShowsNames = data.tv_shows_names;
        $scope.status = status;
    })
        .error(function (data, status, headers, config) {
                   $scope.data = data || "Request failed";
                   $scope.status = status;
               });

    function updateLastTweets(tvShow) {
        var cacheVersion = new Date().getTime();
        $http.get("/api/tweets/last/" + $scope.currentTVShow + "?v=" + cacheVersion).success(function (data, status, headers, config) {
            $scope.tvShowsLast = data.tv_show_last_tweets;
            angular.forEach($scope.tvShowsLast, function (v, k) {
                v.created_at = new Date(v.created_at);
            });
            $scope.status = status;
        })
            .error(function (data, status, headers, config) {
                       $scope.data = data || "Request failed";
                       $scope.status = status;
                   });
        $timeout(updateLastTweets, 5000, true);
    }

    $scope.chooseTVShow = function(tvShow) {
        $scope.currentTVShow = tvShow;
        updateLastTweets();
    }

    $scope.chooseTVShow("All");

    function updateCount() {
        var cacheVersion = new Date().getTime();
        $http.get("/api/tweets?v=" + cacheVersion).success(function (data, status, headers, config) {
            $scope.tvShowsCount = data.tv_shows_count;
            $scope.status = status;
        })
            .error(function (data, status, headers, config) {
                       $scope.data = data || "Request failed";
                       $scope.status = status;
                   });
        $timeout(updateCount, 5000, true);
    }

    updateCount();


});