/*
Copyright (c) 2016, Alihan Livdumlu.  All rights reserved.
Copyrights licensed under MIT License. See the accompanying LICENSE file for terms.
*/

var readonly = require('./readonlyProperty');
var util = require('./util');

/**
 * Returns the magnitude of the vector
 *
 * Given v = (x1, x2, ... xN)
 * magnitude is defined as n = x1 * x1 + x2 * x2 + ... + xN * xN
 *
 * @param {Array} values: values of the vector
 * @returns {Number} maginitude
 */
function _magnitudeOf(values) {
  var result = 0;

  for (var i = 0; i < values.length; i++)
      result += values[i] * values[i];

  return Math.sqrt(result);
}

/**
 * @class
 * A vector of arbitrary dimension
 *
 * @param {Number} dimension
 * @param {Array} data: one-dimensional array for values
 */
function _Vector(dimension, data) {
  if (!dimension || !Number.isInteger(dimension))
    throw new TypeError('Dimension of the array must be an integer.');

  var _values;
  if (!data || data === undefined)
    _values = [];
  else if (!util.isNumberArray(data))
    throw new TypeError('Invalid values for vector.');
  else
    _values = data;

  if (_values.length < dimension) {
    var zeros = Array(dimension - _values.length).fill(0);
    _values = _values.concat(zeros);
  } else if (_values.length > dimension) {
    _values = _values.slice(0, dimension);
  }

  readonly(this, "dimension", dimension);
  readonly(this, "values", _values);
  readonly(this, "magnitude", _magnitudeOf(_values));
}

/**
 * Returns the normalized vector
 *
 * @returns {Vector} normalized vector
 */
_Vector.prototype.normalize = function() {
  var magnitude = this.magnitude;
  if (magnitude === 0)
    return this;

  var values = this.values.map(function(v) { return v / magnitude; });
  return new _Vector(this.dimension, values);
}

/**
 * Returns a vector with the exact opposite direction
 *
 * @returns {Vector} negative vector
 */
_Vector.prototype.negate = function () {
  var values = this.values.map(function(v) { return -v; });
  return new _Vector(this.dimension, values);
}

/**
 * Returns true if two vectors are equal
 *
 * @param {Vector} vector
 * @returns {Boolean} result
 */
_Vector.prototype.equals = function (vector) {
  if(!(vector instanceof _Vector))
    throw new TypeError("Equality is defined between two vectors.");
  if(this.dimension != vector.dimension)
    return false;

  return util.arraysEqual(this.values, vector.values);
};

/**
 * Adds the given vector
 *
 * @param {Vector} vector
 * @returns {Vector} result vector
 */
_Vector.prototype.add = function (vector) {
  if (!(vector instanceof _Vector))
    throw new TypeError("Addition is defined between two Vectors.");
  if (this.values.length != vector.values.length)
    throw new TypeError('Vectors should have the same length.');

  var values = Array(this.dimension).fill(0);
  for (var i=0; i<this.dimension; i++)
    values[i] = this.values[i] + vector.values[i];

  return new _Vector(this.dimension, values);
};

/**
 * Subtracts the given vector in the arguments (this - vector)
 *
 * @param {Vector} vector
 * @returns {Vector} result vector
 */
_Vector.prototype.sub = function (vector) {
  if (!(vector instanceof _Vector))
    throw new TypeError("Subtraction is defined between two Vectors.");
  if (this.values.length != vector.values.length)
    throw new TypeError('Vectors should have the same length.');

    var values = Array(this.dimension).fill(0);
    for (var i=0; i<this.dimension; i++)
      values[i] = this.values[i] - vector.values[i];

    return new _Vector(this.dimension, values);
};

/**
 * Multiplies the vector with a scalar
 *
 * @param {Number} scalar
 * @returns {Vector} result vector
 */
_Vector.prototype.mulScalar = function (scalar) {
  if(!util.isNumber(scalar))
    throw new TypeError("/scalar/ must be a number.");

  var values = [];
  for (var i=0; i<this.dimension; i++)
    values[i] = this.values[i] * scalar;

  return new _Vector(this.dimension, values);
};

/**
 * Calculates the dot product of two vectors
 *
 * @param {Vector} vector
 * @returns {Number} dot product
 */
_Vector.prototype.dot = function (vector) {
  if (!(vector instanceof _Vector))
    throw new TypeError("Dot product is defined between two Vectors.");
  if (this.values.length != vector.values.length)
    throw new TypeError('Vectors should have the same length.');

  var result = 0;
  for (var i=0; i<this.dimension; i++)
    result += this.values[i] * vector.values[i];

  return result;
};

/**
 * Calculates the distance between two vectors
 *
 * @param {Vector} vector
 * @returns {Number} distance
 */
_Vector.prototype.distanceTo = function (vector) {
  if (!(vector instanceof _Vector))
    throw new TypeError("Distance can be measured between two Vectors.");
  if (this.values.length != vector.values.length)
    throw new TypeError('Vectors should have the same length.');

  var result = 0;
  for (var i=0; i<this.dimension; i++) {
    var dif = this.values[i] - vector.values[i];
    result += dif * dif;
  }

  return Math.sqrt(result);
};

_Vector.prototype.toString = function() {
  return "(" + this.values.toString() + ")";
};

module.exports = _Vector;
