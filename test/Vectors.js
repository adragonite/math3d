/*
Copyright (c) 2016, Alihan Livdumlu.  All rights reserved.
Copyrights licensed under MIT License. See the accompanying LICENSE file for terms.
*/

var should = require('chai').should();
var math3d = require('../index'),
    Vector3 = math3d.Vector3,
    Vector4 = math3d.Vector4;

var existenceVector3 = new Vector3(4, 2, 42);
var existenceVector4 = new Vector4(4, 2, 42, 1);

describe("Vector3(4, 2, 42)", function() {
  it("has x 4", function() {
    existenceVector3.x.should.equal(4);
  });

  it("has y 2", function() {
    existenceVector3.y.should.equal(2);
  });

  it("has z 42", function() {
    existenceVector3.z.should.equal(42);
  });

  it("has existenceVector4 as homogeneous vector", function() {
    existenceVector3.homogeneous.equals(existenceVector4).should.equal(true);
  });

  it("has w 0 when Vector4", function() {
    existenceVector3.vector4.w.should.equal(0);
  });

  it("has dimension 3", function() {
    existenceVector3.dimension.should.equal(3);
  });

  it("has the average (2, 1, 21) with the origin", function() {
    existenceVector3.average(Vector3.zero).equals(new Vector3(2,1,21)).should.equal(true);
  });

  it("equals (8, 1, 42) when scaled with (2, 0.5, 1)", function() {
    existenceVector3.scale(new Vector3(2, 0.5, 1)).equals(new Vector3(8,1,42)).should.equal(true);
  });
});

describe("Vector4(4, 2, 42, 1)", function() {
  it("has x 4", function() {
    existenceVector4.x.should.equal(4);
  });

  it("has y 2", function() {
    existenceVector4.y.should.equal(2);
  });

  it("has z 42", function() {
    existenceVector4.z.should.equal(42);
  });

  it("has w 1", function() {
    existenceVector4.w.should.equal(1);
  });

  it("is equal to existenceVector3 as Vector3", function() {
    Vector3.FromVector4(existenceVector4).equals(existenceVector3).should.equal(true);
  });

  it("has dimension 4", function() {
    existenceVector4.dimension.should.equal(4);
  });
});

var easyVector3 = new Vector3(3, 4, 0);
var easyVector4 = new Vector4(0, 0, 4, 3);

describe("Vector3(3, 4, 0)", function() {
  it("has magnitude 5", function() {
    easyVector3.magnitude.should.equal(5);
  });

  it("gives (0.6,0.8,0) when normalized", function() {
    easyVector3.normalize().equals(new Vector3(0.6,0.8,0)).should.equal(true);
  });

  it("gives (-3,-4,0) when negated", function() {
    easyVector3.negate().equals(new Vector3(-3,-4,0)).should.equal(true);
  });

  it("gives (4,5,1) when Vector.one is added", function() {
    easyVector3.add(Vector3.one).equals(new Vector3(4,5,1)).should.equal(true);
  });

  it("gives (2,3,-1) when Vector.one is subtracted", function() {
    easyVector3.sub(Vector3.one).equals(new Vector3(2,3,-1)).should.equal(true);
  });

  it("gives 7 after dot product with Vector.one", function() {
    easyVector3.dot(Vector3.one).should.equal(7);
  });

  it("has distance 5 to origin", function() {
    easyVector3.distanceTo(Vector3.zero).should.equal(5);
  });

  it("gives (4,-3,-1) after cross product with Vector.one", function() {
    easyVector3.cross(Vector3.one).equals(new Vector3(4,-3,-1)).should.equal(true);
  });
});

describe("Vector4(0, 0, 4, 3)", function() {
  it("has magnitude 5", function() {
    easyVector4.magnitude.should.equal(5);
  });

  it("gives (0,0,0.8,0.6) when normalized", function() {
    easyVector4.normalize().equals(new Vector4(0,0,0.8,0.6)).should.equal(true);
  });

  it("gives (0,0,-4,-3) when negated", function() {
    easyVector4.negate().equals(new Vector4(0,0,-4,-3)).should.equal(true);
  });

  it("gives (1,1,5,4) when Vector.one is added", function() {
    easyVector4.add(Vector4.one).equals(new Vector4(1,1,5,4)).should.equal(true);
  });

  it("gives (-1,-1,3,2) when Vector.one is subtracted", function() {
    easyVector4.sub(Vector4.one).equals(new Vector4(-1,-1,3,2)).should.equal(true);
  });

  it("gives 7 after dot product with Vector.one", function() {
    easyVector4.dot(Vector4.one).should.equal(7);
  });

  it("has distance 5 to origin", function() {
    easyVector4.distanceTo(Vector4.zero).should.equal(5);
  });
});
