const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_CONNECTION);
var ObjectId = require("mongodb").ObjectId;
async function connect() {
  try {
    await client.connect();
    console.log("- Connected to Database");
  } catch (error) {
    console.log(error);
  }
}
connect();

module.exports = { client, ObjectId };
