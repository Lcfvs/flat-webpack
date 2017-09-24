'use strict';

const
create = require('./create'),
forIn = require('./forIn'),
readJSON = require('./readJSON');

module.exports = create();
module.exports.create = create;
module.exports.forIn = forIn;
module.exports.readJSON = readJSON;