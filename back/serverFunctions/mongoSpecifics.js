const { client } = require("../mongo");
const db = client.db("socialMedia");
const userDB = db.collection("users");
const postsDB = db.collection("posts");

const isEmailAvailable = async (email) => {
  const dbCall = await userDB.find({ "private_details.email": email }).toArray();

  return dbCall.length === 0 ? true : false;
};
const isUuidAvailable = async (id) => {
  const dbCall = await userDB.find({ uuid: id }).toArray();
  return dbCall.length === 0 ? true : false;
};

module.exports = {
  isEmailAvailable,
  isUuidAvailable,
};
