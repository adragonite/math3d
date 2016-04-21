/*
Copyright (c) 2016, Alihan Livdumlu.  All rights reserved.
Copyrights licensed under MIT License. See the accompanying LICENSE file for terms.
*/

var Vector = require('./Vector');
var readonly = require('./readonlyProperty');
var inherits = require('util').inherits;

/**
 * Creates a Vector4 from a Vector
 *
 * @param {Vector} vector
 * @returns {Vector4} vector4
 */
function _fromVector(vector) {
  return new _Vector4(vector.values[0], vector.values[1], vector.values[2], vector.values[3]);
}

/**
 * @class
 * A 4-dimensional Vector class with additional functions necessary for 3D operations
 *
 * @param {Number} x, y, z, w
 */
function _Vector4(x, y, z, w) {
  if(!x) x = 0;
  if(!y) y = 0;
  if(!z) z = 0;
  if(!w) w = 0;

  var values = [x, y, z, w];
  Vector.apply(this, [4, values]);

  readonly(this, "x", x);
  readonly(this, "y", y);
  readonly(this, "z", z);
  readonly(this, "w", w);
}

inherits(_Vector4, Vector);

/**
 * Returns the normalized vector
 *
 * @returns {Vector4} normalized vector
 */
_Vector4.prototype.normalize = function () {
  return _fromVector(_Vector4.super_.prototype.normalize.apply(this));
};

/**
 * Returns a vector with the exact opposite direction
 *
 * @returns {Vector4} negative vector
 */
_Vector4.prototype.negate = function () {
  return _fromVector(_Vector4.super_.prototype.negate.apply(this));
};

/**
 * Adds the given vector
 *
 * @param {Vector4} vector
 * @returns {Vector4} result vector
 */
_Vector4.prototype.add = function (vector4) {
  if(!(vector4 instanceof _Vector4))
    throw new TypeError("Addition is defined between two Vector4.");

  return _fromVector(_Vector4.super_.prototype.add.apply(this, [vector4]));
};

/**
 * Subtracts the given vector in the arguments (this - vector4)
 *
 * @param {Vector4} vector
 * @returns {Vector4} result vector
 */
_Vector4.prototype.sub = function (vector4) {
  if(!(vector4 instanceof _Vector4))
    throw new TypeError("Subtraction is defined between two Vector4.");

  return _fromVector(_Vector4.super_.prototype.sub.apply(this, [vector4]));
};

/**
 * Multiplies the vector with a scalar
 *
 * @param {Number} scalar
 * @returns {Vector4} result vector
 */
_Vector4.prototype.mulScalar = function (scalar) {
  return _fromVector(_Vector4.super_.prototype.mulScalar.apply(this, [scalar]));
};

readonly(_Vector4, "one", new _Vector4(1, 1, 1, 1));
readonly(_Vector4, "zero", new _Vector4(0, 0, 0, 0));

module.exports = _Vector4;
