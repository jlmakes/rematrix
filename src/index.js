/**
 * @module Rematrix
 */

/**
* Transformation matrices in the browser come in two flavors:
*
*  - `matrix` using 6 values (short)
*  - `matrix3d` using 16 values (long)
*
* This utility follows this [conversion guide](https://goo.gl/EJlUQ1)
* to expand short form matrices to their equivalent long form.
*
* @param  {array} source - Accepts both short and long form matrices.
* @return {array}
*/
export function format (source) {
	if (source.constructor !== Array) {
		throw new TypeError('Expected array.')
	}
	if (source.length === 16) {
		return source
	}
	if (source.length === 6) {
		const matrix = identity()
		matrix[0] = source[0]
		matrix[1] = source[1]
		matrix[4] = source[2]
		matrix[5] = source[3]
		matrix[12] = source[4]
		matrix[13] = source[5]
		return matrix
	}
	throw new RangeError('Expected array with either 6 or 16 values.')
}


/**
 * Returns a matrix representing no transformation. The product of any matrix
 * multiplied by the identity matrix will be the original matrix.
 *
 * > **Tip:** Similar to how `5 * 1 === 5`, where `1` is the identity.
 *
 * @return {array}
 */
export function identity () {
	const matrix = []
	for (let i = 0; i < 16; i++) {
		i % 5 == 0 ? matrix.push(1) : matrix.push(0)
	}
	return matrix
}


/**
 * Returns a matrix describing the inverse transformation of the source
 * matrix. The product of any matrix multiplied by its inverse will be the
 * identity matrix.
 *
 * > **Tip:** Similar to how `5 * (1/5) === 1`, where `1/5` is the inverse.
 *
 * @param  {array} source - Accepts both short and long form matrices.
 * @return {array}
 */
export function inverse (source) {
	const m = format(source)

	const s0 = m[0] * m[5] - m[4] * m[1]
	const s1 = m[0] * m[6] - m[4] * m[2]
	const s2 = m[0] * m[7] - m[4] * m[3]
	const s3 = m[1] * m[6] - m[5] * m[2]
	const s4 = m[1] * m[7] - m[5] * m[3]
	const s5 = m[2] * m[7] - m[6] * m[3]

	const c5 = m[10] * m[15] - m[14] * m[11]
	const c4 = m[9] * m[15] - m[13] * m[11]
	const c3 = m[9] * m[14] - m[13] * m[10]
	const c2 = m[8] * m[15] - m[12] * m[11]
	const c1 = m[8] * m[14] - m[12] * m[10]
	const c0 = m[8] * m[13] - m[12] * m[9]

	const determinant = 1 / (s0 * c5 - s1 * c4 + s2 * c3 + s3 * c2 - s4 * c1 + s5 * c0)

	if (isNaN(determinant) || determinant === Infinity) {
		throw new Error('Inverse determinant attempted to divide by zero.')
	}

	return [
		(m[5] * c5 - m[6] * c4 + m[7] * c3) * determinant,
		(-m[1] * c5 + m[2] * c4 - m[3] * c3) * determinant,
		(m[13] * s5 - m[14] * s4 + m[15] * s3) * determinant,
		(-m[9] * s5 + m[10] * s4 - m[11] * s3) * determinant,

		(-m[4] * c5 + m[6] * c2 - m[7] * c1) * determinant,
		(m[0] * c5 - m[2] * c2 + m[3] * c1) * determinant,
		(-m[12] * s5 + m[14] * s2 - m[15] * s1) * determinant,
		(m[8] * s5 - m[10] * s2 + m[11] * s1) * determinant,

		(m[4] * c4 - m[5] * c2 + m[7] * c0) * determinant,
		(-m[0] * c4 + m[1] * c2 - m[3] * c0) * determinant,
		(m[12] * s4 - m[13] * s2 + m[15] * s0) * determinant,
		(-m[8] * s4 + m[9] * s2 - m[11] * s0) * determinant,

		(-m[4] * c3 + m[5] * c1 - m[6] * c0) * determinant,
		(m[0] * c3 - m[1] * c1 + m[2] * c0) * determinant,
		(-m[12] * s3 + m[13] * s1 - m[14] * s0) * determinant,
		(m[8] * s3 - m[9] * s1 + m[10] * s0) * determinant,
	]
}


/**
 * Returns a 4x4 matrix describing the combined transformations
 * of both arguments.
 *
 * > **Note:** Order is very important. For example, rotating 45°
 * along the Z-axis, followed by translating 500 pixels along the
 * Y-axis... is not the same as translating 500 pixels along the
 * Y-axis, followed by rotating 45° along on the Z-axis.
 *
 * @param  {array} m - Accepts both short and long form matrices.
 * @param  {array} x - Accepts both short and long form matrices.
 * @return {array}
 */
export function multiply (m, x) {
	const fm = format(m)
	const fx = format(x)
	const product = []

	for (let i = 0; i < 4; i++) {
		const row = [fm[i], fm[i + 4], fm[i + 8], fm[i + 12]]
		for (let j = 0; j < 4; j++) {
			const k = j * 4
			const col = [fx[k], fx[k + 1], fx[k + 2], fx[k + 3]]
			const result = row[0] * col[0] + row[1] * col[1] + row[2] * col[2] + row[3] * col[3]

			product[i + k] = result
		}
	}

	return product
}


/**
 * Attempts to return a 4x4 matrix describing the CSS transform
 * matrix passed in, but will return the identity matrix as a
 * fallback.
 *
 * **Tip:** In virtually all cases, this method is used to convert
 * a CSS matrix (retrieved as a `string` from computed styles) to
 * its equivalent array format.
 *
 * @param  {string} source - String containing a valid CSS `matrix` or `matrix3d` property.
 * @return {array}
 */
export function parse (source) {
	if (typeof source === 'string') {
		const match = source.match(/matrix(3d)?\(([^)]+)\)/)
		if (match) {
			const raw = match[2].split(', ').map(value => parseFloat(value))
			return format(raw)
		}
	}
	return identity()
}


/**
 * Returns a 4x4 matrix describing X-axis rotation.
 *
 * @param  {number} angle - Measured in degrees.
 * @return {array}
 */
export function rotateX (angle) {
	const theta = Math.PI / 180 * angle
	const matrix = identity()

	matrix[5] = matrix[10] = Math.cos(theta)
	matrix[6] = matrix[9] = Math.sin(theta)
	matrix[9] *= -1

	return matrix
}


/**
 * Returns a 4x4 matrix describing Y-axis rotation.
 *
 * @param  {number} angle - Measured in degrees.
 * @return {array}
 */
export function rotateY (angle) {
	const theta = Math.PI / 180 * angle
	const matrix = identity()

	matrix[0] = matrix[10] = Math.cos(theta)
	matrix[2] = matrix[8] = Math.sin(theta)
	matrix[2] *= -1

	return matrix
}


/**
 * Returns a 4x4 matrix describing Z-axis rotation.
 *
 * @param  {number} angle - Measured in degrees.
 * @return {array}
 */
export function rotateZ (angle) {
	const theta = Math.PI / 180 * angle
	const matrix = identity()

	matrix[0] = matrix[5] = Math.cos(theta)
	matrix[1] = matrix[4] = Math.sin(theta)
	matrix[4] *= -1

	return matrix
}


/**
* Returns a 4x4 matrix describing 2D scaling. The first argument
* is used for both X and Y-axis scaling, unless an optional
* second argument is provided to explicitly define Y-axis scaling.
*
* @param  {number} scalar    - Decimal multiplier.
* @param  {number} [scalarY] - Decimal multiplier.
* @return {array}
*/
export function scale (scalar, scalarY) {
	const matrix = identity()

	matrix[0] = scalar
	matrix[5] = typeof scalarY === 'number'
		? scalarY
		: scalar

	return matrix
}


/**
* Returns a 4x4 matrix describing X-axis scaling.
*
* @param  {number} scalar - Decimal multiplier.
* @return {array}
*/
export function scaleX (scalar) {
	const matrix = identity()
	matrix[0] = scalar
	return matrix
}


/**
* Returns a 4x4 matrix describing Y-axis scaling.
*
* @param  {number} scalar - Decimal multiplier.
* @return {array}
*/
export function scaleY (scalar) {
	const matrix = identity()
	matrix[5] = scalar
	return matrix
}


/**
* Returns a 4x4 matrix describing Z-axis scaling.
*
* @param  {number} scalar - Decimal multiplier.
* @return {array}
*/
export function scaleZ (scalar) {
	const matrix = identity()
	matrix[10] = scalar
	return matrix
}


/**
* Returns a 4x4 matrix describing shear. The first argument
* defines X-axis shearing, and an optional second argument
* defines Y-axis shearing.
*
* @param  {number} angleX   - Measured in degrees.
* @param  {number} [angleY] - Measured in degrees.
* @return {array}
*/
export function skew (angleX, angleY) {
	const thetaX = Math.PI / 180 * angleX
	const matrix = identity()

	matrix[4] = Math.tan(thetaX)

	if (angleY) {
		const thetaY = Math.PI / 180 * angleY
		matrix[1] = Math.tan(thetaY)
	}

	return matrix
}


/**
* Returns a 4x4 matrix describing X-axis shear.
*
* @param  {number} angle - Measured in degrees.
* @return {array}
*/
export function skewX (angle) {
	const theta = Math.PI / 180 * angle
	const matrix = identity()

	matrix[4] = Math.tan(theta)

	return matrix
}


/**
* Returns a 4x4 matrix describing Y-axis shear.
*
* @param  {number} angle - Measured in degrees
* @return {array}
*/
export function skewY (angle) {
	const theta = Math.PI / 180 * angle
	const matrix = identity()

	matrix[1] = Math.tan(theta)

	return matrix
}


/**
 * Returns a 4x4 matrix describing 2D translation. The first
 * argument defines X-axis translation, and an optional second
 * argument defines Y-axis translation.
 *
 * @param  {number} distanceX   - Measured in pixels.
 * @param  {number} [distanceY] - Measured in pixels.
 * @return {array}
 */
export function translate (distanceX, distanceY) {
	const matrix = identity()
	matrix[12] = distanceX

	if (distanceY) {
		matrix[13] = distanceY
	}

	return matrix
}


/**
 * Returns a 4x4 matrix describing X-axis translation.
 *
 * @param  {number} distance - Measured in pixels.
 * @return {array}
 */
export function translateX (distance) {
	const matrix = identity()
	matrix[12] = distance
	return matrix
}


/**
 * Returns a 4x4 matrix describing Y-axis translation.
 *
 * @param  {number} distance - Measured in pixels.
 * @return {array}
 */
export function translateY (distance) {
	const matrix = identity()
	matrix[13] = distance
	return matrix
}


/**
 * Returns a 4x4 matrix describing Z-axis translation.
 *
 * @param  {number} distance - Measured in pixels.
 * @return {array}
 */
export function translateZ (distance) {
	const matrix = identity()
	matrix[14] = distance
	return matrix
}
