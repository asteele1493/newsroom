const express = require('express');
const server = express();

const { userRoutes } = require('./routes/user-route');
const PORT = process.env.PORT;

const  { sequelize } = require('./models')

server.get('/', (req, res) => {
  res.status(200).send('You are home!');
});

server.use(express.json());

server.use(userRoutes);

function start () {
  server.listen(PORT || 3002, async () => {
    await sequelize.sync();
    console.log(`Listening on ${PORT}`);
  });
}

module.exports = { server, start }