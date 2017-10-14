exports.errorCodes = {
    general: 1,
    notAuthorized: 2
}

exports.apiAuthHeader = 'accesstoken';
exports.userTokenKey = '6cf5b8d1-ea4f-484f-8d33-505c61ff8b12';

exports.jobTypes = {
    trimJob: 1
}

exports.jobStates = {
    created: 1,
    pending: 2,
    completed: 3,
    failed: 4
}

exports.client = {
    errorCodes: exports.errorCodes,
    jobTypes: exports.jobTypes,
    jobStates: exports.jobStates
}