'use strict';

module.exports = function (keys, obj, callback, thisArg) {
  keys(obj).forEach(function(key) {
    callback.call(thisArg, obj[key], key, obj);
  });
}.bind(null, Object.keys);