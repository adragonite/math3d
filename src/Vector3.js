/*
Copyright (c) 2016, Alihan Livdumlu.  All rights reserved.
Copyrights licensed under MIT License. See the accompanying LICENSE file for terms.
*/

var Vector = require('./Vector');
var Vector4 = require('./Vector4');
var readonly = require('./readonlyProperty');
var inherits = require('util').inherits;
var util = require('./util');

/**
 * Creates a Vector3 from a Vector
 *
 * @param {Vector} vector
 * @returns {Vector3} vector3
 */
function _fromVector(vector) {
  return new _Vector3(vector.values[0], vector.values[1], vector.values[2]);
}

/**
 * Creates a homogeneous vector (vector4) from the given vector3
 * Homogeneous vectors have a w value of 1
 *
 * @param {Vector3} vector3
 * @returns {Vector4} homogeneous vector4
 */
function _getHomogeneous(vector3) {
  return function() {
    return new Vector4(vector3.x, vector3.y, vector3.z, 1);
  }
}

/**
 * Creates a vector4 from the given vector3 with w value of 0
 *
 * @param {Vector3} vector3
 * @returns {Vector4} vector4
 */
function _getVector4(vector3) {
  return function() {
    return new Vector4(vector3.x, vector3.y, vector3.z, 0);
  }
}

/**
 * @class
 * A 3-dimensional Vector class with additional functions necessary for 3D operations
 *
 * @param {Number} x, y, z
 */
function _Vector3(x, y, z) {
  if(!x) x = 0;
  if(!y) y = 0;
  if(!z) z = 0;

  var values = [x, y, z];
  Vector.apply(this, [3, values]);

  readonly(this, "x", x);
  readonly(this, "y", y);
  readonly(this, "z", z);
  readonly(this, "homogeneous", _getHomogeneous(this));
  readonly(this, "vector4", _getVector4(this));
}

inherits(_Vector3, Vector);

/**
 * @constructor
 * Creates a Vector3 from a Vector4
 *
 * @returns {Vector4} vector4
 */
_Vector3.FromVector4 = function(vector4) {
  if(!(vector4 instanceof Vector4))
    throw new TypeError("The argument must be a Vector4.");

  return new _Vector3(vector4.values[0], vector4.values[1], vector4.values[2]);
};

/**
 * Returns the normalized vector
 *
 * @returns {Vector3} normalized vector
 */
_Vector3.prototype.normalize = function () {
  return _fromVector(_Vector3.super_.prototype.normalize.apply(this));
};

/**
 * Returns a vector with the exact opposite direction
 *
 * @returns {Vector3} negative vector
 */
_Vector3.prototype.negate = function () {
  return _fromVector(_Vector3.super_.prototype.negate.apply(this));
};

/**
 * Adds the given vector
 *
 * @param {Vector3} vector
 * @returns {Vector3} result vector
 */
_Vector3.prototype.add = function (vector3) {
  if(!(vector3 instanceof _Vector3))
    throw new TypeError("Addition is defined between two Vector3.");

  return _fromVector(_Vector3.super_.prototype.add.apply(this, [vector3]));
};

/**
 * Returns the average of two vectors
 *
 * @param {Vector3} vector
 * @returns {Vector3} result vector
 */
_Vector3.prototype.average = function (vector3) {
  if(!(vector3 instanceof _Vector3))
    throw new TypeError("Average is defined between two Vector3.");

  return this.add(vector3).mulScalar(0.5);
};

/**
 * Subtracts the given vector in the arguments (this - vector3)
 *
 * @param {Vector3} vector
 * @returns {Vector3} result vector
 */
_Vector3.prototype.sub = function (vector3) {
  if(!(vector3 instanceof _Vector3))
    throw new TypeError("Subtraction is defined between two Vector3.");

  return _fromVector(_Vector3.super_.prototype.sub.apply(this, [vector3]));
};

/**
 * Multiplies the vector with a scalar
 *
 * @param {Number} scalar
 * @returns {Vector3} result vector
 */
_Vector3.prototype.mulScalar = function (scalar) {
  return _fromVector(_Vector3.super_.prototype.mulScalar.apply(this, [scalar]));
};

/**
 * Scales the vector by another vector
 *
 * Given v1 = (x1, y1, z1) and v2 = (x2, y2, z2)
 * v1.scale(v2) = (x1 * x2, y1 * y2, z1 * z2)
 *
 * @param {Vector3} vector
 * @returns {Vector3} result vector
 */
_Vector3.prototype.scale = function (vector3) {
  if(!(vector3 instanceof _Vector3))
    throw new TypeError("Scaling is defined between two Vector3.");

  return new _Vector3(this.x * vector3.x, this.y * vector3.y, this.z * vector3.z);
};

/**
 * Calculates the cross product with the given vector (this x vector3)
 *
 * @param {Vector3} vector
 * @returns {Vector3} result vector
 */
_Vector3.prototype.cross = function (vector3) {
  if(!(vector3 instanceof _Vector3))
    throw new TypeError("Cross product is defined between two Vector3.");

  return new _Vector3(
    this.y * vector3.z - this.z * vector3.y,
    this.z * vector3.x - this.x * vector3.z,
    this.x * vector3.y - this.y * vector3.x);
};

readonly(_Vector3, "back", new _Vector3(0, 0, -1));
readonly(_Vector3, "down", new _Vector3(0, -1, 0));
readonly(_Vector3, "forward", new _Vector3(0, 0, 1));
readonly(_Vector3, "left", new _Vector3(-1, 0, 0));
readonly(_Vector3, "one", new _Vector3(1, 1, 1));
readonly(_Vector3, "right", new _Vector3(1, 0, 0));
readonly(_Vector3, "up", new _Vector3(0, 1, 0));
readonly(_Vector3, "zero", new _Vector3(0, 0, 0));

module.exports = _Vector3;
