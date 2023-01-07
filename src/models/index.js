require('dotenv').config();

const { Sequelize } = require('sequelize');
const { makeUser } = require('./user-model');
const { makeArticle } = require('./article-model');

const DATABASE_URL =
  process.env.NODE_ENV === 'test'
    ? 'sqlite::memory:'
    : process.env.DATABASE_URL;

const CONNECTION_OPTIONS =
  process.env.NODE_ENV === 'test'
    ? {}
    : {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      };

const sequelize = new Sequelize(DATABASE_URL, CONNECTION_OPTIONS);

const User = makeUser(sequelize);
const Article = makeArticle(sequelize);

User.hasMany(Article);
// Article.belongsTo(User);

module.exports = { User, sequelize, Article }