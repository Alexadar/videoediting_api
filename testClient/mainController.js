app.controller('videoapi_controller', function ($scope, $q, socket, apiLayer, ) {

    var processError = function (obj) {
        alert(JSON.stringify(obj));
    }

    $scope.currentAddJob = {}

    $scope.scopeInit = function () {
        $scope.userId = "alex";
        $scope.login();
    }

    $scope.login = function () {
        if (!$scope.userId) {
            return;
        }
        var data = {
            body: {
                userId: $scope.userId
            }
        }
        return apiLayer.apiPostCall('/api/login', data).then(function (resp) {
            $scope.userModel = resp.data.user;
            $scope.constants = resp.data.constants;
            $scope.jobs = resp.data.jobs;
        }).catch(processError);
    }

    $scope.logout = function () {
        $scope.userModel = null;
    }

    $scope.getJobList = function () {

    }

    $scope.updateJob = function () {

    }

    $scope.createVideoProcessingJob = function () {
        var sendData = {
            headers: $scope.userModel.accessHeaders,
            body: new FormData()
        }
        //console.log($scope.currentAddJob);
        if ($scope.currentAddJob.name
            && $scope.currentAddJob.trimStart
            && $scope.currentAddJob.trimEnd) {
            if (document.getElementById("trimFileUpload").value != "") {
                if ($scope.currentAddJob.trimStart < $scope.currentAddJob.trimEnd) {
                    sendData.body.append(
                        "type", $scope.constants.jobTypes.trimJob);
                    sendData.body.append("name", $scope.currentAddJob.name);
                    sendData.body.append("trimStart", $scope.currentAddJob.trimStart);
                    sendData.body.append("trimEnd", $scope.currentAddJob.trimEnd);
                    sendData.body.append('trimFileUpload', $('#trimFileUpload')[0].files[0]);
                    return apiLayer.apiFormDataCall('/api/createFileTrimJob', sendData).then(function (resp) {
                        $scope.userModel.jobs.push(resp.data);
                        $scope.currentAddJob = {};
                        alert("Job created");
                    }).catch(processError);
                }
            }
        }
        alert('Please, make sure all fields are correct');
    };

    $scope.toStateName = function (state) {
        switch (state) {
            case $scope.constants.jobStates.created:
                return "created";
            case $scope.constants.jobStates.pending:
                return "pending";
            case $scope.constants.jobStates.failed:
                return "failed";
            case $scope.constants.jobStates.completed:
                return "completed";
        }
    }

    //socket
    $scope.notifyJob = function () {

    }
});