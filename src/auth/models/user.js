const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

const COMPLEXITY = 4;

function makeUser(sequelize) {
  const User = sequelize.define("User", {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING, 
  });

  console.log(User);

  User.createWithHashed = async (username, password, role) => {
    try {
      password = await bcrypt.hash(password, COMPLEXITY);
      console.log("Creating new user", username);
      return await User.create({ username, password, role });
    } catch (e) {
      console.error(e);
    }
  };

  User.findLoggedIn = async (username, password) => {
    try {
    const user = await User.findOne({ where: { username } });
    if (user == null) {
      return null;
    }
    if (await bcrypt.compare(password, user.password)) {
      return user;
    }} catch (e) {
      console.warn(`Error finding logged in`, e);
    }
    return null;
  };
  return User;
}

module.exports = { makeUser };
