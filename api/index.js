'use strict';

const express = require('express');
var bodyParser = require('body-parser')

const api = express.Router();
const nlp = require('./nlp.js')

api.post('/', bodyParser.text(), async (req, res) => {
    var value = req.body;
    console.log("Analysing: " + value)
    try {
        nlp.getEnt(value)
    } catch (e) {
    }
});

module.exports = api;
