/**
 * @module Rematrix
 */

/**
 * ___
 * _Attempts to return a 4x4 matrix describing the CSS transform
 * matrix passed in, but will return the identity matrix as a
 * fallback._
 *
 * @param source A string containing a `matrix` or `matrix3d` CSS Transform value.
 * @returns An array representing a 3D matrix.
 */
export function fromString(source) {
  if (typeof source === 'string') {
    const match = source.match(/matrix(3d)?\(([^)]+)\)/)
    if (match) {
      const raw = match[2].split(', ').map(parseFloat)
      return format(raw)
    }
  }
  return identity()
}

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
 * @returns An array representing a 3D matrix.
 */
export function format(source) {
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
 * ___
 * _Creates a matrix representing no transformation. The product of any
 * matrix multiplied by the identity matrix will be the original matrix._
 *
 * _**Tip:** Similar to how `5 * 1 === 5`, where `1` is the identity._
 *
 * @returns An array representing a 3D matrix.
 */
export function identity() {
  const matrix = []
  for (let i = 0; i < 16; i++) {
    i % 5 == 0 ? matrix.push(1) : matrix.push(0)
  }
  return matrix
}

/**
 * ___
 * _Creates a matrix describing the inverse transformation of the source
 * matrix. The product of any matrix multiplied by its inverse will be the
 * identity matrix._
 *
 * **Tip:** Similar to how `5 * (1/5) === 1`, where `1/5` is the inverse.
 *
 * @param source Accepts both short and long form matrices.
 * @returns An array representing a 3D matrix.
 */
export function inverse(source) {
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
 * @returns An array representing a 3D matrix.
 */
export function multiply(m, x) {
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
 * This method has been deprecated!
 * See `Rematrix.fromString` instead.
 */
export function parse(source) {
  console.warn('The `parse` method has been deprecated, please use `fromString`')
  return fromString(source)
}

/**
 * ___
 * _Creates a matrix representing perspective._
 *
 * @param distance Measured in pixels.
 * @returns An array representing a 3D matrix.
 */
export function perspective(distance) {
  const matrix = identity()
  matrix[11] = -1 / distance
  return matrix
}

/**
 * ___
 * _Creates a matrix representing Z‑axis rotation._
 *
 * _**Tip:** This is just an alias for `Rematrix.rotateZ` for parity with CSS._
 *
 * @param angle Measured in degrees.
 * @returns An array representing a 3D matrix.
 */
export function rotate(angle) {
  return rotateZ(angle)
}

/**
 * ___
 * _Creates a matrix representing X‑axis rotation._
 *
 * @param angle Measured in degrees.
 * @returns An array representing a 3D matrix.
 */
export function rotateX(angle) {
  const theta = (Math.PI / 180) * angle
  const matrix = identity()

  matrix[5] = matrix[10] = Math.cos(theta)
  matrix[6] = matrix[9] = Math.sin(theta)
  matrix[9] *= -1

  return matrix
}

/**
 * ___
 * _Creates a matrix representing Y‑axis rotation._
 *
 * @param angle Measured in degrees.
 * @returns An array representing a 3D matrix.
 */
export function rotateY(angle) {
  const theta = (Math.PI / 180) * angle
  const matrix = identity()

  matrix[0] = matrix[10] = Math.cos(theta)
  matrix[2] = matrix[8] = Math.sin(theta)
  matrix[2] *= -1

  return matrix
}

/**
 * ___
 * _Creates a matrix representing Z‑axis rotation._
 *
 * @param angle Measured in degrees.
 * @returns An array representing a 3D matrix.
 */
export function rotateZ(angle) {
  const theta = (Math.PI / 180) * angle
  const matrix = identity()

  matrix[0] = matrix[5] = Math.cos(theta)
  matrix[1] = matrix[4] = Math.sin(theta)
  matrix[4] *= -1

  return matrix
}

/**
 * ___
 * _Creates a matrix representing 2D scaling. The first argument
 * is used for both X and Y‑axis scaling, unless an optional
 * second argument is provided to explicitly define Y‑axis scaling._
 *
 * @param scalar Decimal multiplier.
 * @param scalarY Decimal multiplier. (Optional)
 * @returns An array representing a 3D matrix.
 */
export function scale(scalar, scalarY) {
  const matrix = identity()

  matrix[0] = scalar
  matrix[5] = typeof scalarY === 'number' ? scalarY : scalar

  return matrix
}

/**
 * ___
 * _Creates a matrix representing X‑axis scaling._
 *
 * @param scalar Decimal multiplier.
 * @returns An array representing a 3D matrix.
 */
export function scaleX(scalar) {
  const matrix = identity()
  matrix[0] = scalar
  return matrix
}

/**
 * ___
 * _Creates a matrix representing Y‑axis scaling._
 *
 * @param scalar Decimal multiplier.
 * @returns An array representing a 3D matrix.
 */
export function scaleY(scalar) {
  const matrix = identity()
  matrix[5] = scalar
  return matrix
}

/**
 * ___
 * _Creates a matrix representing Z‑axis scaling._
 *
 * @param scalar Decimal multiplier.
 * @returns An array representing a 3D matrix.
 */
export function scaleZ(scalar) {
  const matrix = identity()
  matrix[10] = scalar
  return matrix
}

/**
 * ___
 * _Creates a matrix representing shear. The first argument
 * defines X‑axis shearing, and an optional second argument
 * defines Y‑axis shearing._
 *
 * @param angleX Measured in degrees.
 * @param angleY Measured in degrees. (Optional)
 * @returns An array representing a 3D matrix.
 */
export function skew(angleX, angleY) {
  const thetaX = (Math.PI / 180) * angleX
  const matrix = identity()

  matrix[4] = Math.tan(thetaX)

  if (angleY) {
    const thetaY = (Math.PI / 180) * angleY
    matrix[1] = Math.tan(thetaY)
  }

  return matrix
}

/**
 * ___
 * _Creates a matrix representing X‑axis shear._
 *
 * @param angle Measured in degrees.
 * @returns An array representing a 3D matrix.
 */
export function skewX(angle) {
  const theta = (Math.PI / 180) * angle
  const matrix = identity()

  matrix[4] = Math.tan(theta)

  return matrix
}

/**
 * ___
 * _Creates a matrix representing Y‑axis shear._
 *
 * @param angle Measured in degrees
 * @returns An array representing a 3D matrix.
 */
export function skewY(angle) {
  const theta = (Math.PI / 180) * angle
  const matrix = identity()

  matrix[1] = Math.tan(theta)

  return matrix
}

/**
 * ___
 * _Returns a CSS Transform property value equivalent to the source matrix._
 *
 * @param source Accepts both short and long form matrices.
 * @returns A string representing a CSS Transform `matrix3d` property value.
 */
export function toString(source) {
  return `matrix3d(${format(source).join(', ')})`
}

/**
 * ___
 * _Creates a matrix representing 2D translation. The first
 * argument defines X‑axis translation, and an optional second
 * argument defines Y‑axis translation._
 *
 * @param distanceX Measured in pixels.
 * @param distanceY Measured in pixels. (Optional)
 * @returns An array representing a 3D matrix.
 */
export function translate(distanceX, distanceY) {
  const matrix = identity()
  matrix[12] = distanceX

  if (distanceY) {
    matrix[13] = distanceY
  }

  return matrix
}

/**
 * ___
 * _Creates a matrix representing 3D translation. The first argument
 * defines X‑axis translation, the second argument defines Y‑axis
 * translation, and the third argument defines Z‑axis translation._
 *
 * @param distanceX Measured in pixels.
 * @param distanceY Measured in pixels.
 * @param distanceZ Measured in pixels.
 * @returns An array representing a 3D matrix.
 */
export function translate3d(distanceX, distanceY, distanceZ) {
  const matrix = identity()
  if (distanceX !== undefined && distanceY !== undefined && distanceZ !== undefined) {
    matrix[12] = distanceX
    matrix[13] = distanceY
    matrix[14] = distanceZ
  }
  return matrix
}

/**
 * ___
 * _Creates a matrix representing X‑axis translation._
 *
 * @param distance Measured in pixels.
 * @returns An array representing a 3D matrix.
 */
export function translateX(distance) {
  const matrix = identity()
  matrix[12] = distance
  return matrix
}

/**
 * ___
 * _Creates a matrix representing Y‑axis translation._
 *
 * @param distance Measured in pixels.
 * @returns An array representing a 3D matrix.
 */
export function translateY(distance) {
  const matrix = identity()
  matrix[13] = distance
  return matrix
}

/**
 * ___
 * _Creates a matrix representing Z‑axis translation._
 *
 * @param distance Measured in pixels.
 * @returns An array representing a 3D matrix.
 */
export function translateZ(distance) {
  const matrix = identity()
  matrix[14] = distance
  return matrix
}
