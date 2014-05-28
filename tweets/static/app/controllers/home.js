projetBDD.controller("HomeCtrl", function ($scope, $http, $timeout) {

    function updateCount() {
        var cacheVersion = new Date().getTime();
        $http.get("/api/tweets?v=" + cacheVersion).success(function (data, status, headers, config) {
            $scope.tvShowsCount = data.tv_shows_count;
            $scope.tvShowsCount.pop(null);
            $scope.status = status;
        })
            .error(function (data, status, headers, config) {
                       $scope.data = data || "Request failed";
                       $scope.status = status;
                   });
        $timeout(updateCount, 5000, true);
    }

    updateCount();

    function updateLastTweets() {
        var cacheVersion = new Date().getTime();
        $http.get("/api/tweets/last/"+ $scope.formTVShow).success(function (data, status, headers, config) {
            $scope.tvShowsLast = data.tv_show_last_tweets;
            $scope.status = status;
        })
            .error(function (data, status, headers, config) {
                       $scope.data = data || "Request failed";
                       $scope.status = status;
                   });
        $timeout(updateLastTweets, 5000, true);
    }
    updateLastTweets();
});