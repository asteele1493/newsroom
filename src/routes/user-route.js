const express = require('express');
const { Sequelize } = require('sequelize');

const { User, Article } = require('../models/index');

const userRoute = express();

//REST declarations

userRoute.get('/user', getUsers);
userRoute.get('/user/:id', getUser);
userRoute.post('/user', createUser);
userRoute.put('/user/:id', updateUser);
userRoute.delete('/user/:id', deleteUser);

//REST functions

async function getUsers(req, res) {
  const allUsers = await User.findAll();
  res.json(allUsers);
}

async function getUser(req, res, next) {
  const id = req.params.id;
  const user = await User.findOne({ 
  where: { id : id || null },
  include: Article,
});
  if (user == null) {
    next();
  } else {
  const rawUser = {
    id: user.id,
    username: user.username,
    password: user.password,
    role: user.role,
    article: user.Article.map((article) => article.title),
  };
  res.json(rawUser);
  }}

async function createUser(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;
  const user = await User.create({
    username,
    password,
    role,
  });
  const article = req.body.article ?? [];
  for (const title of article) {
    await user.createArticle({ title });
  }
  res.json(user);
}

async function deleteUser(req, res, next) {
  const id = req.params.id;
  const user = await User.findOne( { where: { id: id }});
  if (user == null) {
    next();
  } else {
    await User.destroy( {where: { id: id }});
    res.json({});
  }
}

async function updateUser (req, res) {
  const id = req.params.id;
  let user = await User.findOne({ where: { id: id }});
  if (user == null ) {
    next();
  } else {
    const username = req.body.username ?? user.username;
    const password = req.body.password ?? user.password;
    const role = req.body.role ?? user.role;

    let updatedUser = {
      username,
      password,
      role,
    }
    user = await user.update(updatedUser);
    res.status(200).json(user);
  }
}

module.exports = { userRoute }