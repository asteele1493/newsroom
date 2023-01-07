const express = require('express');
const server = express();

const { userRoute } = require('./routes/user-route');
const { articleRoute } = require('./routes/article-route');
const { authRoutes } = require('./auth');

const PORT = process.env.PORT;

const  { sequelize } = require('./models')

const { checkToken } = require('./auth/routes');

server.get('/', (req, res) => {
  res.status(200).send('You are home!');
});

server.get('/loggedin', checkToken, (req, res) => {
  res.status(200).send('You are logged in, ' + req.username + '!');
})

server.use(express.json());

server.use(authRoutes);

server.use(userRoute);
server.use(articleRoute);

function start () {
  server.listen(PORT || 3002, async () => {
    await sequelize.sync();
    console.log(`Listening on ${PORT}`);
  });
}

module.exports = { server, start }