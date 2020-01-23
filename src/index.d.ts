/**
 * @module Rematrix
 */

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
 * Transformation matrices in the browser come in two flavors:
 *
 *  - `matrix` using 6 values (short)
 *  - `matrix3d` using 16 values (long)
 *
 * This utility follows this [conversion guide](https://goo.gl/EJlUQ1)
 * to expand short form matrices to their equivalent long form.
 *
 * @param source A `number[]` with length 6 or 16
 */
export declare function format(source: Matrix): Matrix3D;

/**
 * Converts a CSS Transform to array.
 * @param source A `string` containing a `matrix` or `matrix3d` property value.
 */
export declare function fromString(source: string): Matrix3D;

/**
 * Returns a matrix representing no transformation. The product of any
 * matrix multiplied by the identity matrix will be the original matrix.
 *
 * **Tip:** Similar to how `5 * 1 === 5`, where `1` is the identity.
 */
export declare function identity(): Matrix3D;

/**
 * Returns a matrix representing the inverse transformation of the source
 * matrix. The product of any matrix multiplied by its inverse will be the
 * identity matrix.
 *
 * **Tip:** Similar to how `5 * (1/5) === 1`, where `1/5` is the inverse.
 *
 * @param source A `number[]` with length 6 or 16.
 */
export declare function inverse(source: Matrix): Matrix3D;

/**
 * Returns a matrix representing the combined transformations
 * of both argument matrices.
 *
 * **Note:** Order is important. For example, rotating 45° along the Z‑axis,
 * followed by translating 500 pixels along the Y‑axis...
 * Is not the same as translating 500 pixels along the Y‑axis,
 * followed by rotating 45° along on the Z‑axis.
 *
 * @param matrixA A `number[]` with length 6 or 16.
 * @param matrixB A `number[]` with length 6 or 16.
 */
export declare function multiply(matrixA: Matrix, matrixB: Matrix): Matrix3D;

/**
 * Returns a matrix representing perspective.
 *
 * @param distance A `number` measured in pixels.
 */
export declare function perspective(distance: number): Matrix3D;

/**
 * Returns a matrix representing Z‑axis rotation.
 *
 * **Tip:** This is just an alias for `Rematrix.rotateZ` for parity with CSS.
 *
 * @param angle A `number` measured in degrees.
 */
export declare function rotate(angle: number): Matrix3D;

/**
 * Returns a matrix representing X‑axis rotation.
 *
 * @param angle A `number` measured in degrees.
 */
export declare function rotateX(angle: number): Matrix3D;

/**
 * Returns a matrix representing Y‑axis rotation.
 *
 * @param angle A `number` measured in degrees.
 */
export declare function rotateY(angle: number): Matrix3D;

/**
 * Returns a matrix representing Z‑axis rotation.
 *
 * @param angle A `number` measured in degrees.
 */
export declare function rotateZ(angle: number): Matrix3D;

/**
 * Returns a matrix representing 2D scaling. The first argument
 * is used for both X and Y‑axis scaling, unless an optional
 * second argument is provided to explicitly define Y‑axis scaling.
 *
 * @param scalar A `number` decimal multiplier.
 * @param scalarY A `number` decimal multiplier. (Optional)
 */
export declare function scale(scalar: number, scalarY?: number): Matrix3D;

/**
 * Returns a matrix representing X‑axis scaling.
 *
 * @param scalar A `number` decimal multiplier.
 */
export declare function scaleX(scalar: number): Matrix3D;

/**
 * Returns a matrix representing Y‑axis scaling.
 *
 * @param scalar A `number` decimal multiplier.
 */
export declare function scaleY(scalar: number): Matrix3D;

/**
 * Returns a matrix representing Z‑axis scaling.
 *
 * @param scalar A `number` decimal multiplier.
 */
export declare function scaleZ(scalar: number): Matrix3D;

/**
 * Returns a matrix representing shear. The first argument
 * defines X‑axis shearing, and an optional second argument
 * defines Y‑axis shearing.
 *
 * @param angleX A `number` measured in degrees.
 * @param angleY A `number` measured in degrees. (Optional)
 */
export declare function skew(angleX: number, angleY?: number): Matrix3D;

/**
 * Returns a matrix representing X‑axis shear.
 *
 * @param angle A `number` measured in degrees.
 */
export declare function skewX(angle: number): Matrix3D;

/**
 * Returns a matrix representing Y‑axis shear.
 *
 * @param angle A `number` measured in degrees.
 */
export declare function skewY(angle: number): Matrix3D;

/**
 * Returns a CSS Transform property value equivalent to the source matrix.
 *
 * @param source A `number[]` with length 6 or 16.
 */
export declare function toString(source: Matrix): string;

/**
 * Returns a matrix representing 2D translation. The first
 * argument defines X‑axis translation, and an optional second
 * argument defines Y‑axis translation.
 *
 * @param distanceX A `number` measured in pixels.
 * @param distanceY A `number` measured in pixels. (Optional)
 */
export declare function translate(distanceX: number, distanceY?: number): Matrix3D;

/**
 * Returns a matrix representing 3D translation. The first argument
 * defines X‑axis translation, the second argument defines Y‑axis
 * translation, and the third argument defines Z‑axis translation.
 *
 * @param distanceX A `number` measured in pixels.
 * @param distanceY A `number` measured in pixels.
 * @param distanceZ A `number` measured in pixels.
 */
export declare function translate3d(distanceX: number, distanceY: number, distanceZ: number): Matrix3D;

/**
 * Returns a matrix representing X‑axis translation.
 *
 * @param distance A `number` measured in pixels.
 */
export declare function translateX(distance: number): Matrix3D;

/**
 * Returns a matrix representing Y‑axis translation.
 *
 * @param distance A `number` measured in pixels.
 */
export declare function translateY(distance: number): Matrix3D;

/**
 * Returns a matrix representing Z‑axis translation.
 *
 * @param distance A `number` measured in pixels.
 */
export declare function translateZ(distance: number): Matrix3D;
