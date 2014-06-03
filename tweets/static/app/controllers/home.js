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
        if ($scope.currentChart == "updateSevenDaysTweets") updateSevenDaysTweets();
        else fetchDataAndDisplayChart($scope.dayObject);
    };
    $scope.currentChart = "updateSevenDaysTweets";
    $scope.chooseTVShow("All");

    $http.get("/api/tweets/coordinates/"+$scope.currentTVShow).success(function (data, status, headers, config) {
        $scope.coords = data.coords;
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
        if ($scope.currentChart == "updateSevenDaysTweets") {
            if ($scope.currentTVShow == "All") {
                $http.get("/api/tweets/all-seven" + "?v=" + cacheVersion).success(function (data, status, headers, config) {
                    $scope.sevenDaysTweets = data.seven_days_tweets;
                    for (i = 0; i < $scope.sevenDaysTweets.length; i++) {
                        $scope.sevenDaysTweets[i].data = $scope.sevenDaysTweets[i].data.reverse()
                    }
                    $scope.chartConfig.series = $scope.sevenDaysTweets;
                    var total = [0, 0, 0, 0, 0, 0, 0];
                    for (i = 0; i < $scope.sevenDaysTweets.length; i++) {
                        for (j = 0; j < $scope.sevenDaysTweets[i].data.length; j++) {
                            total[j] += parseInt($scope.sevenDaysTweets[i].data[j]);
                        }
                    }
                    $scope.chartConfig.series.push({name: "Total", data: total});
                    $scope.chartConfig.xAxis.categories = $scope.getLastdaysLabels();
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
                    $scope.chartConfig.series = [
                        {name: $scope.currentTVShow, data: $scope.sevenDaysTweets}
                    ];
                    $scope.chartConfig.xAxis.categories = $scope.getLastdaysLabels();
                    $('.chart').highcharts($scope.chartConfig);
                    $scope.status = status;
                })
                    .error(function (data, status, headers, config) {
                        $scope.data = data || "Request failed";
                        $scope.status = status;
                    });
            }
        }
        $timeout(updateSevenDaysTweets, refreshTimeMillisec, true);
    }

    updateSevenDaysTweets();

    $scope.getLastdaysLabels = function () {
        var today = new Date();
        var labels = [today.toString().substring(0, 3)];
        for (var i = 1; i < 7; i++) {
            labels.push(new Date(today - 1000 * 60 * 60 * 24 * i).toString().substring(0, 3));
        }
        return labels.reverse();
    };

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
            categories: $scope.getLastdaysLabels()
        },
        title: {
            text: 'Tweets per Day'
        },
        loading: false
    };

    function fetchDataAndDisplayChart(day) {
        var cacheVersion = new Date().getTime();
        $http({
            url: '/api/tweets/by-hours' + '?v=' + cacheVersion,
            method: "POST",
            data: JSON.stringify({"day": day.getDate(),
                "month": parseInt(day.getUTCMonth()) + 1, "year": day.getUTCFullYear(), "tv_show": $scope.currentTVShow}),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            $scope.tweetsByHour = data.tweets_by_hour;
            console.log($scope.tweetsByHour);
            $scope.chartConfig.title = day.toString();
            $scope.chartConfig.xAxis.categories = ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7",
                "7-8", "8-9", "9-10", "10-11", "11-12", "12-13", "13-14", "14-15", "15-16", "16-17",
                "17-18", "18-19", "19-20", "20-21", "21-22", "22-23", "23-00"];
            $scope.chartConfig.series = [
                {name: $scope.currentTVShow, data: $scope.tweetsByHour}
            ];
            $('.chart').highcharts($scope.chartConfig);
            $scope.status = status;
        }).error(function (data, status, headers, config) {
            $scope.data = data || "Request failed";
            $scope.status = status;
        });
    }

    $scope.switchChart = function (day) {
        if ($scope.currentChart != "dayChart") {
            $scope.dayObject = new Date();
            for (i = 0; i < 7; i++) {
                if ($scope.dayObject.toString().substring(0, 3) != day) $scope.dayObject = new Date($scope.dayObject - 1000 * 60 * 60 * 24);
            }
            fetchDataAndDisplayChart($scope.dayObject);
            $scope.currentChart = "dayChart";
        } else {
            $scope.currentChart = "updateSevenDaysTweets";
            updateSevenDaysTweets();
        }
    };

    $('.chart').highcharts($scope.chartConfig);
});