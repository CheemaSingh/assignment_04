'use strict';

require('dotenv').config();

const Hapi = require('hapi');
const mongojs = require('mongojs');


const server = new Hapi.Server();  
server.connection({  
    host: 'localhost',
    port: 3000
});


 server.app.db = mongojs(process.env.MYURL, ['groceries']);


server.register([  
  require('./routes/grocery')
], (err) => {

  if (err) {
    throw err;
  }

  server.start((err) => {
    console.log('Server running at:', server.info.uri);
  });

});

