projetBDD.controller("HomeCtrl", function ($scope, $http, $timeout) {
    var refreshTimeMillisec = 60000;
    $http.get("/api/tweets/names").success(function (data, status, headers, config) {
        $scope.tvShowsNames = data.tv_shows_names;
        $scope.status = status;
    })
        .error(function (data, status, headers, config) {
            $scope.data = data || "Request failed";
            $scope.status = status;
        });
    $scope.chooseTVShow = function (tvShow) {
        $scope.currentTVShow = tvShow;
        updateLastTweets();
        updateSevenDaysTweets();
    };

    $scope.chooseTVShow("All");
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
        $timeout(updateLastTweets, refreshTimeMillisec, true);
    }


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
        //$timeout(updateCount, refreshTimeMillisec, true);
    }

    //updateCount();
    var animate = true;

    function updateSevenDaysTweets() {
        var cacheVersion = new Date().getTime();
        if ($scope.currentTVShow == "All") {
            $http.get("/api/tweets/all-seven" + "?v=" + cacheVersion).success(function (data, status, headers, config) {
                $scope.sevenDaysTweets = data.seven_days_tweets;
                for (i = 0; i < $scope.sevenDaysTweets.length; i++) {
                    $scope.sevenDaysTweets[i].data = $scope.sevenDaysTweets[i].data.reverse()
                }
                $scope.chartConfig.series = $scope.sevenDaysTweets;
                console.log($scope.chartConfig);
                var total = [0, 0, 0, 0, 0, 0, 0];
                for (i = 0; i < $scope.sevenDaysTweets.length; i++) {
                    for (j = 0; j < $scope.sevenDaysTweets[i].data.length; j++) {
                        total[j] += parseInt($scope.sevenDaysTweets[i].data[j]);
                    }
                }
                $scope.chartConfig.series.push({name: "Total", data: total});
                $('.chart').highcharts($scope.chartConfig);
                $scope.status = status;
            })
                .error(function (data, status, headers, config) {
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                });
        } else {
            $http.get("/api/tweets/seven/" + $scope.currentTVShow + "?v=" + cacheVersion).success(function (data, status, headers, config) {
                $scope.sevenDaysTweets = data.seven_days_tweets.reverse();
                $scope.chartConfig.series = [{name: $scope.currentTVShow, data: $scope.sevenDaysTweets}];
                $('.chart').highcharts($scope.chartConfig);
                $scope.status = status;
            })
                .error(function (data, status, headers, config) {
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                });
        }
        $timeout(updateSevenDaysTweets, refreshTimeMillisec, true);
    }

    updateSevenDaysTweets();

    function getLastDaysLabels() {
        var today = new Date();
        var labels = [today.toString().substring(0, 3)];
        for (var i = 1; i < 7; i++) {
            labels.push(new Date(today - 1000 * 60 * 60 * 24 * i).toString().substring(0, 3));
        }
        return labels.reverse();
    }

    $scope.chartConfig = {
        chart: {
            type: 'line',
            animation: false
        },
        plotOptions: {
            series: {
                animation: false
            }
        },
        series: [
            {
                data: []
            }
        ],
        xAxis: {
            categories: getLastDaysLabels()
        },
        title: {
            text: 'Tweets per Day'
        },
        loading: false
    };

    $('.chart').highcharts($scope.chartConfig);
});