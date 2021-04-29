'use strict';

const express = require('express');
var bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const api = express.Router();
const nlp = require('./nlp.js')

api.post('/', bodyParser.text(), async (req, res) => {
    var value = req.body;
    console.log("Analysing: " + value)
    try {
        let apiKey = process.env.CUSTOM_GOOGLE_SEARCH_API_KEY;
        nlp.getEnt(value).then(imageWords => {
            console.log("sending back: ", imageWords);
            res.json({
                imageWords,
                apiKey,
                cx: "674bed17aa09d5aec"
            });
        });
    } catch (e) {
        console.log(e);
    }
});

module.exports = api;
