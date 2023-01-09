'use strict';

require('dotenv').config();

const { sequelize } = require('./src/models');
const { server } = require('./src/server');

const port = process.env.PORT || 3000;

server.listen(port, async () => {
  await sequelize.drop();
  await sequelize.sync({
    alter:true
  });
  console.log(`Listening on ${port}`);
})

