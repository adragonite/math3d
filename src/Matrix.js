/*
Copyright (c) 2016, Alihan Livdumlu.  All rights reserved.
Copyrights licensed under MIT License. See the accompanying LICENSE file for terms.
*/

var Vector = require('./Vector');
var readonly = require('./readonlyProperty');
var util = require('./util');

/**
 * Creates an array of the rows of a matrix
 *
 * @param {Matrix} matrix
 * @returns {Array} rows array: two-dimensional
 */
function _getRows(matrix) {
  var rows = [];
  for (var i=0; i<matrix.size.rows; i++) {
    rows.push([]);
    for (var j=0; j<matrix.size.columns; j++)
      rows[i].push(matrix.values[matrix.size.columns * i + j]);
  }
  return rows;
}

/**
 * Creates an array of the columns of a matrix
 *
 * @param {Matrix} matrix
 * @returns {Array} columns array: two-dimensional
 */
function _getColumns(matrix) {
  var cols = [];
  for (var i=0; i<matrix.size.columns; i++) {
    cols.push([]);
    for (var j=0; j<matrix.size.rows; j++)
      cols[i].push(matrix.values[i + j * matrix.size.columns]);
  }
  return cols;
}

/**
 * Checks if both the number of rows and columns match for two matrices
 *
 * @param {Matrix} matrix1, matrix2
 * @returns {Boolean} match
 */
function _sizesMatch(matrix1, matrix2) {
  return matrix1.size.rows == matrix2.size.rows &&
    matrix1.size.columns == matrix2.size.columns;
}

/**
 * @class
 * A matrix with arbitrary number of rows and columns
 *
 * @param {Number} numRows
 * @param {Number} numColumns
 * @param {Array} data: one-dimensional array for the values
 */
function _Matrix(numRows, numColumns, data) {
  if(!Number.isInteger(numRows))
    throw new TypeError("/numRows/ must be an integer.");
  if(!Number.isInteger(numColumns))
      throw new TypeError("/numColumns/ must be an integer.");

  var _values;
  var _numValues = numRows * numColumns;
  if (!data || data === undefined)
    _values = [];
  else if (!util.isNumberArray(data))
    throw new TypeError('Invalid values for vector.');
  else
    _values = data;

  // Make sure the matrix has numRows * numColumns values
  if (_values.length < _numValues) {
    var zeros = Array(_numValues - _values.length).fill(0);
    _values = _values.concat(zeros);
  } else if (_values.length > _numValues) {
    _values = _values.slice(0, _numValues);
  }

  var size = {"rows": numRows, "columns": numColumns};
  readonly(this, "size", size);
  readonly(this, "values", _values);
  readonly(this, "rows", _getRows(this));
  readonly(this, "columns", _getColumns(this));
}

/**
 * Returns a matrix multiplied with -1
 *
 * @param {Matrix} matrix
 * @returns {Matrix} negative matrix
 */
_Matrix.prototype.negate = function() {
  var values = this.values.map(function(v) { return -v; });
  return new _Matrix(this.size.rows, this.size.columns, values);
}

/**
 * Multiplies the matrix with a scalar
 *
 * @param {Number} scalar
 * @returns {Matrix} result matrix
 */
_Matrix.prototype.mulScalar = function (scalar) {
  if(!util.isNumber(scalar))
    throw new TypeError("/scalar/ must be a number.");

  var values = this.values.map(function(v) { return v * scalar; });
  return new _Matrix(this.size.rows, this.size.columns, values);
};

/**
 * Returns true if two matrices are equal
 *
 * @param {Matrix} matrix
 * @returns {Boolean} result
 */
_Matrix.prototype.equals = function (matrix) {
  if(!(matrix instanceof _Matrix))
    throw new TypeError("Equality is defined between two quaternions.");

  return _sizesMatch(this, matrix) && util.arraysEqual(this.values, matrix.values);
};

/**
 * Returns the transpose of the matrix
 *
 * @returns {Matrix} result matrix
 */
_Matrix.prototype.transpose = function () {
  var values = Array(this.values.length).fill(0);
  for (var i=0; i<this.size.columns; i++)
    for (var j=0; j<this.size.rows; j++)
      values[i*this.size.rows + j] = this.columns[i][j];

  return new _Matrix(this.size.columns, this.size.rows, values);
};

/**
 * Adds the given matrix
 *
 * @param {Matrix} matrix
 * @returns {Matrix} result matrix
 */
_Matrix.prototype.add = function (matrix) {
  if (!(matrix instanceof _Matrix))
    throw new TypeError("Addition is defined between two matrices.");
  if (!_sizesMatch(this, matrix))
    throw new TypeError('Matrices should have the same number of rows and columns.');

  var values = Array(this.values.length).fill(0);
  for (var i=0; i<values.length; i++)
    values[i] = this.values[i] + matrix.values[i];

  return new _Matrix(this.size.rows, this.size.columns, values);
};

/**
 * Subtracts the given matrix in the argument (this - matrix)
 *
 * @param {Matrix} matrix
 * @returns {Matrix} result matrix
 */
_Matrix.prototype.sub = function (matrix) {
  if (!(matrix instanceof _Matrix))
    throw new TypeError('Subtraction is defined between two matrices.');
  if (!_sizesMatch(this, matrix))
    throw new TypeError('Matrices should have the same number of rows and columns.');

  var values = Array(this.values.length).fill(0);
  for (var i=0; i<values.length; i++)
    values[i] = this.values[i] - matrix.values[i];

  return new _Matrix(this.size.rows, this.size.columns, values);
};

/**
 * Right multiplies with the given matrix in the argument (this * matrix)
 *
 * @param {Matrix} matrix
 * @returns {Matrix} result matrix
 */
_Matrix.prototype.mul = function (matrix) {
  if (!(matrix instanceof _Matrix))
    throw new TypeError("Multiplication is defined between two matrices.");
  if (this.size.columns != matrix.size.rows)
    throw new TypeError('The number of columns in the left matrix should be equal to the number of rows in the right matrix.');

  var values = [];
  for (var i=0; i<this.size.rows; i++)
    for (var j=0; j<matrix.size.columns; j++) {
      var sum = 0;
      for (var k=0; k<this.size.columns; k++)
        sum += this.rows[i][k] * matrix.columns[j][k];
      values.push(sum);
    }

  return new _Matrix(this.size.rows, matrix.size.columns, values);
};

/**
 * Right multiplies with the given vector in the argument (this * vector)
 *
 * @param {Vector} vector
 * @returns {Vector} result vector
 */
_Matrix.prototype.mulVector = function (vector) {
  if (!(vector instanceof Vector))
    throw new TypeError("Multiply vector expects a Vector as argument.");
  if (this.size.columns != vector.dimension)
    throw new TypeError('The number of columns in the matrix should be equal to the dimension of the vector.');

  var values = [];
  for (var i=0; i<this.size.rows; i++){
    var sum = 0;
    for (var k=0; k<this.size.columns; k++)
      sum += this.rows[i][k] * vector.values[k];
    values.push(sum);
  }

  return new Vector(vector.dimension, values);
};

_Matrix.prototype.toString = function() {
  var result = "";
  this.rows.forEach(function(row, index) {
    if (index != 0) result += "\n";
    result += "|" + row + "|";
  });
  return result;
};

module.exports = _Matrix;
