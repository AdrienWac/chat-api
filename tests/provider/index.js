'use strict';

const fs = require('fs');
const path = require('path');

let provider = {};

fs.readdirSync(__dirname)
    .filter(fileName => {
        const providerFileRegex = /^[a-z]+\.provider.js$/g;
        return fileName.match(providerFileRegex);
    })
    .forEach(fileName => {
        const splitFile = fileName.split('.');
        provider[splitFile[0]] = require(`./${splitFile.slice(0, 2).join('.')}`);
    });

module.exports = provider;