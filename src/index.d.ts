export declare type Matrix2D = [
  number, number,
  number, number,
  number, number,
];

export declare type Matrix3D = [
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
];

export declare type Matrix = Matrix2D | Matrix3D;

/**
 * ___
 * _Attempts to return a 4x4 matrix describing the CSS transform
 * matrix passed in, but will return the identity matrix as a
 * fallback._
 *
 * @param source A string containing a `matrix` or `matrix3d` CSS Transform value.
 */
export declare function fromString(source: string): Matrix3D;

/**
 * ___
 * _Transformation matrices in the browser come in two flavors:_
 *
 *  - _`matrix` using 6 values (short)_
 *  - _`matrix3d` using 16 values (long)_
 *
 * _This utility follows this [conversion guide](https://goo.gl/EJlUQ1)
 * to expand short form matrices to their equivalent long form._
 *
 * @param source Accepts both short and long form matrices.
 */
export declare function format(source: Matrix): Matrix3D;

/**
 * ___
 * _Creates a matrix representing no transformation. The product of any
 * matrix multiplied by the identity matrix will be the original matrix._
 *
 * _**Tip:** Similar to how `5 * 1 === 5`, where `1` is the identity._
 *
 */
export declare function identity(): Matrix3D;

/**
 * ___
 * _Creates a matrix representing the inverse transformation of the source
 * matrix. The product of any matrix multiplied by its inverse will be the
 * identity matrix._
 *
 * **Tip:** Similar to how `5 * (1/5) === 1`, where `1/5` is the inverse.
 *
 * @param source Accepts both short and long form matrices.
 */
export declare function inverse(source: Matrix): Matrix3D;

/**
 * ___
 * _Creates a matrix representing the combined transformations
 * of both argument matrices._
 *
 * _**Note:** Order is important. For example, rotating 45° along
 * the Z‑axis, followed by translating 500 pixels along the Y‑axis...
 * Is not the same as translating 500 pixels along the Y‑axis,
 * followed by rotating 45° along on the Z‑axis._
 *
 * @param m Accepts both short and long form matrices.
 * @param x Accepts both short and long form matrices.
 */
export declare function multiply(m: Matrix, x: Matrix): Matrix3D;

/**
 * ___
 * _Creates a matrix representing perspective._
 *
 * @param distance Measured in pixels.
 */
export declare function perspective(distance: number): Matrix3D;

/**
 * ___
 * _Creates a matrix representing Z‑axis rotation._
 *
 * _**Tip:** This is just an alias for `Rematrix.rotateZ` for parity with CSS._
 *
 * @param angle Measured in degrees.
 */
export declare function rotate(angle: number): Matrix3D;

/**
 * ___
 * _Creates a matrix representing X‑axis rotation._
 *
 * @param angle Measured in degrees.
 */
export declare function rotateX(angle: number): Matrix3D;

/**
 * ___
 * _Creates a matrix representing Y‑axis rotation._
 *
 * @param angle Measured in degrees.
 */
export declare function rotateY(angle: number): Matrix3D;

/**
 * ___
 * _Creates a matrix representing Z‑axis rotation._
 *
 * @param angle Measured in degrees.
 */
export declare function rotateZ(angle: number): Matrix3D;

/**
 * ___
 * _Creates a matrix representing 2D scaling. The first argument
 * is used for both X and Y‑axis scaling, unless an optional
 * second argument is provided to explicitly define Y‑axis scaling._
 *
 * @param scalar Decimal multiplier.
 * @param scalarY Decimal multiplier. (Optional)
 */
export declare function scale(scalar: number, scalarY?: number): Matrix3D;

/**
 * ___
 * _Creates a matrix representing X‑axis scaling._
 *
 * @param scalar Decimal multiplier.
 */
export declare function scaleX(scalar: number): Matrix3D;

/**
 * ___
 * _Creates a matrix representing Y‑axis scaling._
 *
 * @param scalar Decimal multiplier.
 */
export declare function scaleY(scalar: number): Matrix3D;

/**
 * ___
 * _Creates a matrix representing Z‑axis scaling._
 *
 * @param scalar Decimal multiplier.
 */
export declare function scaleZ(scalar: number): Matrix3D;

/**
 * ___
 * _Creates a matrix representing shear. The first argument
 * defines X‑axis shearing, and an optional second argument
 * defines Y‑axis shearing._
 *
 * @param angleX Measured in degrees.
 * @param [angleY] Measured in degrees. (Optional)
 */
export declare function skew(angleX: number, angleY?: number): Matrix3D;

/**
 * ___
 * _Creates a matrix representing X‑axis shear._
 *
 * @param angle Measured in degrees.
 */
export declare function skewX(angle: number): Matrix3D;

/**
 * ___
 * _Creates a matrix representing Y‑axis shear._
 *
 * @param angle Measured in degrees
 */
export declare function skewY(angle: number): Matrix3D;

/**
 * ___
 * _Returns a CSS Transform property value equivalent to the source matrix._
 *
 * @param source Accepts both short and long form matrices.
 */
export declare function toString(source: Matrix): string;

/**
 * ___
 * _Creates a matrix representing 2D translation. The first
 * argument defines X‑axis translation, and an optional second
 * argument defines Y‑axis translation._
 *
 * @param distanceX Measured in pixels.
 * @param distanceY Measured in pixels. (Optional)
 */
export declare function translate(distanceX: number, distanceY: number): Matrix3D;

/**
 * ___
 * _Creates a matrix representing 3D translation. The first argument
 * defines X‑axis translation, the second argument defines Y‑axis
 * translation, and the third argument defines Z‑axis translation._
 *
 * @param distanceX Measured in pixels.
 * @param distanceY Measured in pixels.
 * @param distanceZ Measured in pixels.
 */
export declare function translate3d(distanceX: number, distanceY: number, distanceZ: number): Matrix3D;

/**
 * ___
 * _Creates a matrix representing X‑axis translation._
 *
 * @param distance Measured in pixels.
 */
export declare function translateX(distance: number): Matrix3D;

/**
 * ___
 * _Creates a matrix representing Y‑axis translation._
 *
 * @param distance Measured in pixels.
 */
export declare function translateY(distance: number): Matrix3D;

/**
 * ___
 * _Creates a matrix representing Z‑axis translation._
 *
 * @param distance Measured in pixels.
 */
export declare function translateZ(distance: number): Matrix3D;
