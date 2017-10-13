app.controller('videoapi_controller', function($scope, $q, socket, apiLayer, ) {

    var processError = function(obj) {
        alert(JSON.stringify(obj));
    }

    $scope.login = function() {
        if(!$scope.userId) {
            return;
        }
        var data = {
            body: {
                userId: $scope.userId
            }
        }
        return apiLayer.apiPostCall('/api/login', data).then(function(resp){
            $scope.userModel = resp.data.user;
            $scope.constants = resp.data.constants;
            $scope.jobs = resp.data.jobs;
        }).catch(processError);
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