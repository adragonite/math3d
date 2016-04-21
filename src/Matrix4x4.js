/*
Copyright (c) 2016, Alihan Livdumlu.  All rights reserved.
Copyrights licensed under MIT License. See the accompanying LICENSE file for terms.
*/

var Matrix = require('./Matrix');
var Vector3 = require('./Vector3');
var Quaternion = require('./Quaternion');
var readonly = require('./readonlyProperty');
var util = require('./util');
var inherits = require('util').inherits;

/**
 * Creates a Matrix4x4 object from a general Matrix(4,4) object
 *
 * @param {Matrix} matrix
 * @returns {Matrix4x4} matrix4x4
 */
function _fromMatrix(matrix) {
  return new _Matrix4x4(matrix.values);
}

/**
 * @class
 * A 4x4 Matrix class with additional functions necessary for 3D operations
 *
 * @param {Array} data: one-dimensional array for the values
 */
function _Matrix4x4(data) {
  Matrix.apply(this, [4, 4, data]);

  for(var i=0; i<4; i++)
    for(var j=0; j<4; j++)
      readonly(this, "m" + (i+1) + (j+1), this.values[4 * i + j]);
}

inherits(_Matrix4x4, Matrix);

/**
 * @constructor
 * Creates a flipMatrix that changes the direction of the x, y and z axis
 *
 * @param {Boolean} flipX: change direction of the x axis
 * @param {Boolean} flipY: change direction of the y axis
 * @param {Boolean} flipZ: change direction of the z axis
 * @returns {Matrix4x4} flip matrix
 */
_Matrix4x4.FlipMatrix = function(flipX, flipY, flipZ) {
  var _x = flipX ? -1 : 1;
  var _y = flipY ? -1 : 1;
  var _z = flipZ ? -1 : 1;

  return _Matrix4x4.ScaleMatrix(new Vector3(_x, _y, _z));
};

/**
 * @constructor
 * Creates a scale matrix for the given scale (vector)
 *
 * @param {Number|Vector3} scale
 * @returns {Matrix4x4} scale matrix
 */
_Matrix4x4.ScaleMatrix = function(scale) {
  if (util.isNumber(scale))
    scale = new Vector3(scale, scale, scale);
  else if(!(scale instanceof Vector3))
    throw new TypeError('/scale/ must either be a number or a Vector3.');

  return new _Matrix4x4([
    scale.x, 0, 0, 0,
    0, scale.y, 0, 0,
    0, 0, scale.z, 0,
    0, 0, 0, 1
  ]);
};

/**
 * @constructor
 * Creates a translation matrix for the given translation vector
 *
 * @param {Vector3} translation
 * @returns {Matrix4x4} translation matrix
 */
_Matrix4x4.TranslationMatrix = function(translation) {
  if(!(translation instanceof Vector3))
    throw new TypeError('/translation/ must be a Vector3.');

  return new _Matrix4x4([
    1, 0, 0, translation.x,
    0, 1, 0, translation.y,
    0, 0, 1, translation.z,
    0, 0, 0, 1
  ]);
};

/**
 * @constructor
 * Creates a rotation matrix for the given quaternion
 *
 * @param {Quaternion} rotation
 * @returns {Matrix4x4} rotation matrix
 */
_Matrix4x4.RotationMatrix = function(rotation) {
  if(!(rotation instanceof Quaternion))
    throw new TypeError('/rotation/ must be a Quaternion.');

    var num = rotation.x * 2;
    var num2 = rotation.y * 2;
    var num3 = rotation.z * 2;
    var num4 = rotation.x * num;
    var num5 = rotation.y * num2;
    var num6 = rotation.z * num3;
    var num7 = rotation.x * num2;
    var num8 = rotation.x * num3;
    var num9 = rotation.y * num3;
    var num10 = rotation.w * num;
    var num11 = rotation.w * num2;
    var num12 = rotation.w * num3;

    return new _Matrix4x4([
      1 - (num5 + num6), num7 - num12, num8 + num11, 0,
      num7 + num12, 1 - (num4 + num6), num9 - num10, 0,
      num8 - num11, num9 + num10, 1 - (num4 + num5), 0,
      0,0,0,1
    ]);
};

/**
 * @constructor
 * Creates a translation-rotation-scale matrix with for given arguments
 *
 * @param {Vector3} translation
 * @param {Quaternion} rotation
 * @param {Number|Vector3} scale
 * @returns {Matrix4x4} TRS matrix
 */
_Matrix4x4.TRS = function(translation, rotation, scale) {
  var t = _Matrix4x4.TranslationMatrix(translation);
  var r = _Matrix4x4.RotationMatrix(rotation);
  var s = _Matrix4x4.ScaleMatrix(scale);
  return t.mul(r.mul(s));
};

/**
 * @constructor
 * Creates a conversion matrix from the local space to the world space
 *
 * @param {Vector3} position: origin of local coordinate system according to world space
 * @param {Quaternion} [rotation]: rotation of local coordinate system according to world space
 * @param {Number|Vector3} [scale]: (local space scale) / (world space scale)
 * @returns {Matrix4x4} conversion matrix
 */
_Matrix4x4.LocalToWorldMatrix = function(position, rotation, scale) {
  if(!scale)
    scale = Vector3.one;

  if (!rotation)
    fromRotation = Quaternion.identity;

  return _Matrix4x4.TRS(position, rotation, scale);
};

/**
 * @constructor
 * Creates a conversion matrix from the world space to the local space
 *
 * @param {Vector3} position: origin of local coordinate system according to world space
 * @param {Quaternion} [rotation]: rotation of local coordinate system according to world space
 * @param {Number|Vector3} [scale]: (local space scale) / (world space scale)
 * @returns {Matrix4x4} conversion matrix
 */
_Matrix4x4.WorldToLocalMatrix = function(position, rotation, scale) {
  return _Matrix4x4.LocalToWorldMatrix(position, rotation, scale).inverse();
};

/**
 * Returns the determinant
 *
 * @returns {Number} determinant
 */
_Matrix4x4.prototype.determinant = function() {
  return this.m14 * this.m23 * this.m32 * this.m41 - this.m13 * this.m24 * this.m32 * this.m41 -
         this.m14 * this.m22 * this.m33 * this.m41 + this.m12 * this.m24 * this.m33 * this.m41 +
         this.m13 * this.m22 * this.m34 * this.m41 - this.m12 * this.m23 * this.m34 * this.m41 -
         this.m14 * this.m23 * this.m31 * this.m42 + this.m13 * this.m24 * this.m31 * this.m42 +
         this.m14 * this.m21 * this.m33 * this.m42 - this.m11 * this.m24 * this.m33 * this.m42 -
         this.m13 * this.m21 * this.m34 * this.m42 + this.m11 * this.m23 * this.m34 * this.m42 +
         this.m14 * this.m22 * this.m31 * this.m43 - this.m12 * this.m24 * this.m31 * this.m43 -
         this.m14 * this.m21 * this.m32 * this.m43 + this.m11 * this.m24 * this.m32 * this.m43 +
         this.m12 * this.m21 * this.m34 * this.m43 - this.m11 * this.m22 * this.m34 * this.m43 -
         this.m13 * this.m22 * this.m31 * this.m44 + this.m12 * this.m23 * this.m31 * this.m44 +
         this.m13 * this.m21 * this.m32 * this.m44 - this.m11 * this.m23 * this.m32 * this.m44 -
         this.m12 * this.m21 * this.m33 * this.m44 + this.m11 * this.m22 * this.m33 * this.m44;
};

/**
 * Returns the inverse of the matrix if exits, otherwise undefined
 *
 * @returns {Matrix4x4|undefined} inverse matrix
 */
_Matrix4x4.prototype.inverse = function() {
  var inv = Array(16);
  inv[0] = this.values[5]  * this.values[10] * this.values[15] -
           this.values[5]  * this.values[11] * this.values[14] -
           this.values[9]  * this.values[6]  * this.values[15] +
           this.values[9]  * this.values[7]  * this.values[14] +
           this.values[13] * this.values[6]  * this.values[11] -
           this.values[13] * this.values[7]  * this.values[10];

  inv[4] = -this.values[4]  * this.values[10] * this.values[15] +
            this.values[4]  * this.values[11] * this.values[14] +
            this.values[8]  * this.values[6]  * this.values[15] -
            this.values[8]  * this.values[7]  * this.values[14] -
            this.values[12] * this.values[6]  * this.values[11] +
            this.values[12] * this.values[7]  * this.values[10];

  inv[8] = this.values[4]  * this.values[9] * this.values[15] -
           this.values[4]  * this.values[11] * this.values[13] -
           this.values[8]  * this.values[5] * this.values[15] +
           this.values[8]  * this.values[7] * this.values[13] +
           this.values[12] * this.values[5] * this.values[11] -
           this.values[12] * this.values[7] * this.values[9];

  inv[12] = -this.values[4]  * this.values[9] * this.values[14] +
             this.values[4]  * this.values[10] * this.values[13] +
             this.values[8]  * this.values[5] * this.values[14] -
             this.values[8]  * this.values[6] * this.values[13] -
             this.values[12] * this.values[5] * this.values[10] +
             this.values[12] * this.values[6] * this.values[9];

  inv[1] = -this.values[1]  * this.values[10] * this.values[15] +
            this.values[1]  * this.values[11] * this.values[14] +
            this.values[9]  * this.values[2] * this.values[15] -
            this.values[9]  * this.values[3] * this.values[14] -
            this.values[13] * this.values[2] * this.values[11] +
            this.values[13] * this.values[3] * this.values[10];

  inv[5] = this.values[0]  * this.values[10] * this.values[15] -
           this.values[0]  * this.values[11] * this.values[14] -
           this.values[8]  * this.values[2] * this.values[15] +
           this.values[8]  * this.values[3] * this.values[14] +
           this.values[12] * this.values[2] * this.values[11] -
           this.values[12] * this.values[3] * this.values[10];

  inv[9] = -this.values[0]  * this.values[9] * this.values[15] +
            this.values[0]  * this.values[11] * this.values[13] +
            this.values[8]  * this.values[1] * this.values[15] -
            this.values[8]  * this.values[3] * this.values[13] -
            this.values[12] * this.values[1] * this.values[11] +
            this.values[12] * this.values[3] * this.values[9];

  inv[13] = this.values[0]  * this.values[9] * this.values[14] -
            this.values[0]  * this.values[10] * this.values[13] -
            this.values[8]  * this.values[1] * this.values[14] +
            this.values[8]  * this.values[2] * this.values[13] +
            this.values[12] * this.values[1] * this.values[10] -
            this.values[12] * this.values[2] * this.values[9];

  inv[2] = this.values[1]  * this.values[6] * this.values[15] -
           this.values[1]  * this.values[7] * this.values[14] -
           this.values[5]  * this.values[2] * this.values[15] +
           this.values[5]  * this.values[3] * this.values[14] +
           this.values[13] * this.values[2] * this.values[7] -
           this.values[13] * this.values[3] * this.values[6];

  inv[6] = -this.values[0]  * this.values[6] * this.values[15] +
            this.values[0]  * this.values[7] * this.values[14] +
            this.values[4]  * this.values[2] * this.values[15] -
            this.values[4]  * this.values[3] * this.values[14] -
            this.values[12] * this.values[2] * this.values[7] +
            this.values[12] * this.values[3] * this.values[6];

  inv[10] = this.values[0]  * this.values[5] * this.values[15] -
            this.values[0]  * this.values[7] * this.values[13] -
            this.values[4]  * this.values[1] * this.values[15] +
            this.values[4]  * this.values[3] * this.values[13] +
            this.values[12] * this.values[1] * this.values[7] -
            this.values[12] * this.values[3] * this.values[5];

  inv[14] = -this.values[0]  * this.values[5] * this.values[14] +
             this.values[0]  * this.values[6] * this.values[13] +
             this.values[4]  * this.values[1] * this.values[14] -
             this.values[4]  * this.values[2] * this.values[13] -
             this.values[12] * this.values[1] * this.values[6] +
             this.values[12] * this.values[2] * this.values[5];

  inv[3] = -this.values[1] * this.values[6] * this.values[11] +
            this.values[1] * this.values[7] * this.values[10] +
            this.values[5] * this.values[2] * this.values[11] -
            this.values[5] * this.values[3] * this.values[10] -
            this.values[9] * this.values[2] * this.values[7] +
            this.values[9] * this.values[3] * this.values[6];

  inv[7] = this.values[0] * this.values[6] * this.values[11] -
           this.values[0] * this.values[7] * this.values[10] -
           this.values[4] * this.values[2] * this.values[11] +
           this.values[4] * this.values[3] * this.values[10] +
           this.values[8] * this.values[2] * this.values[7] -
           this.values[8] * this.values[3] * this.values[6];

  inv[11] = -this.values[0] * this.values[5] * this.values[11] +
             this.values[0] * this.values[7] * this.values[9] +
             this.values[4] * this.values[1] * this.values[11] -
             this.values[4] * this.values[3] * this.values[9] -
             this.values[8] * this.values[1] * this.values[7] +
             this.values[8] * this.values[3] * this.values[5];

  inv[15] = this.values[0] * this.values[5] * this.values[10] -
            this.values[0] * this.values[6] * this.values[9] -
            this.values[4] * this.values[1] * this.values[10] +
            this.values[4] * this.values[2] * this.values[9] +
            this.values[8] * this.values[1] * this.values[6] -
            this.values[8] * this.values[2] * this.values[5];

  det = this.values[0] * inv[0] + this.values[1] * inv[4] + this.values[2] * inv[8] + this.values[3] * inv[12];

  if (det == 0)
      return undefined;

  det = 1.0 / det;
  for (i = 0; i < 16; i++)
      inv[i] = inv[i] * det;

  return new _Matrix4x4(inv);
};

/**
 * Returns a matrix multiplied with -1
 *
 * @returns {Matrix4x4} negative matrix
 */
_Matrix4x4.prototype.negate = function() {
  return _fromMatrix(_Matrix4x4.super_.prototype.negate.apply(this));
};

/**
 * Returns the transpose of the matrix
 *
 * @returns {Matrix4x4} result matrix
 */
_Matrix4x4.prototype.transpose = function () {
  return _fromMatrix(_Matrix4x4.super_.prototype.transpose.apply(this));
};

/**
 * Adds the given matrix
 *
 * @param {Matrix4x4} matrix4x4
 * @returns {Matrix4x4} result matrix
 */
_Matrix4x4.prototype.add = function(matrix4x4) {
  return _fromMatrix(_Matrix4x4.super_.prototype.add.apply(this, [matrix4x4]));
};

/**
 * Subtracts the given matrix in the argument (this - matrix4x4)
 *
 * @param {Matrix4x4} matrix4x4
 * @returns {Matrix4x4} result matrix
 */
_Matrix4x4.prototype.sub = function(matrix4x4) {
  return _fromMatrix(_Matrix4x4.super_.prototype.sub.apply(this, [matrix4x4]));
};

/**
 * Multiplies the matrix with a scalar
 *
 * @param {Number} scalar
 * @returns {Matrix4x4} result matrix
 */
 _Matrix4x4.prototype.mulScalar = function(scalar) {
   return _fromMatrix(_Matrix4x4.super_.prototype.mulScalar.apply(this, [scalar]));
 };

/**
 * Right multiplies with the given matrix in the argument (this * matrix4x4)
 *
 * @param {Matrix4x4} matrix4x4
 * @returns {Matrix4x4} result matrix
 */
_Matrix4x4.prototype.mul = function(matrix4x4) {
  return _fromMatrix(_Matrix4x4.super_.prototype.mul.apply(this, [matrix4x4]));
};

/**
 * Right multiplies with the given vector in the argument (this * vector3)
 * Uses the homogeneous vector of the given Vector3
 *
 * @param {Vector3} vector3
 * @returns {Vector3} result vector
 */
_Matrix4x4.prototype.mulVector3 = function(vector3) {
  if (!(vector3 instanceof Vector3))
    throw new TypeError("The argument must be a Vector3.");

  var vector = this.mulVector(vector3.homogeneous);
  return new Vector3(vector.values[0], vector.values[1], vector.values[2]);
};

readonly(_Matrix4x4, "zero", new _Matrix4x4([]));
readonly(_Matrix4x4, "identity", new _Matrix4x4([
  1,0,0,0,
  0,1,0,0,
  0,0,1,0,
  0,0,0,1
]));

module.exports = _Matrix4x4;
