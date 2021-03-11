'use strict';

const express = require('express');

const api = express.Router();

api.get('/', async (req, res) => {


    // TODO: get text from browser client

    // TODO: run through natural language processor

    // TODO: search in google API to get images from trusted sources

    // TODO: return keywords used

    // TODO: return links to images

    res.send('123');
    // example api route
});

module.exports = api;
