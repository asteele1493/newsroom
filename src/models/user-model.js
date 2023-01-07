const { DataTypes } = require('sequelize');

function makeUser(sequelize) {
  return sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
  })
}

module.exports = { makeUser }