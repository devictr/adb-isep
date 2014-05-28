projetBDD.controller("HomeCtrl", function ($scope, $http) {

    $http.get("/api/tweets").success(function (data, status, headers, config) {
        $scope.data = data;
        $scope.status = status;
    })
        .error(function (data, status, headers, config) {
            $scope.data = data || "Request failed";
            $scope.status = status;
        });
});