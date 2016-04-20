/*
Copyright (c) 2016, Alihan Livdumlu.  All rights reserved.
Copyrights licensed under MIT License. See the accompanying LICENSE file for terms.
*/

var Vector3 = require('./Vector3');
var readonly = require('./readonlyProperty');
var inherits = require('util').inherits;
var util = require('./util');

var radToDeg = 180.0 / Math.PI;
var degToRad = Math.PI / 180.0;

/**
 * Returns the normalized coordinates of the given quaternion coordinates
 *
 * @param {Number} x y z w
 * @returns {Object} normalized coordinates
 */
function _normalizedCoordinates(x, y, z, w) {
  var magnitude = Math.sqrt(x * x + y * y + z * z + w * w);
  if (magnitude === 0)
    return this;

  return {
    "x": x / magnitude,
    "y": y / magnitude,
    "z": z / magnitude,
    "w": w / magnitude};
}

/**
 * Returns a quaternion for the given euler angles in radians
 * The rotations for the euler angles are applied in the order: z then x then y
 *
 * @param {Number} x y z: euler angles in radians
 * @returns {Quaternion} quaternion
 */
function _fromEuler(x, y, z) {
  x = x / 2;
  y = y / 2;
  z = z / 2;

  var c1 = Math.cos(y),
      s1 = Math.sin(y),
      c2 = Math.cos(x),
      s2 = Math.sin(x),
      c3 = Math.cos(z),
      s3 = Math.sin(z);

  return new _Quaternion(
      s1 * c2 * s3 + c1 * s2 * c3,
      s1 * c2 * c3 - c1 * s2 * s3,
      c1 * c2 * s3 - s1 * s2 * c3,
      c1 * c2 * c3 + s1 * s2 * s3);
}

/**
 * Returns a quaternion for the given unit axis and angles in radians
 *
 * @param {Vector3} axis: unit vector
 * @param {Number} angle: in radians
 * @returns {Quaternion} quaternion
 */
function _fromAngleAxis(axis, angle) {
  var s = Math.sin(angle/2);
  var c = Math.cos(angle/2);

  return new _Quaternion(axis.x * s, axis.y * s, axis.z * s, c);
}

/**
 * Returns the euler angles for the given quaternion
 * The rotations for the euler angles are applied in the order: z then x then y
 *
 * @param {Quternion} quaternion
 * @returns {Object} eulerAngles: {x:_, y:_, z:_}
 */
function _getEulerAngles(q) {
  var poleSum = q.x * q.w - q.y * q.z;
  if (util.doublesEqual(poleSum, 0.5))
    return {"x": 90, "y": 0, "z": 0};
  else if (util.doublesEqual(poleSum, -0.5))
    return {"x": -90, "y": 0, "z": 0};

  var sqw = q.w * q.w;
  var sqx = q.x * q.x;
  var sqy = q.y * q.y;
  var sqz = q.z * q.z;

  //var _x = Math.atan2(2 * q.x * q.w - 2 * q.y * q.z, 1 - 2 * sqx  - 2 * sqz);
  var _x = Math.asin(2 * q.x * q.w - 2 * q.y * q.z)
  //var _y = Math.atan2(2 * q.y * q.w - 2 * q.x * q.z, 1 - 2 * sqy  - 2 * sqz);
  var _y = Math.atan2(2 * q.x * q.z + 2 * q.y * q.w, 1 - 2 * sqy - 2 * sqx);
  //var _z = Math.asin(2 * q.x * q.y + 2 * q.z * q.w);
  var _z = Math.PI - Math.atan2(2 * q.x * q.y + 2 * q.z * q.w, 1 - 2 * sqy - 2 * sqw);

  return {
    "x": _normalizeRad(_x),
    "y": _normalizeRad(_y),
    "z": _normalizeRad(_z)
  };
}

function _normalizeRad(rad) {
  var angle = rad * radToDeg;
  while (angle > 360)
      angle -= 360;
  while (angle < 0)
      angle += 360;
  return angle;
}

/**
 * Returns the angle axis representation for the quaternion with angle in degrees
 *
 * @param {Quternion} quaternion
 * @returns {Object} angleAxis: {axis:_Vector3_, angle:_}
 */
function _getAngleAxis(quaternion) {
  return function() {
    var sqrt = Math.sqrt(1 - quaternion.w * quaternion.w);
    return {
      axis: new Vector3(quaternion.x / sqrt, quaternion.y / sqrt, quaternion.z / sqrt),
      angle: 2 * Math.acos(quaternion.w) * radToDeg
    };
  }
}

/**
 * @class
 * Creates a unit quaternion according to the given x, y, z, w values
 *
 * @param {Number} x, y, z, w
 * @returns {Quaternion} unit quaternion
 */
function _Quaternion(x, y, z, w) {
  if(!x || !util.isNumber(x)) x = 0;
  if(!y || !util.isNumber(y)) y = 0;
  if(!z || !util.isNumber(z)) z = 0;
  if(w === undefined || !util.isNumber(w)) w = 1;

  var unitCoordinates = _normalizedCoordinates(x, y, z, w);
  x = unitCoordinates.x;
  y = unitCoordinates.y;
  z = unitCoordinates.z;
  w = unitCoordinates.w;

  readonly(this, "x", x);
  readonly(this, "y", y);
  readonly(this, "z", z);
  readonly(this, "w", w);
  readonly(this, "eulerAngles", _getEulerAngles(this));
  readonly(this, "angleAxis", _getAngleAxis(this));
}

/**
 * @constructor
 * Creates a unit quaternion from the given euler angles in degrees
 *
 * @param {Number} x, y, z
 * @returns {Quaternion} unit quaternion
 */
_Quaternion.Euler = function(x, y, z) {
  if(!util.isNumber(x) || !util.isNumber(y) || !util.isNumber(z))
    throw new TypeError("Arguments must be numbers.");

  return _fromEuler(x * degToRad, y * degToRad, z * degToRad);
}

/**
 * @constructor
 * Creates a unit quaternion from the given axis and the angle in degrees around it
 *
 * @param {Vector3} axis
 * @param {Number} angle: in degrees
 * @returns {Quaternion} unit quaternion
 */
_Quaternion.AngleAxis = function(axis, angle) {
  if(!(axis instanceof Vector3))
    throw new TypeError("/axis/ must be a Vector3.");
  if(!util.isNumber(angle))
    throw new TypeError("/angle/ must be a number.");

  return _fromAngleAxis(axis.normalize(), angle * degToRad);
}

/**
 * Returns the conjugate quaternion
 *
 * The conjugate quaternion is defined as (-x, -y, -z, w)
 *
 * @returns {Quaternion} conjugate quaternion
 */
_Quaternion.prototype.conjugate = function() {
  return new _Quaternion(-this.x, -this.y, -this.z, this.w);
};

/**
 * Returns the inverse of the quaternion
 *
 * @returns {Quaternion} inverse quaternion
 */
_Quaternion.prototype.inverse = function() {
  return this.conjugate();
};

/**
 * Returns true if two quaternions are equal
 *
 * @param {Quaternion} quaternion
 * @returns {Boolean} result
 */
_Quaternion.prototype.equals = function (quaternion) {
  if(!(quaternion instanceof _Quaternion))
    throw new TypeError("Equality is defined between two quaternions.");

  return util.doublesEqual(this.x, quaternion.x) &&
         util.doublesEqual(this.y, quaternion.y) &&
         util.doublesEqual(this.z, quaternion.z) &&
         util.doublesEqual(this.w, quaternion.w);
};

/**
 * Calculates the dot (inner) product with the given quaternion
 *
 * For quaternions q1 and q2, dot product equals:
 * q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w
 *
 * @returns {Number} dot product
 */
_Quaternion.prototype.dot = function(quaternion) {
  if (!(quaternion instanceof _Quaternion))
    throw new TypeError('The argument must be a quaternion.');

  return this.x * quaternion.x
       + this.y * quaternion.y
       + this.z * quaternion.z
       + this.w * quaternion.w;
}

/**
 * Defines a notion to measure the similarity between two quaternions
 * It is quicker than calculating the angle as it does not use trigonometric functions
 *
 * The distance is 0 for equal quaternions and 1 for an angle responding to 180 degrees
 *
 * @param {Quaternion} quaternion
 * @returns {Number} distance [0, 1]
 */
_Quaternion.prototype.distanceTo = function(quaternion) {
  if (!(quaternion instanceof _Quaternion))
    throw new TypeError('The argument must be a quaternion.');

  var dot = this.dot(quaternion);
  return 1 - dot * dot;
};

/**
 * Returns angle between two quaternions in degrees
 *
 * @param {Quaternion} quaternion
 * @returns {Number} angle in degrees
 */
_Quaternion.prototype.angleTo = function(quaternion) {
  if (!(quaternion instanceof _Quaternion))
    throw new TypeError('The argument must be a quaternion.');

  var dot = this.dot(quaternion);
  return Math.acos(2 * dot * dot - 1) * radToDeg;
};

/**
 * Right multiplies with the given quaternion in the argument (this * quaternion)
 *
 * @param {Quaternion} quaternion
 * @returns {Quaternion} result quaternion
 */
_Quaternion.prototype.mul = function(quaternion) {
  return new _Quaternion(
    this.x * quaternion.w  +  this.y * quaternion.z  -  this.z * quaternion.y  +  this.w * quaternion.x,
    -this.x * quaternion.z  +  this.y * quaternion.w  +  this.z * quaternion.x  +  this.w * quaternion.y,
    this.x * quaternion.y  -  this.y * quaternion.x  +  this.z * quaternion.w  +  this.w * quaternion.z,
    -this.x * quaternion.x  -  this.y * quaternion.y  -  this.z * quaternion.z  +  this.w * quaternion.w);
};

_Quaternion.prototype.mulVector3 = function(vector3) {
  var num = this.x * 2;
  var num2 = this.y * 2;
  var num3 = this.z * 2;
  var num4 = this.x * num;
  var num5 = this.y * num2;
  var num6 = this.z * num3;
  var num7 = this.x * num2;
  var num8 = this.x * num3;
  var num9 = this.y * num3;
  var num10 = this.w * num;
  var num11 = this.w * num2;
  var num12 = this.w * num3;

  return new Vector3(
    (1 - (num5 + num6)) * vector3.x + (num7 - num12) * vector3.y + (num8 + num11) * vector3.z,
    (num7 + num12) * vector3.x + (1 - (num4 + num6)) * vector3.y + (num9 - num10) * vector3.z,
    (num8 - num11) * vector3.x + (num9 + num10) * vector3.y + (1 - (num4 + num5)) * vector3.z);
};

_Quaternion.prototype.toString = function() {
  return "(x: " + this.x + ", y: " + this.y + ", z: " + this.z + ", w: " + this.w + ")";
};

readonly(_Quaternion, "identity", new _Quaternion(0, 0, 0, 1));
readonly(_Quaternion, "zero", new _Quaternion(0, 0, 0, 0));

module.exports = _Quaternion;
