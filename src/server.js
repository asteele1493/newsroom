const express = require('express');
const server = express();
const logger = require('./middleware/logger');
const { userRoute } = require('./routes/user-route');
const { articleRoute } = require('./routes/article-route');
const { authRoutes } = require('./auth');
const PORT = process.env.PORT;
const  { sequelize } = require('./models')
const serverError = require('./error-handlers/500');
const notFound = require('./error-handlers/404');
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
server.use(logger);
server.use('*', notFound);
server.use(serverError);


function start () {
  server.listen(PORT || 3002, async () => {
    await sequelize.sync();
    console.log(`Listening on ${PORT}`);
  });
}

module.exports = { server, start }