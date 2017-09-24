'use strict';

module.exports = function (create, prototype, descriptors) {
  return create(prototype || null, descriptors);
}.bind(null, Object.create);