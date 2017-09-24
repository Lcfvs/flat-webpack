'use strict';

const
readFile = require('fs').readFileSync,
resolve = require.resolve;

module.exports = function (root, filename) {
  return JSON.parse(readFile(resolve(root + '/' + filename)));
};