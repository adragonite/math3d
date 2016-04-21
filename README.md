#math3d

> Vectors, Matrices and Quaternions for Node.js

**Table Of Contents:**

* [Features](#features)
* [Installation](#installation)
* [API](#api)
  - [About Classes](#about-classes)
  - [Coordinate System](#coordinate-system)
  - [Vector3](#vector3)
    - [Static variables](#vector3-static-variables)
    - [Variables](#vector3-variables)
    - [Constructors](#vector3-constructors)
    - [Public functions](#vector3-public-functions)
  - [Vector4](#vector4)
    - [Static variables](#vector4-static-variables)
    - [Variables](#vector4-variables)
    - [Constructors](#vector4-constructors)
    - [Public functions](#vector4-public-functions)
  - [Quaternion](#quaternion)
    - [Static variables](#quaternion-static-variables)
    - [Variables](#quaternion-variables)
    - [Constructors](#quaternion-constructors)
    - [Public functions](#quaternion-public-functions)
  - [Matrix4x4](#matrix4x4)
    - [Static variables](#matrix4x4-static-variables)
    - [Variables](#matrix4x4-variables)
    - [Constructors](#matrix4x4-constructors)
    - [Public functions](#matrix4x4-public-functions)
  - [Transform](#transform)
    - [Static variables](#transform-static-variables)
    - [Variables](#transform-variables)
    - [Constructors](#transform-constructors)
    - [Public functions](#transform-public-functions)

## Features

* Only the necessary classes and functions for 3D graphics.
* Easily adaptable to Unity3D.
  - Same coordinate system
  - Same rotation order
  - Similar syntax

## Installation

With [npm](https://npmjs.org/):

```bash
npm install math3d
```

## API

### About Classes

All classes except [Transform](#transform) provide [immutable objects](https://en.wikipedia.org/wiki/Immutable_object).

### Coordinate System

As I used this project later on with Unity3D, I tried to keep everything as similar as possible.
The coordinate system is the same as in Unity: y-Axis up, x-Axis right, z-Axis forward.
The rotation order for Euler angles (used in [Quaternion](#quaternion)) is z then x then y.

### Vector3

A three-dimensional vector with x, y, z values; used for positions, directions or scales in 3D space.

```javascript
var Vector3 = math3d.Vector3;

var v1 = new Vector3(42, 42, 42);
v1.add(Vector3.up); // Vector3(42, 43, 42);
```

#### Static variables

* back:         Shorthand for writing Vector3(0, 0, -1).
* down:         Shorthand for writing Vector3(0, -1, 0).
* forward:      Shorthand for writing Vector3(0, 0, 1).
* left:         Shorthand for writing Vector3(-1, 0, 0).
* one:          Shorthand for writing Vector3(1, 1, -1).
* right:        Shorthand for writing Vector3(1, 0, 0).
* up:           Shorthand for writing Vector3(0, 1, 0).
* zero:         Shorthand for writing Vector3(0, 0, 0).
* dimension:    Always 3 for Vector3

#### Variables

* homogeneous:  Returns the homogeneous Vector4 with w value 1 (readonly)
* magnitude:    Magnitude (length) of the vector (readonly)
* values:       An array containing the x, y, z values (readonly)
* vector4:      Returns the responding Vector4 with w value 0 (readonly)
* x:            x component of the vector (readonly)
* y:            y component of the vector (readonly)
* z:            z component of the vector (readonly)

#### Constructors

* Vector3([x: Number], [y: Number], [z: Number])
  - Creates a Vector3 from the given x, y, z components
  - All parameters are optional with default value 0
* Vector3.FromVector4(vector4)
  - Creates a Vector3 from a Vector4 by clipping the w value

#### Public functions

* add(vector3: Vector3) -> Vector3
  - Returns the sum of two vectors
* average(vector3: Vector3) -> Vector3
  - Returns the average of two vectors
* cross(vector3: Vector3) -> Vector3
  - Cross product of two vectors
* distanceTo(vector3: Vector3) -> Number
  - Distance from one vector to another
* dot(vector3: Vector3) -> Number
  - Dot product of two vectors
* equals(vector3: Vector3) -> Boolean
  - Returns true if two vectors are equal
* mulScalar(scalar: Number) -> Vector3
  - Multiplies the vector with a scalar
* negate() -> Vector3
  - Returns a vector with the opposite direction (multiplied by -1)
* normalize() -> Vector3
  - Returns a normalized vector
* scale(vector3: Vector3) -> Vector3
  - Scales the vector component by component with the given vector
* sub(vector3: Vector3) -> Vector3
  - Subtracts one vector from another (this - vector3)
* toString() -> String
  - A string responding to the vector in form (x,y,z)

### Vector4

A four-dimensional vector with x, y, z, w values.
Used mostly for [homogeneous coordinates](https://en.wikipedia.org/wiki/Homogeneous_coordinates).

```javascript
var Vector3 = math3d.Vector3;
var Vector4 = math3d.Vector4;

var v1 = new Vector4(42, 42);     // v1 = Vector4(42, 42, 0, 1)
var v2 = Vector3.fromVector4(v1); // v2 = Vector3(42, 42, 0)
var v3 = v2.vector4;              // v3 = Vector4(42, 42, 0, 0)
var v4 = v2.homogeneous;          // v4 = Vector4(42, 42, 0, 1)
v4.sub(v3).equals(new Vector4())  // false
```

#### Static variables

* one:          Shorthand for writing Vector4(1, 1, 1, 1).
* zero:         Shorthand for writing Vector4(0, 0, 0, 0).
* dimension:    Always 4 for Vector4

#### Variables

* magnitude:    Magnitude (length) of the vector (readonly)
* values:       An array containing the x, y, z, w values (readonly)
* x:            x component of the vector (readonly)
* y:            y component of the vector (readonly)
* z:            z component of the vector (readonly)
* w:            w component of the vector (readonly)

#### Constructors

* Vector4([x: Number], [y: Number], [z: Number], [w: Number])
  - Creates a Vector4 from the given x, y, z, w components
  - All parameters are optional with default value 0

#### Public functions

* add(vector4: Vector4) -> Vector4
  - Returns the sum of two vectors
* distanceTo(vector4: Vector4) -> Number
  - Distance from one vector to another
* dot(vector4: Vector4) -> Number
  - Dot product of two vectors
* equals(vector4: Vector4) -> Boolean
  - Returns true if two vectors are equal
* mulScalar(scalar: Number) -> Vector4
  - Multiplies the vector with a scalar
* negate() -> Vector4
  - Returns a vector with the opposite direction (multiplied by -1)
* normalize() -> Vector3
  - Returns a normalized vector
* sub(vector4: Vector4) -> Vector3
  - Subtracts one vector from another (this - vector4)
* toString() -> String
  - A string responding to the vector in form (x,y,z,w)

### Quaternion

Each [quaternion](https://en.wikipedia.org/wiki/Quaternion) is composed of a vector (xyz) and a scalar rotation (w).
Although their values are not very intuitive, they are used instead of the Euler angles to:
  - avoid Gimbal lock
  - avoid different rotation orders for Euler angles
  - avoid multiple representation of the same rotation

It is advised not to use the x, y, z, w values directly, unless you really know what you are doing.

```javascript
var Vector3 = math3d.Vector3;

var v1 = Vector3.forward;         // v1 = Vector3(0, 0, 1)
var q1 = Quaternion.Euler(0, 90, 0);
q1.mulVector3(v1);                // (0, 0, -1) <- v1 rotated 90 degrees in y-Axis
q1.angleAxis;                     // {axis: Vector3(0, 1, 0), angle: 90}
```

#### Static variables

* identity:     Shorthand for writing Quaternion(0, 0, 0, 1).
* zero:         Shorthand for writing Quaternion(0, 0, 0, 0).

#### Variables

* angleAxis:    Angle Axis representation of the quaternion in form {axis: (Vector3), angle: Number} (readonly)
* eulerAngles:  Euler angles responding to the quaternion in form {x: Number, y: Number, z: Number} (readonly)
* x:            x component of the quaternion (readonly)
* y:            y component of the quaternion (readonly)
* z:            z component of the quaternion (readonly)
* w:            w component of the quaternion (readonly)

#### Constructors

* Quaternion([x: Number], [y: Number], [z: Number], [w: Number])
  - Creates a quaternion from the given x, y, z, w values
  - All values are optional with default value 0 for x, y, z and 1 for w
* Quaternion.Euler(x: Number, y: Number, z: Number)
  - Creates a quaternion that is rotated /z/ degrees around z-axis, /x/ degrees around x-axis and /y/ degrees around y-axis, in that exact order
* Quaternion.AngleAxis(axis: Vector3, angle: Number)
  - Creates a quaternion that responds to a rotation of /angle/ degrees around /axis/

#### Public functions

* angleTo(quaternion: Quaternion) -> Number
  - Angle between two quaternions in degrees (0 - 180)
* conjugate() -> Quaternion
  - Returns the conjugate of the quaternion (defined as (-x, -y, -z, w))
* distanceTo(quaternion: Quaternion) -> Number
  - A notion to measure the similarity between two quaternions (quick)
  - The return value varies between 0 and 1. Same quaternions return 0.
* dot(quaternion: Quaternion) -> Number
  - Dot (inner) product of two quaternions
* equals(quaternion: Quaternion) -> Boolean
  - Returns true if two quaternions are equal
* inverse() -> Quaternion
  - Returns the inverse of the quaternion (inverse = conjugate)
* mul(quaternion: Quaternion) -> Quaternion
  - Right multiplies the quaternion in the argument (this * quaternion)
* mulVector3(vector3: Vector3) -> Vector3
  - Multiplies the quaternion with the vector (applies rotation)
* toString() -> String
  - A string responding to the quaternion in form (x,y,z,w)

### Matrix4x4

A 4x4 matrix with some required functions for translation, rotation and scaling.

```javascript
var Vector3 = math3d.Vector3;
var Matrix4x4 = math3d.Matrix4x4;

var v1 = new Vector3(3, 4, 5);
var m1 = Matrix4x4.scaleMatrix(v1);   // m1 = |3 0 0 0|
                                      //      |0 4 0 0|
                                      //      |0 0 5 0|
                                      //      |0 0 0 1|
m1.mulVector3(Vector3.up);            // Vector3(0, 4, 0)
```

#### Static variables

* identity:     4x4 identity matrix.
* zero:         Shorthand for writing Matrix4x4([]]).

#### Variables

* columns:      An two-dimensional array containing the columns of a matrix (readonly)
* m11:          first element of first row
* m12:          second element of first row
* m13:          third element of first row
* m14:          fourth element of first row
* m21:          first element of second row
* m22:          second element of second row
* m23:          third element of second row
* m24:          fourth element of second row
* m31:          first element of third row
* m32:          second element of third row
* m33:          third element of third row
* m34:          fourth element of third row
* m41:          first element of fourth row
* m42:          second element of fourth row
* m43:          third element of fourth row
* m44:          fourth element of fourth row
* rows:         An two-dimensional array containing the rows of a matrix (readonly)
* size:         Size (number of rows and columns) of a matrix in form {rows: Number, columns: Number} (readonly)
* values:       A one-dimensional array containing the elements of the matrix (rows first) (readonly)

#### Constructors

* Matrix4x4(data: Array)
  - Creates a 4x4 matrix with the given number array
  - If the length of the array is smaller, the rest is filled with zeros
* Matrix4x4.FlipMatrix(flipX: Boolean, flipY: Boolean, flipZ: Boolean)
  - Creates a matrix that changes the direction of the axii that are chosen to be flipped
* Matrix4x4.ScaleMatrix(scale: Number|Vector3)
  - Creates a scaling matrix with the given scale factor
  - Scale factor can also be given as a number, a uniform vector of it will be created automatically
* Matrix4x4.RotationMatrix(quaternion: Quaternion)
  - Creates a rotation matrix for the given quaternion
* Matrix4x4.TranslationMatrix(translation: Vector3)
  - Creates a translation matrix from the given vector
* Matrix4x4.TRS(translation: Vector3, rotation: Quaternion, scale: Number|Vector3)
  - Creates translation-rotation-scale matrix
* Matrix4x4.LocalToWorldMatrix(position: Vector3, rotation: Quaternion, scale: Number|Vector3)
  - Creates a matrix that transforms from a local space to the world space
  - The local coordinate system is at /position/ with /rotation/ according to the world space
  - /scale/ is defined by (local space scale) / (world space scale)
* Matrix4x4.WorldToLocalMatrix(position: Vector3, rotation: Quaternion, scale: Number|Vector3)
  - Creates a matrix that transforms from world space to a local space
  - The local coordinate system is at /position/ with /rotation/ according to the world space
  - /scale/ is defined by (local space scale) / (world space scale)

#### Public functions

* determinant() -> Number
  - Determinant of the matrix
* inverse() -> Matrix4x4|undefined
  - Inverse of the matrix, undefined if it is not unique
* negate() -> Matrix4x4
  - The negative matrix computed by multiplying the matrix by -1
* transpose() -> Matrix4x4
  - Transpose of the matrix
* add(matrix4x4: Matrix4x4) -> Matrix4x4
  - Returns the sum of two matrices
* sub(matrix4x4: Matrix4x4) -> Matrix4x4
  - Subtracts one matrix from another (this - matrix4x4)
* mul(matrix4x4: Matrix4x4) -> Matrix4x4
  - Right multiplies with the given matrix (this * matrix4x4)
* mulScalar(scalar: Number) -> Matrix4x4
  - Multiplies the matrix with a scalar
* mulVector3(vector3: Vector3) -> Vector3
  - Multiplies the matrix with the given vector
  - Uses the homogeneous vector representation for the multiplication

### Transform

A class to contain the position and the rotation of an object and create an object hierarchy.

```javascript
var Vector3 = math3d.Vector3;
var Quaternion = math3d.Quaternion;
var Transform = math3d.Transform;

var t1 = new Transform(Vector3.zero, Quaternion.Euler(90, 0, 0));
var t2 = new Transform();

t2.parent = t1;
t2.translate(new Vector3(3,4,5));
t2.rotate(15, 20, 90, Transform.Space.World);
```

#### Static variables

* Space:                An enumeration to decide in which coordinate system to operate
  - Self:               Applies transformation relative to the local coordinate system
  - World:              Applies transformation relative to the world coordinate system

#### Variables

* forward:              Forward vector in world coordinate system (readonly)
* localPosition:        Position in local coordinate system
* localRotation:        Rotation in local coordinate system
* localToWorldMatrix:   A matrix to transform points from local space to world space (readonly)
* name:                 Name of the object (default: "object")
* parent:               Parent transform of the object (undefined if none)
* position:             Position in world coordinate system
* right:                Right vector in world coordinate system (readonly)
* root                  The topmost transform in the hierarchy (readonly)
* rotation:             Rotation in world coordinate system
* up:                   Up vector in world coordinate system (readonly)
* worldToLocalMatrix:   A matrix to transform points from world space to local space (readonly)

#### Constructors

* Transform([position: Vector3], [rotation: Quaternion])
  - Creates a transform object at the given position and rotation
  - Parameters are optional with default values Vector3.zero and Quaternion.identity respectively

#### Public functions

* addChild(child: Transform)
  - Adds a child transform
* inverseTransformPosition(position: Vector3) -> Vector3
  - Transforms position from world space to local space
* removeChild(child: Transform)
  - Removes a child transform
* transformPosition(position: Vector3) -> Vector3
  - Transforms position from local space to world space
* translate(translation: Vector3, [relativeTo: Transform.Space]) -> Transform
  - Translates by /translation/ relative to /relativeTo/
  - /relativeTo/ is optional with default value Transform.Space.Self
* rotate(x: Number, y: Number, z: Number, [relativeTo: Transform.Space]) -> Transform
  - Rotates /z/ degrees around z-axis, /x/ degrees around x axis and /y/ degrees around y-axis relative to /relativeTo/ in that exact order
  - /relativeTo/ is optional with default value Transform.Space.Self
