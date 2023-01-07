const express = require('express');
const { Sequelize } = require('sequelize');

const { User } = require('../models/index');

const userRoutes = express();

//REST declarations

userRoutes.get('/user', getUsers);
userRoutes.get('/user/:id', getUser);
userRoutes.post('/user', createUser);
userRoutes.put('/user/:id', updateUser);
userRoutes.delete('/user/:id', deleteUser);

//REST functions

async function getUsers(req, res) {
  const allUsers = await User.findAll();
  res.json(allUsers);
}

async function getUser(req, res, next) {
  const id = req.params.id;
  const user = await User.findOne( { where: { id : id }});
  if (user == null) {
    next();
  }
  res.json(user);
}

async function createUser(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;
  const user = await User.create({
    username,
    password,
    role,
  });
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

module.exports = { userRoutes}