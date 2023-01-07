const { DataTypes } = require('sequelize');

function makeArticle(sequelize) {
  return sequelize.define('Article', {
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    //Format: YYYY-MM-DD
    pubDate: DataTypes.DATEONLY,
  })
}

module.exports = { makeArticle }