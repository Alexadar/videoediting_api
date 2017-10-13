exports.getUser = async (userId) => {
    var users = await global.db.driver.dbClient.collection('users').find({userId: userId}).toArray();
    return users[0];
}

exports.createUser = async (user) => {
    await global.db.driver.dbClient.collection('users').insert(user);
}