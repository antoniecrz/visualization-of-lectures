'use strict';

const express = require('express');
const app = express();

// serve static files
app.use('/', express.static('public'));

// import the api routes
app.use('/api', require('./api'));


// Use environment variable port, or default to 8080
const port = process.env.PORT || 8080;

// start the server
app.listen(port, (err) => {
    if (err) console.log('error', err);
    else console.log(`app listening on port ${port}`);
  });