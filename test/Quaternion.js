/*
Copyright (c) 2016, Alihan Livdumlu.  All rights reserved.
Copyrights licensed under MIT License. See the accompanying LICENSE file for terms.
*/

var should = require('chai').should();
var math3d = require('../index'),
    Vector3 = math3d.Vector3,
    Quaternion = math3d.Quaternion;
var dEqual = require('../src/util').doublesEqual;

var easyQuaternion = new Quaternion(0,0,3,4);
var invsqrt2 = 1/Math.sqrt(2);

describe("Quaternion(0,0,3,4)", function(){
  it("equals Quaternion(0,0,0.6,0.8)", function() {
    easyQuaternion.equals(new Quaternion(0,0,0.6,0.8)).should.equal(true);
  });

  it("has x 0", function() {
    easyQuaternion.x.should.equal(0);
  });

  it("has y 0", function() {
    easyQuaternion.y.should.equal(0);
  });

  it("has z 0.6", function() {
    easyQuaternion.z.should.equal(0.6);
  });

  it("has w 0.8", function() {
    easyQuaternion.w.should.equal(0.8);
  });

  it("has conjugate/inverse (0,0,-0.6,0.8)", function() {
    easyQuaternion.conjugate().equals(new Quaternion(0,0,-0.6,0.8)).should.equal(true);
    easyQuaternion.inverse().equals(new Quaternion(0,0,-0.6,0.8)).should.equal(true);
  });

  it("has dot product 0.8 with Quaternion.identity", function() {
    easyQuaternion.dot(Quaternion.identity).should.equal(0.8);
  });

  it("has distance 0 to itself", function() {
    easyQuaternion.distanceTo(easyQuaternion).should.equal(0);
  });

  it("has angle 0 to itself", function() {
    easyQuaternion.angleTo(easyQuaternion).should.equal(0);
  });
});

describe("Quaternion", function() {
  it("equals (x: 1/sqrt(2), y: 0, z: 0, w: 1/sqrt(2)) for euler angles (90,0,0)", function() {
    Quaternion.Euler(90,0,0).equals(new Quaternion(invsqrt2,0,0,invsqrt2)).should.equal(true);
  });

  it("equals (x: 0, y: 1/sqrt(2), z: 0, w: 1/sqrt(2)) for euler angles (0,90,0)", function() {
    Quaternion.Euler(0,90,0).equals(new Quaternion(0,invsqrt2,0,invsqrt2)).should.equal(true);
  });

  it("equals (x: 0, y: 0, z: 1/sqrt(2), w: 1/sqrt(2)) for euler angles (0,0,90)", function() {
    Quaternion.Euler(0,0,90).equals(new Quaternion(0,0,invsqrt2,invsqrt2)).should.equal(true);
  });

  it("moves Vector.right to Vector.up for euler angles (0,0,90)", function() {
    Quaternion.Euler(0,0,90).mulVector3(Vector3.right).equals(Vector3.up).should.equal(true);
  });

  it("moves Vector.right to Vector.up for euler angles (0,90,90)", function() {
    Quaternion.Euler(0,90,90).mulVector3(Vector3.right).equals(Vector3.up).should.equal(true);
  });

  it("moves Vector.right to Vector.forward for euler angles (90,0,90)", function() {
    Quaternion.Euler(90,0,90).mulVector3(Vector3.right).equals(Vector3.forward).should.equal(true);
  });

  it("does not move Vector.right for euler angles (90,0,90)", function() {
    Quaternion.Euler(90,90,90).mulVector3(Vector3.right).equals(Vector3.right).should.equal(true);
  });

  it("equals euler angles (0,90,0) for angle 90 around axis (0,1,0)", function() {
    Quaternion.AngleAxis(Vector3.up, 90).equals(Quaternion.Euler(0,90,0)).should.equal(true);
  });

  it("returns the same angle axis representation as created from 90 degrees around Vector.up", function() {
    var angleAxis = Quaternion.AngleAxis(Vector3.up, 90).angleAxis;
    angleAxis.axis.equals(Vector3.up).should.equal(true);
    angleAxis.angle.should.equal(90);
  });
});

describe("Euler angles", function() {
  it("equals (90,0,0) for Quaternion(1/sqrt(2),0,0,1/sqrt(2))", function() {
    var eulerAngles = (new Quaternion(invsqrt2,0,0,invsqrt2)).eulerAngles;
    dEqual(eulerAngles.x,90).should.equal(true);
    dEqual(eulerAngles.y,0).should.equal(true);
    dEqual(eulerAngles.z,0).should.equal(true);
  });

  it("equals (0,90,0) for Quaternion(0,1/sqrt(2),0,1/sqrt(2))", function() {
    var eulerAngles = (new Quaternion(0,invsqrt2,0,invsqrt2)).eulerAngles;
    dEqual(eulerAngles.x,0).should.equal(true);
    dEqual(eulerAngles.y,90).should.equal(true);
    dEqual(eulerAngles.z,0).should.equal(true);
  });

  it("equals (0,0,90) for Quaternion(0,0,1/sqrt(2),1/sqrt(2))", function() {
    var eulerAngles = (new Quaternion(0,0,invsqrt2,invsqrt2)).eulerAngles;
    dEqual(eulerAngles.x,0).should.equal(true);
    dEqual(eulerAngles.y,0).should.equal(true);
    dEqual(eulerAngles.z,90).should.equal(true);
  });

  it("equals (41, 222, 196) when created from (139,42,16)", function() {
    var eulerAngles = (Quaternion.Euler(139,42,16)).eulerAngles;
    dEqual(eulerAngles.x,41).should.equal(true);
    dEqual(eulerAngles.y,222).should.equal(true);
    dEqual(eulerAngles.z,196).should.equal(true);
  });

  it("equals (90,0,90) when the rotations (0,0,90) and (90,0,0) are applied respectively", function() {
    var q1 = Quaternion.Euler(0,0,90);
    var q2 = Quaternion.Euler(90,0,0);
    var mul = q2.mul(q1);
    mul.equals(Quaternion.Euler(90,0,90)).should.equal(true);
  });

  it("equals (0,40,30) when the rotations (0,0,30) and (0,40,0) are applied respectively", function() {
    var q1 = Quaternion.Euler(0,0,30);
    var q2 = Quaternion.Euler(0,40,0);
    var mul = q2.mul(q1);
    mul.equals(Quaternion.Euler(0,40,30)).should.equal(true);
  });

  var q = Quaternion.Euler(90,0,0);
  it("has distance 1 to its inverse for (90,0,0)", function() {
    q.distanceTo(q.inverse()).should.equal(1);
  });

  it("has angle 180 to its inverse for (90,0,0)", function() {
    q.angleTo(q.inverse()).should.equal(180);
  });
});
