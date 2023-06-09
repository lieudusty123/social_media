// NodeJS Imports
const bcrypt = require("bcryptjs");
// NodeJS Imports

// Mongo Imports
const { ObjectId } = require("./mongo");
const { client } = require("./mongo");
const db = client.db("socialMedia");
const userDB = db.collection("users");
const postsDB = db.collection("posts");
// Mongo Imports

// Server Functions
const { latestFollowingNotEngaged, followingNotEngaged, followingEngaged,
      notFollowingLatest, notFollowing, yourLatest} = require("./serverFunctions/customFeed"); //prettier-ignore
// Server Functions

// General Functions
const { invokeIf, unixToRelativeTime, currentTimeToUnix } = require("./serverFunctions/generalFunctions");
const { isEmailAvailable, isUuidAvailable } = require("./serverFunctions/mongoSpecifics");
const { UserClassSchema } = require("./serverFunctions/classes");
const { checkLikedAndCallUpdate } = require("./serverFunctions/likePost");
// General Functions

async function signUp(req, res) {
  const checkEmailAvailability = await isEmailAvailable(req.body.email);
  if (!checkEmailAvailability) return res.status(401).send("Email is already registered");
  const checkUuidAvailability = await isUuidAvailable(req.body.id);
  if (!checkUuidAvailability) return res.status(401).send("This ID is already in use!");

  const hashPasswordAndFinishRegister = async (pass, saltAmount) => {
    const genSalt = await bcrypt.genSalt(saltAmount);
    const hashedPass = await bcrypt.hash(pass, genSalt);
    const userSchem = new UserClassSchema(req.body.name, req.body.id, req.body.image, req.body.email, hashedPass);
    userDB
      .insertOne(userSchem)
      .then(() => {
        res.status(200).send(userSchem);
      })
      .catch((err) => res.status(500).send(err));
  };
  hashPasswordAndFinishRegister(req.body.password, 12);
}

async function login(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  let mongoCall = await userDB
    .findOne({ "private_details.email": email }, { "private_details.password": 1 })
    .catch((err) => res.status(500).send(err));

  if (mongoCall === null) return res.status(401).send("User not found");
  let hashMatch = await bcrypt.compare(password, mongoCall.private_details.password);
  if (!hashMatch) return res.status(401).send("Incorrect password");

  let returnVal = {
    res: "connected",
    email: mongoCall.private_details.email,
    userId: mongoCall.uuid,
    userName: mongoCall.name,
    image: mongoCall.image,
  };
  res.status(200).send(returnVal);
}
async function updateUserTime(req, res) {
  userDB
    .findOneAndUpdate({ uuid: req.body.user }, { $set: { lastLogin: Math.round(new Date().getTime() / 1000) } })
    .then(() => {
      res.status(200);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

async function newPost(req, res) {
  let userName = await userDB.findOne({ uuid: req.body.userId }, { name: 1 }).catch((err) => res.status(500).send(err));

  let newPostData = {
    files: [req.body.image],
    userName: {
      uuid: req.body.userId,
      name: userName.name,
    },
    title: req.body.title,
    date: currentTimeToUnix(),
    engagement: {
      likes: [],
      comments: [],
    },
  };
  let addPostToDB = await postsDB.insertOne(newPostData);
  userDB
    .updateOne({ uuid: req.body.userId }, { $push: { posts: addPostToDB.insertedId } })
    .then(() => res.status(200).send("posted!"))
    .catch((err) => res.status(500).send(err));
}
async function allPosts(req, res) {
  const normalFeed = async () => {
    const resArr = await postsDB
      .find()
      .sort({ date: -1 })
      .limit(20)
      .toArray()
      .catch((err) => res.status(500).send(err));
    getImages(resArr);
  };
  const customFeed = async () => {
    try {
      const user = await userDB.findOne({ uuid: req.body.currentUser });
      let resArr = [];
      let postHardLimit = 20 - resArr.length;
      resArr.push(...(await invokeIf(yourLatest, [user, postHardLimit], postHardLimit)));
      resArr.push(...(await invokeIf(latestFollowingNotEngaged, [user, postHardLimit], postHardLimit)));
      resArr.push(...(await invokeIf(followingNotEngaged, [user, postHardLimit], postHardLimit)));
      resArr.push(...(await invokeIf(followingEngaged, [user, postHardLimit], postHardLimit)));
      resArr.push(...(await invokeIf(notFollowingLatest, [user, postHardLimit], postHardLimit)));
      resArr.push(...(await invokeIf(notFollowing, [user, postHardLimit], postHardLimit)));
      getImages(resArr);
    } catch (err) {
      res.status(404).send(err);
    }
  };
  const getImages = async (resArr) => {
    let storedUsers = [];
    let storedImages = [];

    for (let i = 0; i < resArr.length; i++) {
      resArr[i].date = unixToRelativeTime(resArr[i].date);
      if (storedUsers.indexOf(resArr[i].userName.name) !== -1) {
        resArr[i].userName.image = storedImages[storedUsers.indexOf(resArr[i].userName.name)];
      } else {
        await userDB.findOne({ uuid: resArr[i].userName.uuid }, { image: 1 }).then((imageRes) => {
          storedUsers.push(resArr[i].userName.name);
          storedImages.push(imageRes.image);
          resArr[i].userName.image = imageRes.image;
        });
      }
    }
    res.status(200).send(resArr);
  };
  if (req.body.currentUser) {
    customFeed();
  } else {
    normalFeed();
  }
}
async function getUserImage(req, res) {
  userDB.findOne({ uuid: req.body.id }).then((data) => {
    if (data !== null) {
      res.status(200).send(data.image);
    } else {
      res.status(404).send("User not found");
    }
  });
}
async function follow(req, res) {
  userDB.findOne({ uuid: req.body.targetUuid }).then((targetUser) => {
    if (targetUser.followers.indexOf(req.body.currentUuid) !== -1) {
      userDB
        .updateOne({ uuid: req.body.targetUuid }, { $pull: { followers: req.body.currentUuid } })
        .catch((err) => res.status(500).send(err));
      userDB
        .updateOne({ uuid: req.body.currentUuid }, { $pull: { following: req.body.targetUuid } })
        .catch((err) => res.status(500).send(err));
      res.status(200).send("Unfollowed");
    } else {
      userDB
        .updateOne({ uuid: req.body.targetUuid }, { $push: { followers: req.body.currentUuid } })
        .catch((err) => res.status(500).send(err));
      userDB
        .updateOne({ uuid: req.body.currentUuid }, { $push: { following: req.body.targetUuid } })
        .catch((err) => res.status(500).send(err));
      res.status(200).send("Followed");
    }
  });
}
async function likePost(req, res) {
  postsDB
    .findOne({ _id: new ObjectId(req.body.postId) })
    .then((targetPost) => {
      checkLikedAndCallUpdate(targetPost, req.body.action, req.body.userId);
    })
    .catch((err) => res.status(500).send(err));
}
async function addComment(req, res) {
  try {
    postsDB
      .find({ _id: new ObjectId(req.body.postId) })
      .toArray()
      .then(() => {
        addCommentToDB();
      });
  } catch (err) {
    res.status(404).send(err);
  }

  function addCommentToDB() {
    postsDB
      .updateOne(
        { _id: new ObjectId(req.body.postId) },
        {
          $push: {
            "engagement.comments": {
              content: req.body.content,
              userId: req.body.userId,
              userName: req.body.userName,
            },
          },
        }
      )
      .then(() => {
        userDB
          .updateOne({ uuid: req.body.userId }, { $addToSet: { postsEngagement: new ObjectId(req.body.postId) } })
          .catch((err) => res.status(500).send(err));
      })
      .catch((err) => res.status(500).send(err));
  }
}
async function changeIcon(req, res) {
  userDB
    .updateOne(
      { uuid: req.body.userId },
      {
        $set: {
          image: req.body.image,
        },
      }
    )
    .then(() => res.status(200).send("Image was changed!"))
    .catch((err) => res.status(500).send(err));
}
async function userProfile(req, res) {
  const getUserDetails = await userDB
    .findOne({ uuid: req.body.id })
    .then((user) => {
      if (user === null) res.status(404).send("user not found");
      return user;
    })
    .catch((err) => res.status(500).send(err));

  await postsDB
    .find({ "userName.uuid": req.body.id })
    .sort({ date: -1 })
    .toArray()
    .then((postArr) => {
      res.status(200).send({ userData: getUserDetails, posts: postArr });
    })
    .catch((err) => res.status(500).send(err));
}
async function search(req, res) {
  userDB
    .find({ name: { $regex: req.body.searchedInput } })
    .sort({ followers: -1 })
    .limit(5)
    .toArray()
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send(err));
}

module.exports = {signUp, login, updateUserTime, newPost, allPosts, getUserImage,
                  follow, likePost, addComment, changeIcon, userProfile, search}; //prettier-ignore
