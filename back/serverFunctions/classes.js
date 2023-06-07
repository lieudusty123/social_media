class UserClassSchema {
  constructor(name, uuid, image, email, password) {
    this.name = name;
    this.uuid = uuid;
    this.image = image;
    this.private_details = {
      email: email,
      password: password,
    };
    this.email = email;
    this.password = password;
    this.lastLogin = Math.floor(new Date().getTime() / 1000);
    this.followers = [];
    this.following = [];
    this.posts = [];
    this.postsEngagement = [];
  }
}
module.exports = {
  UserClassSchema,
};
