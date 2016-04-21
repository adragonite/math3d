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
    transform.translate(Vector3.left, Transform.Space.World).position.equals(Vector3.zero).should.equal(true);
    transform.translate(Vector3.right, Transform.Space.World).position.equals(Vector3.right).should.equal(true);
  });

  it("transforms local position (1,0,0) to world position (1,1,0)", function() {
    transform.transformPosition(Vector3.right).equals(new Vector3(1,1,0)).should.equal(true);
  });

  it("transforms world position (1,1,0) to local position (1,0,0)", function() {
    transform.inverseTransformPosition(new Vector3(1,1,0)).equals(Vector3.right).should.equal(true);
  });
});

var parent2 = new Transform(new Vector3(-2, 1, -3), Quaternion.Euler(40, 20, 30));
parent2.name = "p2";

var parent1 = new Transform();
parent1.parent = parent2;
parent1.localPosition = new Vector3(2, 1, 0);
parent1.localRotation = Quaternion.Euler(20, 30, 50);
parent1.name = "p";

var obj = new Transform();
parent1.addChild(obj);
obj.localPosition = new Vector3(1, 2, 3);
obj.localRotation = Quaternion.Euler(10, 13, 22);

describe("obj", function() {
  it("has parent p", function() {
    obj.parent.name.should.equal("p");
  });

  it("has root p2", function() {
    obj.root.name.should.equal("p2");
  });

  it("has position  (1.1, 1.2, 0.9)", function() {
    obj.position.equals(new Vector3(1.146029173002391, 1.1612995779271673, 0.852409892798367)).should.equal(true);
  });

  it("has rotation (0.6, 0.1, 0,7, 0.4)", function() {
    obj.rotation.equals(new Quaternion(
      0.5805599829705723,
      0.1348546097348447,
      0.6675263170899776,
      0.44628797474137977)).should.equal(true);
  })
});
