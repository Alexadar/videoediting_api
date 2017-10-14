exports.addJob = async (job) => {
    return await await global.db.driver.dbClient.collection('jobs').insert(job);
}

exports.updateJob = async (job) => {
}

exports.getUsersJobsList = async (userId) => {
    return await global.db.driver.dbClient.collection('jobs').find({userId: userId}).toArray();
}

exports.getJobsList = async (state, count) => {
}

exports.getJob = async (id) => {
}