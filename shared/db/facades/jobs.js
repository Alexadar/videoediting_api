var ObjectId = require('mongodb').ObjectID;

exports.addJob = async (job) => {
    return await await global.db.driver.dbClient.collection('jobs').insert(job);
}

exports.updateJob = async (job) => {
    job.updateDate = (new Date()).getTime();
    return await global.db.driver.dbClient.collection('jobs').replaceOne({_id: job._id}, job);
}

exports.getUsersJobsList = async (userId) => {
    return await global.db.driver.dbClient.collection('jobs').find({userId: userId}).toArray();
}

exports.getJobs = async (state, count) => {
    return await global.db.driver.dbClient.collection('jobs').find({$query: {state: state}, $orderby: { updateDate : -1 } }).limit(count).toArray();
}

exports.getJob = async (_id) => {
    var job = await global.db.driver.dbClient.collection('jobs').findOne({"_id": new ObjectId(_id)});
    return job;
}