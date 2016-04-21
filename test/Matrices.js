/*
Copyright (c) 2016, Alihan Livdumlu.  All rights reserved.
Copyrights licensed under MIT License. See the accompanying LICENSE file for terms.
*/

var should = require('chai').should();
var math3d = require('../index'),
    Vector3 = math3d.Vector3,
    Matrix4x4 = math3d.Matrix4x4,
    Quaternion = math3d.Quaternion;
var arrEqual = require('../src/util').arraysEqual;

var values = Array(16);
for(var i=0; i<16; i++) values[i] = i;
var increasingMatrix = new Matrix4x4(values);

var values2 = Array(16);
for(var i=0; i<4; i++)
  for(var j=0; j<4; j++)
    values2[4*i + j] = (i + j) * 5;
var fivesMatrix = new Matrix4x4(values2);

describe("Increasing Matrix", function() {
  it("has increasing values", function() {
    increasingMatrix.values.should.equal(values);
    for(var i=0; i<4; i++)
      for(var j=0; j<4; j++)
        increasingMatrix["m" + (i + 1) + (j + 1)].should.equal(values[i*4 + j]);
  });

  it("has size 4x4", function() {
    increasingMatrix.size.rows.should.equal(4);
    increasingMatrix.size.columns.should.equal(4);
  });

  it("has last row [12,13,14,15]", function() {
    arrEqual(increasingMatrix.rows[3], [12,13,14,15]).should.equal(true);
  });

  it("has last column [3,7,11,15]", function() {
    arrEqual(increasingMatrix.columns[3], [3,7,11,15]).should.equal(true);
  });

  it("gives zero matrix when added to its negated version", function() {
    increasingMatrix.add(increasingMatrix.negate()).equals(Matrix4x4.zero).should.equal(true);
  });

  it("gives zero matrix when subtracted from itself", function() {
    increasingMatrix.sub(increasingMatrix).equals(Matrix4x4.zero).should.equal(true);
  });

  it("has the determinant 0", function() {
    increasingMatrix.determinant().should.equal(0);
  });

  it("gives five multiplication table matrix when added to its transpose", function() {
    increasingMatrix.add(increasingMatrix.transpose()).equals(fivesMatrix).should.equal(true);
  });

  it("gives itself when multiplied with scalars 2 and 1/2 respectively", function() {
    increasingMatrix.mulScalar(2).mulScalar(0.5).equals(increasingMatrix).should.equal(true);
  });
});

var scaleMatrix = Matrix4x4.ScaleMatrix(new Vector3(2,2,2));
var flipYMatrix = Matrix4x4.FlipMatrix(false,true,false);

describe("Scale Matrix (2)", function() {
  it("equals the Scale Matrix (Vector3(2,2,2))", function() {
    scaleMatrix.equals(Matrix4x4.ScaleMatrix(2)).should.equal(true);
  });

  it("gives identity matrix when multiplied with its inverse", function() {
    scaleMatrix.mul(scaleMatrix.inverse()).equals(Matrix4x4.identity).should.equal(true);
  });

  it("gives itself when flipped twice", function() {
    scaleMatrix.mul(flipYMatrix).mul(flipYMatrix).equals(scaleMatrix).should.equal(true);
  });
});

var translationVector = new Vector3(1,2,3);
var translationMatrix = Matrix4x4.TranslationMatrix(translationVector);

describe("Translation Matrix (1,2,3)", function() {
  it("translates origin to (1,2,3)", function() {
    translationMatrix.mulVector3(Vector3.zero).equals(translationVector).should.equal(true);
  });

  it("is equal to TRS with identity rotation when multiplied with scale matrix", function() {
    translationMatrix.mul(scaleMatrix).equals(Matrix4x4.TRS(translationVector, Quaternion.identity, 2)).should.equal(true);
  });
});

var localToWorldMatrix = Matrix4x4.LocalToWorldMatrix(Vector3.forward, Quaternion.Euler(0,90,0), 2);

describe("Local to world matrix", function() {
  it("converts Vector(0.5,0,0) to origin", function() {
    localToWorldMatrix.mulVector3(new Vector3(0.5,0,0)).equals(Vector3.zero).should.equal(true);
  });

  it("converts origin to Vector3(0,0,1)", function() {
    localToWorldMatrix.mulVector3(Vector3.zero).equals(new Vector3(0,0,1)).should.equal(true);
  });

  it("converts Vector.forward to Vector3(2,0,1)", function() {
    localToWorldMatrix.mulVector3(Vector3.forward).equals(new Vector3(2,0,1)).should.equal(true);
  });
});

var worldToLocalMatrix = Matrix4x4.WorldToLocalMatrix(Vector3.forward, Quaternion.Euler(0,90,0), 2);

describe("World to local matrix", function() {
  it("converts origin to Vector(0.5,0,0)", function() {
    worldToLocalMatrix.mulVector3(Vector3.zero).equals(new Vector3(0.5,0,0)).should.equal(true);
  });

  it("converts Vector3(0,0,1) to origin", function() {
    worldToLocalMatrix.mulVector3(new Vector3(0,0,1)).equals(Vector3.zero).should.equal(true);
  });

  it("converts Vector3(2,0,1) to Vector.forward", function() {
    worldToLocalMatrix.mulVector3(new Vector3(2,0,1)).equals(Vector3.forward).should.equal(true);
  });
});
