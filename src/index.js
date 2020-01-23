export function format(source) {
  if (source && source.constructor === Array) {
    let values = source
      .filter(value => typeof value === 'number')
      .filter(value => !isNaN(value))

    if (source.length === 6 && values.length === 6) {
      let matrix = identity()
      matrix[0] = values[0]
      matrix[1] = values[1]
      matrix[4] = values[2]
      matrix[5] = values[3]
      matrix[12] = values[4]
      matrix[13] = values[5]
      return matrix
    } else if (source.length === 16 && values.length === 16) {
      return source
    }
  }
  throw new TypeError('Expected a `number[]` with length 6 or 16.')
}

export function fromString(source) {
  if (typeof source === 'string') {
    let match = source.match(/matrix(3d)?\(([^)]+)\)/)
    if (match) {
      let raw = match[2].split(', ').map(parseFloat)
      return format(raw)
    }
  }
  throw new TypeError('Expected a string containing `matrix()` or `matrix3d()')
}

export function identity() {
  let matrix = []
  for (let i = 0; i < 16; i++) {
    i % 5 == 0 ? matrix.push(1) : matrix.push(0)
  }
  return matrix
}

export function inverse(source) {
  let m = format(source)

  let s0 = m[0] * m[5] - m[4] * m[1]
  let s1 = m[0] * m[6] - m[4] * m[2]
  let s2 = m[0] * m[7] - m[4] * m[3]
  let s3 = m[1] * m[6] - m[5] * m[2]
  let s4 = m[1] * m[7] - m[5] * m[3]
  let s5 = m[2] * m[7] - m[6] * m[3]

  let c5 = m[10] * m[15] - m[14] * m[11]
  let c4 = m[9] * m[15] - m[13] * m[11]
  let c3 = m[9] * m[14] - m[13] * m[10]
  let c2 = m[8] * m[15] - m[12] * m[11]
  let c1 = m[8] * m[14] - m[12] * m[10]
  let c0 = m[8] * m[13] - m[12] * m[9]

  let determinant = 1 / (s0 * c5 - s1 * c4 + s2 * c3 + s3 * c2 - s4 * c1 + s5 * c0)

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

export function multiply(matrixA, matrixB) {
  let fma = format(matrixA)
  let fmb = format(matrixB)
  let product = []

  for (let i = 0; i < 4; i++) {
    let row = [fma[i], fma[i + 4], fma[i + 8], fma[i + 12]]
    for (let j = 0; j < 4; j++) {
      let k = j * 4
      let col = [fmb[k], fmb[k + 1], fmb[k + 2], fmb[k + 3]]
      let result = row[0] * col[0] + row[1] * col[1] + row[2] * col[2] + row[3] * col[3]

      product[i + k] = result
    }
  }

  return product
}

export function perspective(distance) {
  let matrix = identity()
  matrix[11] = -1 / distance
  return matrix
}

export function rotate(angle) {
  return rotateZ(angle)
}

export function rotateX(angle) {
  let theta = (Math.PI / 180) * angle
  let matrix = identity()

  matrix[5] = matrix[10] = Math.cos(theta)
  matrix[6] = matrix[9] = Math.sin(theta)
  matrix[9] *= -1

  return matrix
}

export function rotateY(angle) {
  let theta = (Math.PI / 180) * angle
  let matrix = identity()

  matrix[0] = matrix[10] = Math.cos(theta)
  matrix[2] = matrix[8] = Math.sin(theta)
  matrix[2] *= -1

  return matrix
}

export function rotateZ(angle) {
  let theta = (Math.PI / 180) * angle
  let matrix = identity()

  matrix[0] = matrix[5] = Math.cos(theta)
  matrix[1] = matrix[4] = Math.sin(theta)
  matrix[4] *= -1

  return matrix
}

export function scale(scalar, scalarY) {
  let matrix = identity()

  matrix[0] = scalar
  matrix[5] = typeof scalarY === 'number' ? scalarY : scalar

  return matrix
}

export function scaleX(scalar) {
  let matrix = identity()
  matrix[0] = scalar
  return matrix
}

export function scaleY(scalar) {
  let matrix = identity()
  matrix[5] = scalar
  return matrix
}

export function scaleZ(scalar) {
  let matrix = identity()
  matrix[10] = scalar
  return matrix
}

export function skew(angleX, angleY) {
  let thetaX = (Math.PI / 180) * angleX
  let matrix = identity()

  matrix[4] = Math.tan(thetaX)

  if (angleY) {
    let thetaY = (Math.PI / 180) * angleY
    matrix[1] = Math.tan(thetaY)
  }

  return matrix
}

export function skewX(angle) {
  let theta = (Math.PI / 180) * angle
  let matrix = identity()

  matrix[4] = Math.tan(theta)

  return matrix
}

export function skewY(angle) {
  let theta = (Math.PI / 180) * angle
  let matrix = identity()

  matrix[1] = Math.tan(theta)

  return matrix
}

export function toString(source) {
  return `matrix3d(${format(source).join(', ')})`
}

export function translate(distanceX, distanceY) {
  let matrix = identity()
  matrix[12] = distanceX

  if (distanceY) {
    matrix[13] = distanceY
  }

  return matrix
}

export function translate3d(distanceX, distanceY, distanceZ) {
  let matrix = identity()
  if (distanceX !== undefined && distanceY !== undefined && distanceZ !== undefined) {
    matrix[12] = distanceX
    matrix[13] = distanceY
    matrix[14] = distanceZ
  }
  return matrix
}

export function translateX(distance) {
  let matrix = identity()
  matrix[12] = distance
  return matrix
}

export function translateY(distance) {
  let matrix = identity()
  matrix[13] = distance
  return matrix
}

export function translateZ(distance) {
  let matrix = identity()
  matrix[14] = distance
  return matrix
}
