const { client } = require("../mongo");
const db = client.db("socialMedia");
const userDB = db.collection("users");
const postsDB = db.collection("posts");

function checkLikedAndCallUpdate(post, action, userId) {
  if (post.engagement.likes.includes(userId) && action === "REMOVE") {
    updateDB(action, post._id, userId);
  } else if (!post.engagement.likes.includes(userId) && action === "ADD") {
    updateDB(action, post._id, userId);
  }
}

function updateDB(action, postId, userId) {
  if (action === "ADD") {
    postsDB
      .updateOne({ _id: postId }, { $push: { "engagement.likes": userId } })
      .then(() => {
        userDB.updateOne({ uuid: userId }, { $addToSet: { postsEngagement: postId } });
      })
      .catch((err) => res.status(404).send(err));
  } else if (action === "REMOVE") {
    postsDB
      .updateOne({ _id: postId }, { $pull: { "engagement.likes": userId } })
      .then(() => {
        userDB.updateOne({ uuid: userId }, { $pull: { postsEngagement: postId } });
      })
      .catch((err) => res.status(404).send(err));
  } else return;
}
module.exports = { checkLikedAndCallUpdate };
