const express = require("express");
const router = express.Router();
const {
  signUp,
  login,
  updateUserTime,
  newPost,
  allPosts,
  getUserImage,
  follow,
  likePost,
  addComment,
  changeIcon,
  userProfile,
  search,
} = require("./userController");

router.post("/sign-up", signUp);
router.post("/login", login);
router.post("/update-user-time", updateUserTime);
router.post("/new-post", newPost);
router.post("/all-posts", allPosts);
router.post("/get-user-image", getUserImage);
router.post("/follow", follow);
router.post("/like-post", likePost);
router.post("/add-comment", addComment);
router.post("/change-icon", changeIcon);
router.post("/user-profile", userProfile);
router.post("/search", search);

module.exports = router;
