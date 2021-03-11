'use strict';

const express = require('express');

const api = express.Router();

api.get('/', async (req, res) => {
    res.send('123');
    // example api route
});

module.exports = api;
