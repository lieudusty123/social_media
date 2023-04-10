//express
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 5000;

//file setup
const fs = require("fs");
var bodyParser = require("body-parser");

//password hash
const bcrypt = require("bcryptjs");

//mongo setup
const { MongoClient } = require("mongodb");
var ObjectId = require("mongodb").ObjectId;
const client = new MongoClient(process.env.MONGO_CONNECTION);

//mongo specifics
const db = client.db("socialMedia");
const coll = db.collection("users");
const postsColl = db.collection("posts");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

async function connect() {
  try {
    await client.connect();
    console.log("- Connected to Database");
  } catch (error) {
    console.log(error);
  }
}

app.post("/sign-up", function (req, res) {
  coll
    .find({ "private_details.email": req.body.email })
    .toArray()
    .then((emailTaken) => {
      if (emailTaken.length === 0) {
        coll
          .find({ uuid: req.body.id })
          .toArray()
          .then((data) => {
            if (data.length === 0) {
              let returnObj = {};
              bcrypt.genSalt(12).then((salt) => {
                bcrypt.hash(req.body.password, salt).then((hash) => {
                  returnObj = {
                    name: req.body.name,
                    uuid: req.body.id,
                    image: req.body.image,
                    private_details: {
                      email: req.body.email,
                      password: hash,
                    },
                    lastLogin: Math.floor(new Date().getTime() / 1000),
                    followers: [],
                    following: [],
                    posts: [],
                    postsEngagement: [],
                  };
                  coll.insertOne(returnObj);
                  res.status(200).send(returnObj);
                });
              });
            } else {
              res.status(404).send("This ID is already in use!");
            }
          });
      } else {
        res.status(409).send("This email is already in use!");
      }
    });
});

app.post("/login", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  let returnVal = {};
  let mongoCall = await coll
    .find({ "private_details.email": email }, { "private_details.password": 1 })
    .toArray();
  if (mongoCall.length !== 1) {
    returnVal = "User not found";
    res.status(404).send(returnVal);
  } else {
    let compare = await bcrypt.compare(
      password,
      mongoCall[0].private_details.password
    );
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
});
app.post("/update-user-time", (req, res) => {
  coll
    .findOneAndUpdate(
      { uuid: req.body.user },
      { $set: { lastLogin: Math.round(new Date().getTime() / 1000) } }
    )
    .then(() => {
      res.status(200);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});
app.post("/new-post", async function (req, res) {
  function currentTimeToUnix() {
    return Math.round(new Date().getTime() / 1000);
  }
  let date = currentTimeToUnix();
  let userName = await coll
    .find({ uuid: req.body.userId }, { name: 1 })
    .toArray();
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
  await postsColl.insertOne(obj);
  let newPostID = await postsColl
    .find({ "userName.uuid": req.body.userId, date: date }, { _id: 1 })
    .toArray();
  await coll.updateOne(
    { uuid: req.body.userId },
    { $push: { posts: newPostID[0]._id } }
  );
  console.log("posted!");
  res.status(200).send("posted!");
});

app.post("/all-posts", async function (req, res) {
  function unixToRelativeTime(unixTimestamp) {
    const millisecondsPerSecond = 1000;
    const secondsPerMinute = 60;
    const minutesPerHour = 60 * secondsPerMinute;
    const hoursPerDay = 24 * minutesPerHour;
    const daysPerWeek = 7 * hoursPerDay;
    const weeksPerMonth = 4 * daysPerWeek;
    const monthsPerYear = 12 * weeksPerMonth;

    const currentTime = Math.round(
      new Date().getTime() / millisecondsPerSecond
    );
    const timeDifference = currentTime - unixTimestamp;

    if (timeDifference < secondsPerMinute) {
      return `${timeDifference} seconds ago`;
    } else if (timeDifference < minutesPerHour) {
      const minutes = Math.floor(timeDifference / secondsPerMinute);
      return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    } else if (timeDifference < hoursPerDay) {
      const hours = Math.floor(timeDifference / minutesPerHour);
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    } else if (timeDifference < daysPerWeek) {
      const days = Math.floor(timeDifference / hoursPerDay);
      return `${days} day${days === 1 ? "" : "s"} ago`;
    } else if (timeDifference < weeksPerMonth) {
      const weeks = Math.floor(timeDifference / daysPerWeek);
      return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
    } else if (timeDifference < monthsPerYear) {
      const months = Math.floor(timeDifference / weeksPerMonth);
      return `${months} month${months === 1 ? "" : "s"} ago`;
    } else {
      const years = Math.floor(timeDifference / monthsPerYear);
      return `${years} year${years === 1 ? "" : "s"} ago`;
    }
  }

  try {
    async function getUserPosts() {
      const user = await coll.findOne({ uuid: req.body.currentUser });
      let resArr = [];
      let index = 0;

      while (resArr.length < 20 && index < 5) {
        let res = await switchPostMethod(index);
        res.length > 0 && resArr.push(...res);
        index++;
      }
      async function switchPostMethod(i) {
        switch (i) {
          case 0:
            return await postsColl
              .find({
                "userName.uuid": { $in: user.following },
                _id: { $nin: user.postsEngagement },
                date: { $gt: user.lastLogin },
              })
              .limit(20 - resArr.length)
              .toArray();
          case 1:
            return await postsColl
              .find({
                "userName.uuid": { $in: user.following },
                _id: { $in: user.postsEngagement },
                date: { $lte: user.lastLogin },
              })
              .limit(20 - resArr.length)
              .toArray();
          case 2:
            return await postsColl
              .find({
                "userName.uuid": { $in: user.following },
                _id: { $nin: user.postsEngagement },
                date: { $lte: user.lastLogin },
              })
              .limit(20 - resArr.length)
              .toArray();
          case 3:
            return await postsColl
              .find({
                "userName.uuid": { $nin: user.following },
                date: { $gt: user.lastLogin },
              })
              .limit(20 - resArr.length)
              .toArray();
          case 4:
            return await postsColl
              .find({
                "userName.uuid": { $nin: user.following },
                date: { $lt: user.lastLogin },
              })
              .limit(20 - resArr.length)
              .toArray();
          default:
            break;
        }
      }
      let storedUsers = [];
      let storedImages = [];

      for (let i = 0; i < resArr.length; i++) {
        resArr[i].date = unixToRelativeTime(resArr[i].date);
        if (storedUsers.indexOf(resArr[i].userName.name) !== -1) {
          resArr[i].userName.image =
            storedImages[storedUsers.indexOf(resArr[i].userName.name)];
        } else {
          await coll
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
});

app.post("/get-user-image", function (req, res) {
  coll
    .find({ uuid: req.body.id })
    .toArray()
    .then((arr) => {
      if (arr.length !== 0) {
        res.status(200).send(arr[0].image);
      } else {
        res.status(404).send("user not found");
      }
    });
});

app.post("/follow", function (req, res) {
  coll
    .find({ uuid: req.body.targetUuid })
    .toArray()
    .then((targetUser) => {
      if (targetUser[0].followers.indexOf(req.body.currentUuid) !== -1) {
        coll
          .updateOne(
            { uuid: req.body.targetUuid },
            { $pull: { followers: req.body.currentUuid } }
          )
          .then(() => {
            coll
              .updateOne(
                { uuid: req.body.currentUuid },
                { $pull: { following: req.body.targetUuid } }
              )
              .then(() => {
                res.status(200).send("Remove Follower");
              });
          });
      } else {
        coll
          .updateOne(
            { uuid: req.body.targetUuid },
            { $push: { followers: req.body.currentUuid } }
          )
          .then(() => {
            coll
              .updateOne(
                { uuid: req.body.currentUuid },
                { $push: { following: req.body.targetUuid } }
              )
              .then(() => {
                res.status(200).send("Add Follower");
              });
          });
      }
    });
});

app.post("/like-post", function (req, res) {
  console.log(req.body);
  postsColl
    .find({ _id: new ObjectId(req.body.postId) })
    .toArray()
    .then((data) => {
      checkLikedAndUpdate(data);
    });

  function checkLikedAndUpdate(data) {
    if (
      data[0].engagement.likes.includes(req.body.userId) &&
      req.body.action === "REMOVE"
    ) {
      updateDB(req.body.action);
    } else if (
      !data[0].engagement.likes.includes(req.body.userId) &&
      req.body.action === "ADD"
    ) {
      updateDB(req.body.action);
    }
  }

  function updateDB(action) {
    if (action === "ADD") {
      postsColl
        .updateOne(
          { _id: new ObjectId(req.body.postId) },
          { $push: { "engagement.likes": req.body.userId } }
        )
        .then(() => {
          coll.updateOne(
            { uuid: req.body.userId },
            { $addToSet: { postsEngagement: new ObjectId(req.body.postId) } }
          );
        })
        .finally(() => {
          console.log("Added like!");
        })
        .catch((err) => res.status(404).send(err));
    } else if (action === "REMOVE") {
      postsColl
        .updateOne(
          { _id: new ObjectId(req.body.postId) },
          { $pull: { "engagement.likes": req.body.userId } }
        )
        .then(() => {
          coll.updateOne(
            { uuid: req.body.userId },
            { $pull: { postsEngagement: new ObjectId(req.body.postId) } }
          );
        })
        .finally(() => {
          console.log("Removed like!");
        })
        .catch((err) => res.status(404).send(err));
    } else return;
  }
});
app.post("/add-comment", function (req, res) {
  postsColl
    .find({ _id: new ObjectId(req.body.postId) })
    .toArray()
    .then(() => {
      addCommentToDB();
    });

  function addCommentToDB() {
    postsColl
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
        coll.updateOne(
          { uuid: req.body.userId },
          { $addToSet: { postsEngagement: new ObjectId(req.body.postId) } }
        );
      })
      .finally(() => {
        console.log("Added comment!");
      })
      .catch((err) => res.status(404).send(err));
  }
});

app.post("/change-icon", function (req, res) {
  coll
    .find({ uuid: req.body.userId })
    .toArray()
    .then((user) => {
      if (user.length === 1) {
        coll
          .updateOne(
            { uuid: req.body.userId },
            {
              $set: {
                image: req.body.image,
              },
            }
          )
          .then(() => {
            console.log("updated");
          });
      }
    });
  res.status(200).send("Image was changed!");
});

app.post("/user-profile", function (req, res) {
  let response = {
    userData: {},
    posts: [],
  };
  try {
    coll
      .find({ uuid: req.body.id })
      .toArray()
      .then((user) => {
        if (user.length !== 0) {
          response.userData = user;
          postsColl
            .find({ "userName.uuid": req.body.id })
            .toArray()
            .then((postArr) => {
              response.posts = postArr;
              res.status(200).send(response);
            });
        } else {
          res.status(404).send("user not found");
        }
      });
  } catch (e) {
    res.status(404).send();
  }
});

app.post("/search", (req, res) => {
  try {
    console.log(req.body.searchedInput);
    coll
      .find({ name: { $regex: req.body.searchedInput } })
      .sort({ followers: -1 })
      .limit(5)
      .toArray()
      .then((data) => res.status(200).send(data));
  } catch (err) {
    res.status(404).send(err);
  }
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"));
});

app.listen(port, () => {
  console.log("- Server up!");
  connect();
});
