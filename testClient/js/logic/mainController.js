app.controller('videoapi_controller', function ($scope, $q, socket, apiLayer, $http) {

    var processError = function (obj) {
        console.log(obj);
        var message;
        if (obj.error && obj.error.code) {
            style = 'errorToast';
            if (!$scope.constants) {
                message = "Something went wrong. Please, try again later";
            }
            else {
                message = $scope.localisation.errorStrings[obj.error.code];
            }
        }
        toast(message, true);
    }

    var toast = function (message, isError) {
        $.toast({
            text: message,
            bgColor: isError ? 'red' : 'blue',
            position: 'mid-center'
        });
    }

    $scope.currentAddJob = {}

    $scope.scopeInit = function () {
        // //Autologin
        // $scope.userId = "YourUserName";
        // $scope.login();
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
        return apiLayer.apiPostCall('/api/ios/1/login', data).then(function (resp) {
            $scope.userModel = resp.data.user;
            $scope.constants = resp.data.constants;
            $scope.jobs = resp.data.jobs;
            //i hardcoded it here, can be improved
            var socketQuery = "accesstoken=" + encodeURIComponent($scope.userModel.accessHeaders[0]["accessToken"]);
            $scope.socket = socket.connect(undefined, socketQuery);
            $scope.socket.on("notifyJob", $scope.notifyJob);
        }).then(function () {
            return $http.get('/strings/en.json')
                .then(function (res) {
                    $scope.localisation = res.data;
                });
        }).catch(processError);
    }

    $scope.logout = function () {
        $scope.userModel = null;
    }

    $scope.reRunJob = function (job) {
        var sendData = {
            headers: $scope.userModel.accessHeaders,
            body: {
                state: $scope.constants.jobStates.created,
                _id: job._id
            }
        }
        return apiLayer.apiPostCall('/api/ios/1/updateJob', sendData).then(function (resp) {
            job.state = $scope.constants.jobStates.created;
            toast("Job updated");
        }).catch(processError);
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
                    return apiLayer.apiFormDataCall('/api/ios/1/createFileTrimJob', sendData).then(function (resp) {
                        $scope.userModel.jobs.push(resp.data);
                        $scope.currentAddJob = {};
                        toast("Job created");
                    }).catch(processError);
                }
            }
        }
        toast($scope.localisation.errorStrings[$scope.constants.errorCodes.badInput], true);
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
            case $scope.constants.jobStates.rerunable:
                return "rerunable";
        }
    }

    //socket
    $scope.notifyJob = function (req) {
        var messageType = req.data.jobMessageType;
        var message = null;
        switch (messageType) {
            case $scope.constants.jobMessageTypes.jobCompleted:
                message = `Job ${req.data.job.data.name} completed`;
                break;
            case $scope.constants.jobMessageTypes.jobFailedRerunable:
                message = `Job ${req.data.job.data.name} failed. You can restart it`;
                break;
            case $scope.constants.jobMessageTypes.jobFailed:
                message = `Job ${req.data.job.data.name} failed`;
                break;
        }
        for (var i = 0; i < $scope.userModel.jobs.length; i++) {
            var job = $scope.userModel.jobs[i];
            if (job._id === req.data.job._id) {
                $scope.userModel.jobs[i] = req.data.job;
                break;
            }
        }
        if (message) {
            toast(message);
        }
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }
});