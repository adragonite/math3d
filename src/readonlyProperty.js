/*
Copyright (c) 2016, adragonite.  All rights reserved.
Copyrights licensed under MIT License. See the accompanying LICENSE file for terms.
*/

/**
 * Defines a readonly property for the Object
 *
 * @param {Object} obj
 * @param {String} name
 * @param {Any} value
 */
function readonlyProperty (obj, name, val) {
  var prop = {
    configurable: false,
    enumerable: true
  };
  if (typeof val === 'function')
    prop.get = val;
  else {
    prop.writable = false;
    prop.value = val;
  }

  Object.defineProperty(obj, name, prop);
}

module.exports = readonlyProperty;
