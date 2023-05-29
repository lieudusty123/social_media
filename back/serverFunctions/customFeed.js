const { client } = require("../mongo");
const db = client.db("socialMedia");
const postsDB = db.collection("posts");

async function yourLatest(user, resArr) {
  return await postsDB
    .find({
      "userName.uuid": user.uuid,
      date: { $gte: new Date().getTime() / 1000 - 3600 },
    })
    .limit(20 - resArr.length)
    .toArray();
}
async function latestFollowingNotEngaged(user, resArr) {
  return await postsDB
    .find({
      "userName.uuid": { $in: user.following },
      _id: { $nin: user.postsEngagement },
      date: { $gt: user.lastLogin },
    })
    .limit(20 - resArr.length)
    .toArray();
}
async function followingEngaged(user, resArr) {
  return await postsDB
    .find({
      "userName.uuid": { $in: user.following },
      _id: { $in: user.postsEngagement },
      date: { $lte: user.lastLogin },
    })
    .limit(20 - resArr.length)
    .toArray();
}
async function followingNotEngaged(user, resArr) {
  return await postsDB
    .find({
      "userName.uuid": { $in: user.following },
      _id: { $nin: user.postsEngagement },
      date: { $lte: user.lastLogin },
    })
    .limit(20 - resArr.length)
    .toArray();
}
async function notFollowingLatest(user, resArr) {
  return await postsDB
    .find({
      "userName.uuid": { $nin: user.following },
      date: { $gt: user.lastLogin },
    })
    .limit(20 - resArr.length)
    .toArray();
}
async function notFollowing(user, resArr) {
  return await postsDB
    .find({
      "userName.uuid": { $nin: user.following },
      date: { $lt: user.lastLogin },
    })
    .limit(20 - resArr.length)
    .toArray();
}

module.exports = {
  yourLatest,
  latestFollowingNotEngaged,
  followingEngaged,
  followingNotEngaged,
  notFollowingLatest,
  notFollowing,
};
