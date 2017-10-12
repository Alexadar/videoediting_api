app.controller('videoapi_controller', function($scope, $q, socket, apiLayer, ) {
    $scope.login = function() {
        return apiLayer.apiPostCall('/api/login', null).then(function(resp){
            $scope.userModel = user;
            $scope.constants = constants;
            $scope.jobs = jobs;
        }).catch(alert);
    }

    $scope.logout = function() {
        $scope.userModel = null;
    }

    $scope.getJobList = function() {

    }

    $scope.updateJob = function() {

    }

    $scope.createVideoProcessingJob = function() {

    }

    //socket
    $scope.notifyJob = function() {

    }
});