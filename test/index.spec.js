import * as Rematrix from '../src/index'

describe('Utilities', () => {
  describe('format()', () => {
    /**
     * matrix(a, b, c, d, tx, ty) is a shorthand for:
     * matrix3d(a, b, 0, 0, c, d, 0, 0, 0, 0, 1, 0, tx, ty, 0, 1)
     * Source: https://goo.gl/7mJsfK
     */
    it('converts CSS transform matrix to matrix3d', () => {
      let source = [1, 2, 3, 4, 5, 6]
      let answer = [1, 2, 0, 0, 3, 4, 0, 0, 0, 0, 1, 0, 5, 6, 0, 1]
      expect(Rematrix.format(source)).to.eql(answer)
    })

    it('returns source argument if it is already matrix3d format', () => {
      let source = [1, 2, 0, 0, 3, 4, 0, 0, 0, 0, 1, 0, 5, 6, 0, 1]
      expect(Rematrix.format(source)).to.equal(source)
    })

    it('throws a type error when passed a non-array', () => {
      let caught
      try {
        Rematrix.format({ foo: 'bar' })
      } catch (error) {
        caught = error
      }
      expect(caught).to.exist
      expect(caught).to.be.an.instanceOf(TypeError)
    })

    it('throws a type error when passed an array of invalid length', () => {
      let caught
      try {
        Rematrix.format([])
      } catch (error) {
        caught = error
      }
      expect(caught).to.exist
      expect(caught).to.be.an.instanceOf(TypeError)
    })
  })

  describe('fromString()', () => {
    it('returns a 4x4 matrix equal to the `matrix` string passed in', () => {
      let source = 'matrix(1, 2, 3, 4, 5, 6)'
      let result = Rematrix.fromString(source)
      let answer = [1, 2, 0, 0, 3, 4, 0, 0, 0, 0, 1, 0, 5, 6, 0, 1]
      expect(result).to.eql(answer)
    })

    it('returns a 4x4 matrix equal to the `matrix3d` string passed in', () => {
      let source = 'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)'
      let result = Rematrix.fromString(source)
      let answer = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
      expect(result).to.eql(answer)
    })

    it('returns a 4x4 identity matrix when the string `none`', () => {
      let source = 'none'
      let result = Rematrix.fromString(source)
      let answer = Rematrix.identity()
      expect(result).to.eql(answer)
    })

    it('returns a 4x4 identity matrix when passed empty string', () => {
      let source = ''
      let result = Rematrix.fromString(source)
      let answer = Rematrix.identity()
      expect(result).to.eql(answer)
    })

    it('throws a type error when passed a malformed string', () => {
      let caught
      try {
        Rematrix.fromString('matirx(1, 2, 3, 4, 5, 6)')
      } catch (error) {
        caught = error
      }
      expect(caught).to.exist
      expect(caught).to.be.an.instanceOf(TypeError)
    })

    it('throws a type error when passed an invalid argument', () => {
      let caught
      try {
        Rematrix.fromString({ foo: 'bar' })
      } catch (error) {
        caught = error
      }
      expect(caught).to.exist
      expect(caught).to.be.an.instanceOf(TypeError)
    })
  })

  describe('identity()', () => {
    it('returns a 4x4 identity matrix in column-major order', () => {
      let result = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
      expect(Rematrix.identity()).to.eql(result)
    })
  })

  describe('inverse()', () => {
    it('returns a 4x4 matrix equal to the inverse of the matrix passed in', () => {
      let source = Rematrix.rotateX(79)
      let inverse = Rematrix.inverse(source)

      let result = Rematrix.multiply(source, inverse)
      let answer = Rematrix.identity()

      expect(result).to.eql(answer)
    })

    it('throws when the source matrix fails formatting', () => {
      let caught
      try {
        Rematrix.inverse([0, 1, 2, 4])
      } catch (error) {
        caught = error
      }
      expect(caught).to.exist
      expect(caught).to.be.an.instanceOf(Error)

      try {
        Rematrix.inverse({ 0: 10, 1: 42, 2: 22, 3: -78 })
      } catch (error) {
        caught = error
      }
      expect(caught).to.exist
      expect(caught).to.be.an.instanceOf(Error)
    })

    it('throws when the source matrix has no inverse', () => {
      let caught
      try {
        Rematrix.inverse([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
      } catch (error) {
        caught = error
      }
      expect(caught).to.exist
      expect(caught).to.be.an.instanceOf(Error)
    })
  })

  describe('multiply()', () => {
    it('returns a 4x4 matrix equal to the product of both arguments', () => {
      let first = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3]
      let second = [4, 3, 2, 1, 4, 3, 2, 1, 4, 3, 2, 1, 4, 3, 2, 1]
      let answer = [0, 10, 20, 30, 0, 10, 20, 30, 0, 10, 20, 30, 0, 10, 20, 30]
      expect(Rematrix.multiply(first, second)).to.eql(answer)
    })

    it('throws when passed matrices that fail formatting', () => {
      let first = [1, 2, 3]
      let second = Rematrix.identity()
      let caught
      try {
        Rematrix.multiply(first, second)
      } catch (error) {
        caught = error
      }
      expect(caught).to.exist
      expect(caught).to.be.an.instanceOf(Error)

      let third = 'wild and crazy string'
      let fourth = Rematrix.identity()
      try {
        Rematrix.multiply(third, fourth)
      } catch (error) {
        caught = error
      }
      expect(caught).to.exist
      expect(caught).to.be.an.instanceOf(Error)
    })
  })

  describe('toString()', () => {
    it('returns a valid CSS Transform matrix3d value', () => {
      let matrix = Rematrix.scale(2)
      let result = Rematrix.toString(matrix)
      let answer = 'matrix3d(2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)'
      expect(result).to.eql(answer)
    })

    it('throws when not passed a valid source matrix', () => {
      let caught
      try {
        Rematrix.toString([4, 3, 2, 1])
      } catch (error) {
        caught = error
      }
      expect(caught).to.exist
      expect(caught).to.be.an.instanceOf(Error)
    })
  })
})

describe('Transformation', () => {
  let dummy
  let transformProperty

  before('create dummy object', () => {
    dummy = document.createElement('div')
    document.body.appendChild(dummy)
  })

  before('capture transform property name', () => {
    let computed = window.getComputedStyle(dummy)
    if (typeof computed['transform'] === 'string')
      return (transformProperty = 'transform')
    if (typeof computed['-webkit-transform'] === 'string')
      return (transformProperty = '-webkit-transform')
  })

  beforeEach('clean dummy object', () => {
    dummy.removeAttribute('style')
  })

  function getTransformAsArray(node) {
    let computedTransform = window.getComputedStyle(node)[transformProperty]
    let match = computedTransform.match(/\(([^)]+)\)/)[1]
    let values = match.split(', ').map(parseFloat)
    return Rematrix.format(values)
  }

  describe('perspective()', () => {
    it('returns a 4x4 matrix equal to CSS transform perspective', () => {
      dummy.setAttribute('style', `${transformProperty}: perspective(20px)`)
      let result = Rematrix.perspective(20)
      let answer = getTransformAsArray(dummy)
      expect(result).to.be.eql(answer)
    })
  })

  /**
   * To account for rounding differences of Sin and Cos across browsers,
   * all rotation values will be rounded to 6 significant digits.
   */

  describe('rotate()', () => {
    it('returns a 4x4 matrix equal to CSS transform rotate', () => {
      dummy.setAttribute('style', `${transformProperty}: rotate(75deg)`)
      let answer = getTransformAsArray(dummy)
        .map((value) => value.toPrecision(6))
        .map(parseFloat)

      let result = Rematrix.rotate(75)
        .map((value) => value.toPrecision(6))
        .map(parseFloat)

      expect(result).to.be.eql(answer)
    })
  })

  describe('rotateX()', () => {
    it('returns a 4x4 matrix equal to CSS transform rotateX', () => {
      dummy.setAttribute('style', `${transformProperty}: rotateX(45deg)`)
      let answer = getTransformAsArray(dummy)
        .map((value) => value.toPrecision(6))
        .map(parseFloat)

      let result = Rematrix.rotateX(45)
        .map((value) => value.toPrecision(6))
        .map(parseFloat)

      expect(result).to.be.eql(answer)
    })
  })

  describe('rotateY()', () => {
    it('returns a 4x4 matrix equal to CSS transform rotateY', () => {
      dummy.setAttribute('style', `${transformProperty}: rotateY(45deg)`)
      let answer = getTransformAsArray(dummy)
        .map((value) => value.toPrecision(6))
        .map(parseFloat)

      let result = Rematrix.rotateY(45)
        .map((value) => value.toPrecision(6))
        .map(parseFloat)

      expect(result).to.be.eql(answer)
    })
  })

  describe('rotateZ()', () => {
    it('returns a 4x4 matrix equal to CSS transform rotateZ', () => {
      dummy.setAttribute('style', `${transformProperty}: rotateZ(45deg)`)
      let answer = getTransformAsArray(dummy)
        .map((value) => value.toPrecision(6))
        .map(parseFloat)

      let result = Rematrix.rotateZ(45)
        .map((value) => value.toPrecision(6))
        .map(parseFloat)

      expect(result).to.be.eql(answer)
    })
  })

  describe('scale()', () => {
    it('returns a 4x4 matrix equal to CSS transform scale with one arg', () => {
      dummy.setAttribute('style', `${transformProperty}: scale(2)`)
      let result = Rematrix.scale(2)
      let answer = getTransformAsArray(dummy)
      expect(result).to.be.eql(answer)
    })

    it('returns a 4x4 matrix equal to CSS transform scale with two args', () => {
      dummy.setAttribute('style', `${transformProperty}: scale(2, 0)`)
      let result = Rematrix.scale(2, 0)
      let answer = getTransformAsArray(dummy)
      expect(result).to.be.eql(answer)
    })
  })

  describe('scaleX()', () => {
    it('returns a 4x4 matrix equal to CSS transform scaleX', () => {
      dummy.setAttribute('style', `${transformProperty}: scaleX(2)`)
      let result = Rematrix.scaleX(2)
      let answer = getTransformAsArray(dummy)
      expect(result).to.be.eql(answer)
    })
  })

  describe('scaleY()', () => {
    it('returns a 4x4 matrix equal to CSS transform scaleY', () => {
      dummy.setAttribute('style', `${transformProperty}: scaleY(2)`)
      let result = Rematrix.scaleY(2)
      let answer = getTransformAsArray(dummy)
      expect(result).to.be.eql(answer)
    })
  })

  describe('scaleZ()', () => {
    it('returns a 4x4 matrix equal to CSS transform scaleZ', () => {
      dummy.setAttribute('style', `${transformProperty}: scaleZ(2)`)
      let result = Rematrix.scaleZ(2)
      let answer = getTransformAsArray(dummy)
      expect(result).to.be.eql(answer)
    })
  })

  /**
   * To account for rounding differences of Tan across browsers,
   * all skew values will be rounded to 6 significant digits.
   */

  describe('skew()', () => {
    it('returns a 4x4 matrix equal to CSS transform skew with one arg', () => {
      dummy.setAttribute('style', `${transformProperty}: skew(20deg)`)

      let result = Rematrix.skew(20)
        .map((value) => value.toPrecision(6))
        .map(parseFloat)

      let answer = getTransformAsArray(dummy)
        .map((value) => value.toPrecision(6))
        .map(parseFloat)

      expect(result).to.be.eql(answer)
    })

    it('returns a 4x4 matrix equal to CSS transform skew with two args', () => {
      dummy.setAttribute('style', `${transformProperty}: skew(20deg, 30deg)`)

      let result = Rematrix.skew(20, 30)
        .map((value) => value.toPrecision(6))
        .map(parseFloat)

      let answer = getTransformAsArray(dummy)
        .map((value) => value.toPrecision(6))
        .map(parseFloat)

      expect(result).to.be.eql(answer)
    })
  })

  describe('skewX()', () => {
    it('returns a 4x4 matrix equal to CSS transform skewX', () => {
      dummy.setAttribute('style', `${transformProperty}: skewX(20deg)`)

      let result = Rematrix.skewX(20)
        .map((value) => value.toPrecision(6))
        .map(parseFloat)

      let answer = getTransformAsArray(dummy)
        .map((value) => value.toPrecision(6))
        .map(parseFloat)

      expect(result).to.be.eql(answer)
    })
  })

  describe('skewY()', () => {
    it('returns a 4x4 matrix equal to CSS transform skewY', () => {
      dummy.setAttribute('style', `${transformProperty}: skewY(30deg)`)

      let result = Rematrix.skewY(30)
        .map((value) => value.toPrecision(6))
        .map(parseFloat)

      let answer = getTransformAsArray(dummy)
        .map((value) => value.toPrecision(6))
        .map(parseFloat)

      expect(result).to.be.eql(answer)
    })
  })

  describe('translate()', () => {
    it('returns a 4x4 matrix equal to CSS transform translate with one arg', () => {
      dummy.setAttribute('style', `${transformProperty}: translate(20px)`)
      let result = Rematrix.translate(20)
      let answer = getTransformAsArray(dummy)
      expect(result).to.be.eql(answer)
    })

    it('returns a 4x4 matrix equal to CSS transform translate with two args', () => {
      dummy.setAttribute('style', `${transformProperty}: translate(20px, 40px)`)
      let result = Rematrix.translate(20, 40)
      let answer = getTransformAsArray(dummy)
      expect(result).to.be.eql(answer)
    })
  })

  describe('translate3d()', () => {
    it('should return a 4x4 matrix equal to CSS transform translate3d', () => {
      dummy.setAttribute('style', `${transformProperty}: translate3d(20px, 30px, 40px)`)
      let result = Rematrix.translate3d(20, 30, 40)
      let answer = getTransformAsArray(dummy)
      expect(result).to.be.eql(answer)
    })

    it('should accept zero as an argument', () => {
      dummy.setAttribute('style', `${transformProperty}: translate3d(20px, 0, 40px)`)
      let result = Rematrix.translate3d(20, 0, 40)
      let answer = getTransformAsArray(dummy)
      expect(result).to.be.eql(answer)
    })

    it('returns an identity matrix when missing arguments', () => {
      let result = Rematrix.translate3d(20, 30)
      let answer = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
      expect(result).to.be.eql(answer)
    })
  })

  describe('translateX()', () => {
    it('returns a 4x4 matrix equal to CSS transform translateX', () => {
      dummy.setAttribute('style', `${transformProperty}: translateX(20px)`)
      let result = Rematrix.translateX(20)
      let answer = getTransformAsArray(dummy)
      expect(result).to.be.eql(answer)
    })
  })

  describe('translateY()', () => {
    it('returns a 4x4 matrix equal to CSS transform translateY', () => {
      dummy.setAttribute('style', `${transformProperty}: translateY(20px)`)
      let result = Rematrix.translateY(20)
      let answer = getTransformAsArray(dummy)
      expect(result).to.be.eql(answer)
    })
  })

  describe('translateZ()', () => {
    it('returns a 4x4 matrix equal to CSS transform translateZ', () => {
      dummy.setAttribute('style', `${transformProperty}: translateZ(20px)`)
      let result = Rematrix.translateZ(20)
      let answer = getTransformAsArray(dummy)
      expect(result).to.be.eql(answer)
    })
  })
})
