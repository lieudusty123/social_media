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
const { invokeIf, unixToRelativeTime } = require("./serverFunctions/generalFunctions");
const { isEmailAvailable, isUuidAvailable } = require("./serverFunctions/mongoSpecifics");
const { User } = require("./serverFunctions/classes");
// General Functions

async function signUp(req, res) {
  const checkEmailAvailability = await isEmailAvailable(req.body.email);
  if (!checkEmailAvailability) return res.status(409).send("Email is already registered");
  const checkUuidAvailability = await isUuidAvailable(req.body.id);
  if (!checkUuidAvailability) return res.status(409).send("This ID is already in use!");

  const hashPasswordAndFinishRegister = async (pass, saltAmount) => {
    return await bcrypt.genSalt(saltAmount).then((salt) => {
      bcrypt.hash(pass, salt).then((hash) => {
        let userSchem = new User(req.body.name, req.body.id, req.body.image, req.body.email, hash);
        console.log(userSchem);
        userDB
          .insertOne(userSchem)
          .then(() => {
            res.status(200).send(userSchem);
          })
          .catch((err) => res.status(404).send(err));
      });
    });
  };
  hashPasswordAndFinishRegister(req.body.password, 12);
}

async function login(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  let returnVal = {};
  let mongoCall = await userDB.find({ "private_details.email": email }, { "private_details.password": 1 }).toArray();
  if (mongoCall.length !== 1) {
    returnVal = "User not found";
    res.status(404).send(returnVal);
  } else {
    let compare = await bcrypt.compare(password, mongoCall[0].private_details.password);
    if (compare === true) {
      returnVal = {
        res: "connected",
        email: mongoCall[0].private_details.email,
        userId: mongoCall[0].uuid,
        userName: mongoCall[0].name,
        image: mongoCall[0].image,
      };
      res.status(200).send(returnVal);
    } else {
      returnVal = "Incorrect password";
      res.status(404).send(returnVal);
    }
  }
}
async function updateUserTime(req, res) {
  userDB
    .findOneAndUpdate({ uuid: req.body.user }, { $set: { lastLogin: Math.round(new Date().getTime() / 1000) } })
    .then(() => {
      res.status(200);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
}
async function newPost(req, res) {
  function currentTimeToUnix() {
    return Math.round(new Date().getTime() / 1000);
  }
  let date = currentTimeToUnix();
  let userName = await userDB.find({ uuid: req.body.userId }, { name: 1 }).toArray();
  let obj = {
    files: [req.body.image],
    userName: {
      uuid: req.body.userId,
      name: userName[0].name,
    },
    title: req.body.title,
    date: date,
    engagement: {
      likes: [],
      comments: [],
    },
  };
  await postsDB.insertOne(obj);
  let newPostID = await postsDB.find({ "userName.uuid": req.body.userId, date: date }, { _id: 1 }).toArray();
  await userDB.updateOne({ uuid: req.body.userId }, { $push: { posts: newPostID[0]._id } });
  res.status(200).send("posted!");
}
async function allPosts(req, res) {
  try {
    async function getUserPosts() {
      const user = await userDB.findOne({ uuid: req.body.currentUser });
      let resArr = [];
      let postHardLimit = 20 - resArr.length;
      resArr.push(...(await invokeIf(yourLatest,[user, postHardLimit],postHardLimit))); // prettier-ignore
      resArr.push(...(await invokeIf(latestFollowingNotEngaged,[user, postHardLimit],postHardLimit))); // prettier-ignore
      resArr.push(...(await invokeIf(followingNotEngaged,[user, postHardLimit],postHardLimit))); // prettier-ignore
      resArr.push(...(await invokeIf(followingEngaged,[user, postHardLimit],postHardLimit))); // prettier-ignore
      resArr.push(...(await invokeIf(notFollowingLatest,[user, postHardLimit], postHardLimit))); // prettier-ignore
      resArr.push(...(await invokeIf(notFollowing, [user, postHardLimit], postHardLimit))); // prettier-ignore

      let storedUsers = [];
      let storedImages = [];

      for (let i = 0; i < resArr.length; i++) {
        resArr[i].date = unixToRelativeTime(resArr[i].date);
        if (storedUsers.indexOf(resArr[i].userName.name) !== -1) {
          resArr[i].userName.image = storedImages[storedUsers.indexOf(resArr[i].userName.name)];
        } else {
          await userDB
            .find({ uuid: resArr[i].userName.uuid }, { image: 1 })
            .toArray()
            .then((imageRes) => {
              storedUsers.push(resArr[i].userName.name);
              storedImages.push(imageRes[0].image);
              resArr[i].userName.image = imageRes[0].image;
            });
        }
      }
      res.status(200).send(resArr);
    }

    getUserPosts();
  } catch (err) {
    res.status(404).send(err);
  }
}
async function getUserImage(req, res) {
  userDB
    .find({ uuid: req.body.id })
    .toArray()
    .then((arr) => {
      if (arr.length !== 0) {
        res.status(200).send(arr[0].image);
      } else {
        res.status(404).send("user not found");
      }
    });
}
async function follow(req, res) {
  userDB
    .find({ uuid: req.body.targetUuid })
    .toArray()
    .then((targetUser) => {
      if (targetUser[0].followers.indexOf(req.body.currentUuid) !== -1) {
        userDB.updateOne({ uuid: req.body.targetUuid }, { $pull: { followers: req.body.currentUuid } }).then(() => {
          userDB.updateOne({ uuid: req.body.currentUuid }, { $pull: { following: req.body.targetUuid } }).then(() => {
            res.status(200).send("Remove Follower");
          });
        });
      } else {
        userDB.updateOne({ uuid: req.body.targetUuid }, { $push: { followers: req.body.currentUuid } }).then(() => {
          userDB.updateOne({ uuid: req.body.currentUuid }, { $push: { following: req.body.targetUuid } }).then(() => {
            res.status(200).send("Add Follower");
          });
        });
      }
    });
}
async function likePost(req, res) {
  try {
    postsDB
      .find({ _id: new ObjectId(req.body.postId) })
      .toArray()
      .then((data) => {
        checkLikedAndCallUpdate(data);
      });
  } catch (err) {
    res.status(404).send(err);
    return;
  }

  function checkLikedAndCallUpdate(data) {
    if (data[0].engagement.likes.includes(req.body.userId) && req.body.action === "REMOVE") {
      updateDB(req.body.action);
    } else if (!data[0].engagement.likes.includes(req.body.userId) && req.body.action === "ADD") {
      updateDB(req.body.action);
    }
  }

  function updateDB(action) {
    if (action === "ADD") {
      postsDB
        .updateOne({ _id: new ObjectId(req.body.postId) }, { $push: { "engagement.likes": req.body.userId } })
        .then(() => {
          userDB.updateOne(
            { uuid: req.body.userId },
            { $addToSet: { postsEngagement: new ObjectId(req.body.postId) } }
          );
        })
        .catch((err) => res.status(404).send(err));
    } else if (action === "REMOVE") {
      postsDB
        .updateOne({ _id: new ObjectId(req.body.postId) }, { $pull: { "engagement.likes": req.body.userId } })
        .then(() => {
          userDB.updateOne({ uuid: req.body.userId }, { $pull: { postsEngagement: new ObjectId(req.body.postId) } });
        })
        .catch((err) => res.status(404).send(err));
    } else return;
  }
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
        userDB.updateOne({ uuid: req.body.userId }, { $addToSet: { postsEngagement: new ObjectId(req.body.postId) } });
      })
      .catch((err) => res.status(404).send(err));
  }
}
async function changeIcon(req, res) {
  try {
    userDB
      .find({ uuid: req.body.userId })
      .toArray()
      .then((user) => {
        if (user.length === 0) return;
        userDB.updateOne(
          { uuid: req.body.userId },
          {
            $set: {
              image: req.body.image,
            },
          }
        );
      });
    res.status(200).send("Image was changed!");
  } catch (err) {
    res.status(404).send(err);
  }
}
async function userProfile(req, res) {
  try {
    userDB
      .find({ uuid: req.body.id })
      .toArray()
      .then((user) => {
        if (user.length === 0) return res.status(404).send("user not found");
        postsDB
          .find({ "userName.uuid": req.body.id })
          .sort({ date: -1 })
          .toArray()
          .then((postArr) => {
            res.status(200).send({ userData: user, posts: postArr });
          });
      });
  } catch (err) {
    res.status(404).send(err);
  }
}
async function search(req, res) {
  try {
    userDB
      .find({ name: { $regex: req.body.searchedInput } })
      .sort({ followers: -1 })
      .limit(5)
      .toArray()
      .then((data) => res.status(200).send(data));
  } catch (err) {
    res.status(404).send(err);
  }
}

module.exports = {signUp, login, updateUserTime, newPost, allPosts, getUserImage,
                  follow, likePost, addComment, changeIcon, userProfile, search}; //prettier-ignore
