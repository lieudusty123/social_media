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

app.post("/please", async function (req, res) {
  console.log(req.body);
  const result = await coll.insertOne(req.body);
});

// app.get("/all", async function (req, res) {
//   const findResult = await coll.find({}, { projection: { _id: 0 } });
//   let response = [];
//   await findResult.forEach((output) => response.push(output));

//   res.status(200).send({ response });
// });

app.post("/sign-up", async function (req, res) {
  const emailTaken = await coll
    .find({ "private_details.email": req.body.email })
    .toArray();

  if (emailTaken.length === 0) {
    bcrypt.genSalt(12).then((salt) => {
      bcrypt.hash(req.body.password, salt).then((hash) => {
        coll.insertOne({
          name: req.body.name,
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
    console.log(mongoCall);
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
        userId: mongoCall[0]._id,
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
  let date = new Date();
  let userName = await coll
    .find({ _id: ObjectId(req.body.userId) }, { name: 1 })
    .toArray();
  let obj = {
    files: [req.body.image],
    userName: {
      id: ObjectId(req.body.userId),
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
    .find({ "userName.id": ObjectId(req.body.userId), date: date }, { _id: 1 })
    .toArray();
  await coll.updateOne(
    { _id: ObjectId(req.body.userId) },
    { $push: { posts: newPostID[0]._id } }
  );
  console.log("posted!");
  res.status(200).send("posted!");
});

app.post("/clear-user-data", function () {
  coll.deleteMany({});
  postsColl.deleteMany({});
});

app.post("/clear-posts", async function (req, res) {
  postsColl.deleteMany({});
  res.status(200).send("Posts deleted!");
});

app.get("/all-posts", async function (req, res) {
  postsColl
    .find({})
    .toArray()
    .then(async function (posts) {
      let storedUsers = [];
      let storedImages = [];
      for (let index = 0; index < posts.length; index++) {
        if (storedUsers.indexOf(posts[index].userName.name) !== -1) {
          posts[index].userName.image =
            storedImages[storedUsers.indexOf(posts[index].userName.name)];
        } else {
          await coll
            .find({ _id: posts[index].userName.id }, { image: 1 })
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
    .then((res) => {
      console.log("Commented!");
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
    .find({ _id: ObjectId(req.body.userId) })
    .toArray()
    .then((user) => {
      if (user.length === 1) {
        // console.log();
        coll
          .updateOne(
            { _id: ObjectId(req.body.userId) },
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
