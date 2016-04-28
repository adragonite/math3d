/*
Copyright (c) 2016, Alihan Livdumlu.  All rights reserved.
Copyrights licensed under MIT License. See the accompanying LICENSE file for terms.
*/

var Vector3 = require('./Vector3');
var Quaternion = require('./Quaternion');
var Matrix4x4 = require('./Matrix4x4');
var readonly = require('./readonlyProperty');
var util = require('./util');

/**
 * Sets the local position of the transform according to the world position
 *
 * @param {Transform} transform
 */
function _getLocalPositionFromWorldPosition(transform) {
  if (transform.parent === undefined)
    return transform.position;
  else
    return transform.parent.rotation.inverse().mulVector3(transform.position.sub(transform.parent.position));
}

/**
 * Sets the world position of the transform according to the local position
 *
 * @param {Transform} transform
 */
function _getWorldPositionFromLocalPosition(transform) {
  if (transform.parent === undefined)
    return transform.localPosition;
  else
    return transform.parent.position.add(transform.parent.rotation.mulVector3(transform.localPosition));
}

/**
 * Sets the local rotation of the transform according to the world rotation
 *
 * @param {Transform} transform
 */
function _getLocalRotationFromWorldRotation(transform) {
  if(transform.parent === undefined)
    return transform.rotation;
  else
    return transform.parent.rotation.inverse().mul(transform.rotation);
}

/**
 * Sets the world rotation of the transform according to the local rotation
 *
 * @param {Transform} transform
 */
function _getWorldRotationFromLocalRotation(transform) {
  if(transform.parent === undefined)
    return transform.localRotation;
  else
    return transform.parent.rotation.mul(transform.localRotation);
}

/**
 * Adjusts position and rotation of the given children array
 *
 * @param {Array} children
 */
function _adjustChildren(children) {
  children.forEach(function (child) {
    child.rotation = _getWorldRotationFromLocalRotation(child);
    child.position = _getWorldPositionFromLocalPosition(child);
  });
}

/**
 * Returns the forward vector of the transform
 *
 * @param {Transform} transform
 * @returns {Vector3} forward vector
 */
function _getForward(transform) {
  return function() {
    return transform.rotation.mulVector3(Vector3.forward);
  }
}

/**
 * Returns the right vector of the transform
 *
 * @param {Transform} transform
 * @returns {Vector3} right vector
 */
function _getRight(transform) {
  return function() {
    return transform.rotation.mulVector3(Vector3.right);
  }
}

/**
 * Returns the up vector of the transform
 *
 * @param {Transform} transform
 * @returns {Vector3} up vector
 */
function _getUp(transform) {
  return function() {
    return transform.rotation.mulVector3(Vector3.up);
  }
}

/**
 * Returns a matrix that transforms a point from local space to world space
 *
 * @param {Transform} transform
 * @returns {Matrix4x4} local to world matrix
 */
function _getLocalToWorldMatrix(transform) {
  return function() {
    return Matrix4x4.LocalToWorldMatrix(transform.position, transform.rotation, Vector3.one);
  }
}

/**
 * Returns a matrix that transforms a point from world space to local space
 *
 * @param {Transform} transform
 * @returns {Matrix4x4} local to world matrix
 */
function _getWorldtoLocalMatrix(transform) {
  return function() {
    return Matrix4x4.WorldToLocalMatrix(transform.position, transform.rotation, Vector3.one);
  }
}

/**
 * Returns the topmost transform in the hierarchy
 *
 * @param {Transform} transform
 * @returns {Transform} root transform
 */
function _getRoot(transform) {
  return function() {
    var parent = transform.parent;
    return parent === undefined ? transform : parent.root;
  }
}

/**
 * @class
 * Stores the position and the rotation of an object
 *
 * @param {Vector3} [position]
 * @param {Quaternion} [rotation]
 */
function _Transform(position, rotation) {
  var _position = new Vector3();
  var _rotation = Quaternion.identity;
  var _localPosition = _position;
  var _localRotation = _rotation;
  var _parent = undefined;
  var _children = [];
  this.name = "object";

  if(position && (position instanceof Vector3)) {
    _position = position;
    _localPosition = position;
  }
  if(rotation && (rotation instanceof Quaternion)) {
    _rotation = rotation;
    _localRotation = rotation;
  }

  /**
   * Position of the object in world coordinate system
   */
  Object.defineProperty(this, "position", {
    get: function() { return _position; },
    set: function(val) {
      if(val instanceof Vector3) {
        _position = val;
        _localPosition = _getLocalPositionFromWorldPosition(this);
        _adjustChildren(_children);
      }
    }
  });

  /**
   * Rotation of the object in world coordinate system
   */
  Object.defineProperty(this, "rotation", {
    get: function() { return _rotation; },
    set: function(val) {
      if(val instanceof Quaternion) {
        _rotation = val;
        _localRotation = _getLocalRotationFromWorldRotation(this);
        _adjustChildren(_children);
      }
    }
  });

  /**
   * Position of the object in local coordinate system
   */
  Object.defineProperty(this, "localPosition", {
    get: function() { return _localPosition; },
    set: function(val) {
      if(val instanceof Vector3) {
        _localPosition = val;
        _position = _getWorldPositionFromLocalPosition(this);
      }
    }
  });

  /**
   * Rotation of the object in local coordinate system
   */
  Object.defineProperty(this, "localRotation", {
    get: function() { return _localRotation; },
    set: function(val) {
      if(val instanceof Quaternion) {
        _localRotation = val;
        _rotation = _getWorldRotationFromLocalRotation(this);
      }
    }
  });

  /**
   * Parent transform
   * Set to undefined if there is none
   */
  Object.defineProperty(this, "parent", {
    get: function() { return _parent; },
    set: function(val) {
      if(val instanceof _Transform) {
        _parent = val;
        _localRotation = _getLocalRotationFromWorldRotation(this);
        _localPosition = _getLocalPositionFromWorldPosition(this);
        _parent.addChild(this);
      } else if(val === undefined) {
        var temp = _parent;
        _parent = undefined;
        _localRotation = _rotation;
        _localPosition = _position;
        temp.removeChild(this);
      }
    }
  });

  readonly(this, "forward", _getForward(this));
  readonly(this, "right", _getRight(this));
  readonly(this, "up", _getUp(this));
  readonly(this, "localToWorldMatrix", _getLocalToWorldMatrix(this));
  readonly(this, "worldToLocalMatrix", _getWorldtoLocalMatrix(this));
  readonly(this, "root", _getRoot(this));

  /**
   * Adds a new child transform
   *
   * @param {Transform} transform
   */
  this.addChild = function(child) {
    if(!(child instanceof _Transform))
      throw new TypeError("Child must be a Transform.")

    if(child.parent !== this)
      child.parent = this;

    _children.push(child);
  }

  /**
   * Removes a previously added child transform
   *
   * @param {Transform} transform
   */
  this.removeChild = function(child) {
    if(!(child instanceof _Transform))
      throw new TypeError("Child must be a Transform.")

    if(child.parent === this)
      child.parent = undefined;

    var index = _children.indexOf(child);

    if(index != -1)
      _children.splice(index, 1);
  }
}

/**
 * Translates the object with the given translation vector
 *
 * @param {Vector3} translation
 * @param {Transform.Space} relativeTo: default value .Self
 * @returns {Transform} given transform
 */
_Transform.prototype.translate = function(translation, relativeTo) {
  if(!(translation instanceof Vector3))
    throw new TypeError("/translation/ should be a Vector3.");
  if(!relativeTo)
    relativeTo = _Transform.Space.Self;

  if (relativeTo === _Transform.Space.World) {
    this.position = this.position.add(translation);
    this.localPosition = _getLocalPositionFromWorldPosition(this);
  } else {
    if(this.parent === undefined) {
      this.position = this.position.add(this.rotation.mulVector3(translation));
      this.localPosition = this.position;
    } else {
      this.localPosition = this.localPosition.add(this.localRotation.mulVector3(translation));
      this.location = _getWorldPositionFromLocalPosition(this);
    }
  }
  return this;
};

/**
 * Rotates the object with the given euler angles
 *
 * @param {Number} x, y, z
 * @param {Transform.Space} relativeTo: default value .Self
 * @returns {Transform} given transform
 */
_Transform.prototype.rotate = function(x, y, z, relativeTo) {
  if(!util.isNumber(x) || !util.isNumber(y), !util.isNumber(z))
    throw new TypeError("Euler angles should be a numbers.");
  if(!relativeTo)
    relativeTo = _Transform.Space.Self;

  if(relativeTo === _Transform.Space.World) {
    this.rotation = Quaternion.Euler(x, y, z).mul(this.rotation);
    this.localRotation = _getLocalRotationFromWorldRotation(this);
  }
  else {
    if(this.parent === undefined) {
      this.rotation = this.rotation.mul(Quaternion.Euler(x, y, z));
      this.localRotation = this.rotation;
    } else {
      this.localRotation = this.localRotation.mul(Quaternion.Euler(x, y, z));
      this.rotation = _getWorldRotationFromLocalRotation(this);
    }
  }
  return this;
};

/**
 * Transforms position from local space to world space
 *
 * @param {Vector3} position
 * @returns {Vector3} position in world space
 */
_Transform.prototype.transformPosition = function(position) {
  if(!(position instanceof Vector3))
    throw new TypeError("/position/ must be a vector.");

  return this.localToWorldMatrix.mulVector3(position);
};

/**
 * Transforms position from world space to local space
 *
 * @param {Vector3} position
 * @returns {Vector3} position in local space
 */
_Transform.prototype.inverseTransformPosition = function(position) {
  if(!(position instanceof Vector3))
    throw new TypeError("/position/ must be a vector.");

  return this.worldToLocalMatrix.mulVector3(position);
};

// The coordinate system in which to operate
_Transform.Space = {};
readonly(_Transform.Space, "Self", 0);    // Applies transformation relative to the local coordinate system
readonly(_Transform.Space, "World", 1);   // Applies transformation relative to the world coordinate system

module.exports = _Transform;
