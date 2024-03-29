const express = require("express");
const base64 = require("base-64");
const jwt = require('jsonwebtoken');

const { User } = require('../models');

const authRoutes = express();

const TOKEN_SECRET = process.env.TOKEN_SECRET ?? 'SET A TOKEN SECRET';

//Create signup and signin routes
// Make a POST request to the/signup route with username and password.

authRoutes.use(express.json());
authRoutes.post('/signup', signup);

authRoutes.post('/signin', signin);

async function signup(req, res, next) {
  const { username, password } = req.body;
  let auth = `${username}:${password}`;
  let encoded_auth = 'Basic ' + base64.encode(auth);
  console.log('Encoded auth', encoded_auth);
  const user = await User.createWithHashed(username, password, 'author');
  // On a successful account creation, return a 201 status with the user object in the body.
  res.status(201).json(user);
}

//TODO: make a route that makes us change a user's role. It should be admin only.

async function signin(req, res, next) {
  let authorization = req.header('Authorization');
  if (!authorization.startsWith('Basic ')) {
    next(new Error('Invalid authorization scheme'));
    return;
  }
  authorization = base64.decode(authorization.replace('Basic ', ''));

  console.log('Basic authorization request', authorization);

  const [username, password] = authorization.split(':');
  let user = await User.findLoggedIn(username, password);
  if (user) {
    // res.status(200).send({ username: user.username });
    const data = ({ username: user.username, role: user.role });
    const token = jwt.sign(data, TOKEN_SECRET);
    //Instead of sending back the username, send back the JWT.
    res.send(token);
  } else {
    next(new Error('Invalid login'));
  }
}


async function checkToken(req, _, next) {
  //look up the token
  const authorization = req.header('Authorization') ?? '';
   if (!authorization.startsWith('Bearer ')){
    next(new Error('Missing required bearer header'));
    return;
   }
   //remove opening portion of header and decrypt
   try{
   const token = authorization.replace('Bearer ', '');
   const decoded = jwt.verify(token, TOKEN_SECRET);
   req.username = decoded.username;
   req.role = decoded.role;
   next();
   } catch (e){
    next(new Error('Failed to decode', {cause: e}))
   }
}

function ensureRole(role) {
  return function checkRole(req, _, next) {
    if (role.includes(req.role)) {
      next();
    } else {
      next(new Error('Insufficient permissions'));
    }
  };
}



module.exports = { authRoutes, signin, signup, checkToken, ensureRole };
