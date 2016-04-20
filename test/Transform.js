/*
Copyright (c) 2016, Alihan Livdumlu.  All rights reserved.
Copyrights licensed under MIT License. See the accompanying LICENSE file for terms.
*/

var should = require('chai').should();
var math3d = require('../index'),
    Vector3 = math3d.Vector3,
    Matrix4x4 = math3d.Matrix4x4,
    Quaternion = math3d.Quaternion,
    Transform = math3d.Transform;
var arrEqual = require('../src/util').arraysEqual;

var transform = new Transform(Vector3.right, Quaternion.Euler(0,0,90));

describe("Transform with Vector.right, Euler(0,0,90)", function() {
  it("has position Vector.right", function() {
    transform.position.equals(Vector3.right).should.equal(true);
  });

  it("has rotation with euler angles (0,0,90)", function() {
    transform.rotation.equals(Quaternion.Euler(0,0,90)).should.equal(true);
  });

  it("has forward vector Vector.forward", function() {
    transform.forward.equals(Vector3.forward).should.equal(true);
  });

  it("has right vector Vector.up", function() {
    transform.right.equals(Vector3.up).should.equal(true);
  });

  it("has up vector Vector.left", function() {
    transform.up.equals(Vector3.left).should.equal(true);
  });

  it("has position (0,0,0) when moved one unit to the left in world space", function() {
    transform.translate(Vector3.left, Transform.Space.World).position.equals(Vector3.zero);
    transform.translate(Vector3.right, Transform.Space.World).position.equals(Vector3.right).should.equal(true);
  });
});
