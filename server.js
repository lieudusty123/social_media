//express
const express = require("express");
const app = express();
const cors = require("cors");

//file setup
const fs = require("fs");
var bodyParser = require("body-parser");

// password hash
const bcrypt = require("bcryptjs");

//mongo setup
const { MongoClient } = require("mongodb");
var ObjectId = require("mongodb").ObjectId;
const uri = fs.readFileSync("./keys/admin.txt", "utf8");
const client = new MongoClient(uri);

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

async function connect() {
  try {
    await client.connect();
    console.log("connected");
  } catch (error) {
    console.log(error);
  }
}

app.listen(8000, () => {
  console.log("Server started on port 8000");
  connect();
});

app.post("/sign-up", async function (req, res) {
  const emailTaken = await coll
    .find({ "private_details.email": req.body.email })
    .toArray();

  if (emailTaken.length === 0) {
    bcrypt.genSalt(12).then((salt) => {
      bcrypt.hash(req.body.password, salt).then((hash) => {
        coll.insertOne({
          name: req.body.name,
          uuid: req.body.id,
          image: req.body.image,
          private_details: {
            email: req.body.email,
            password: hash,
          },
          followers: [],
          posts: [],
        });
        res.status(200).send("Your user was now created");
      });
    });
  } else {
    res.status(409).send("User already exists");
  }
});

app.post("/login", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  let returnVal = {};
  let mongoCall = await coll
    .find({ "private_details.email": email }, { "private_details.password": 1 })
    .toArray();
  if (mongoCall.length !== 1) {
    returnVal = "Nope, email not found";
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
    } else {
      returnVal = "Nope, password incorrect";
    }
  }
  res.status(200).send(returnVal);
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

app.post("/clear-all-data", function () {
  coll.deleteMany({});
  postsColl.deleteMany({});
  res.status(200).send("deleted!");
});

app.post("/clear-posts", async function (req, res) {
  postsColl.deleteMany({});
  res.status(200).send("Posts deleted!");
});

app.get("/all-posts", async function (req, res) {
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
  postsColl
    .find({})
    .sort({ date: -1 })
    .toArray()
    .then(async function (posts) {
      let storedUsers = [];
      let storedImages = [];
      for (let index = 0; index < posts.length; index++) {
        posts[index].date = unixToRelativeTime(posts[index].date);
        if (storedUsers.indexOf(posts[index].userName.name) !== -1) {
          posts[index].userName.image =
            storedImages[storedUsers.indexOf(posts[index].userName.name)];
        } else {
          await coll
            .find({ uuid: posts[index].userName.uuid }, { image: 1 })
            .toArray()
            .then((imageRes) => {
              storedUsers.push(posts[index].userName.name);
              storedImages.push(imageRes[0].image);
              posts[index].userName.image = imageRes[0].image;
            });
        }
      }
      res.status(200).send(posts);
    });
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

app.post("/like-post", function (req, res) {
  postsColl
    .find({ _id: ObjectId(req.body.postId) })
    .toArray()
    .then((res) => {
      if (
        res[0].engagement.likes.includes(req.body.userId) &&
        req.body.action === "REMOVE"
      ) {
        console.log("User already liked");
        postsColl.updateOne(
          { _id: ObjectId(req.body.postId) },
          { $pull: { "engagement.likes": req.body.userId } }
        );
      } else if (
        !res[0].engagement.likes.includes(req.body.userId) &&
        req.body.action === "ADD"
      ) {
        console.log("Liked!");
        postsColl.updateOne(
          { _id: ObjectId(req.body.postId) },
          { $push: { "engagement.likes": req.body.userId } }
        );
      }
    });
});
app.post("/add-comment", function (req, res) {
  postsColl
    .find({ _id: ObjectId(req.body.postId) })
    .toArray()
    .then((da) => {
      postsColl.updateOne(
        { _id: ObjectId(req.body.postId) },
        {
          $push: {
            "engagement.comments": {
              content: req.body.content,
              userId: req.body.userId,
              userName: req.body.userName,
            },
          },
        }
      );
    });
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

app.get("/check-user-id", function (req, res) {
  coll
    .find({ uuid: req.body.id })
    .toArray()
    .then((data) => {
      if (data.length !== 0) {
        res.status(404).send("user exists!");
      } else {
        res.status(200).send();
      }
    });
});
