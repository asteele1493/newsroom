'use strict';

require('dotenv').config();

const { sequelize } = require('sequelize');
const { server } = require('./src/server');

const port = process.env.PORT || 3000;
server.listen(port, async () => {
  // await sequelize.drop();
  // await sequelize.sync();
  console.log(`Listening on ${port}`);
})

