exports.createJob = async (job) => {
}

exports.updateJob = async (job) => {
}

exports.getUsersJobsList = async (userId) => {
    var jobs = await global.db.driver.dbClient.collection('jobs').find({userId: userId}).toArray();
    return jobs;
}

exports.getJobsList = async (state, count) => {
}

exports.getJob = async (id) => {
}