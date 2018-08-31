import * as Rematrix from '../src/index'

describe('Utilities', () => {
	describe('format()', () => {
		/**
		 * matrix(a, b, c, d, tx, ty) is a shorthand for:
		 * matrix3d(a, b, 0, 0, c, d, 0, 0, 0, 0, 1, 0, tx, ty, 0, 1)
		 * Source: https://goo.gl/7mJsfK
		 */
		it('should convert CSS transform matrix to matrix3d', () => {
			const source = [1, 2, 3, 4, 5, 6]
			const answer = [1, 2, 0, 0, 3, 4, 0, 0, 0, 0, 1, 0, 5, 6, 0, 1]
			expect(Rematrix.format(source)).to.eql(answer)
		})

		it('should return source argument if it is already matrix3d format', () => {
			const source = [1, 2, 0, 0, 3, 4, 0, 0, 0, 0, 1, 0, 5, 6, 0, 1]
			expect(Rematrix.format(source)).to.equal(source)
		})

		it('should throw a type error when passed a non-array', () => {
			let caught
			try {
				Rematrix.format({ foo: 'bar' })
			} catch (error) {
				caught = error
			}
			expect(caught).to.exist
			expect(caught).to.be.an.instanceOf(TypeError)
		})

		it('should throw a range error when passed an array of invalid length', () => {
			let caught
			try {
				Rematrix.format([])
			} catch (error) {
				caught = error
			}
			expect(caught).to.exist
			expect(caught).to.be.an.instanceOf(RangeError)
		})
	})

	describe('identity()', () => {
		it('should return a 4x4 identity matrix in column-major order', () => {
			const result = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
			expect(Rematrix.identity()).to.eql(result)
		})
	})

	describe('inverse()', () => {
		it('should return a 4x4 matrix that when multiplied by the source matrix, equals the identity matrix', () => {
			const source = Rematrix.rotateX(79)
			const inverse = Rematrix.inverse(source)

			const result = Rematrix.multiply(source, inverse)
			const answer = Rematrix.identity()

			expect(result).to.eql(answer)
		})

		it('should throw when the source matrix fails formatting', () => {
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

		it('should throw when the source matrix has no inverse', () => {
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
		it('should return a 4x4 matrix equal to the product of both arguments', () => {
			const first = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
			const second = [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
			const answer = [
				386,
				444,
				502,
				560,
				274,
				316,
				358,
				400,
				162,
				188,
				214,
				240,
				50,
				60,
				70,
				80
			]
			expect(Rematrix.multiply(first, second)).to.eql(answer)
		})

		it('should throw when passed matrices that fail formatting', () => {
			const first = [1, 2, 3]
			const second = Rematrix.identity()
			let caught
			try {
				Rematrix.multiply(first, second)
			} catch (error) {
				caught = error
			}
			expect(caught).to.exist
			expect(caught).to.be.an.instanceOf(Error)

			const third = 'wild and crazy string'
			const fourth = Rematrix.identity()
			try {
				Rematrix.multiply(third, fourth)
			} catch (error) {
				caught = error
			}
			expect(caught).to.exist
			expect(caught).to.be.an.instanceOf(Error)
		})
	})

	describe('parse()', () => {
		it('should return a 4x4 matrix equal to the `matrix` string passed in', () => {
			const source = 'matrix(1, 2, 3, 4, 5, 6)'
			const result = Rematrix.parse(source)
			const answer = [1, 2, 0, 0, 3, 4, 0, 0, 0, 0, 1, 0, 5, 6, 0, 1]
			expect(result).to.eql(answer)
		})

		it('should return a 4x4 matrix equal to the `matrix3d` string passed in', () => {
			const source =
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)'
			const result = Rematrix.parse(source)
			const answer = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
			expect(result).to.eql(answer)
		})

		it('should return an identity matrix if passed an invalid argument', () => {
			const source = 'rotateX(45deg)'
			const result = Rematrix.parse(source)
			const answer = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
			expect(result).to.eql(answer)
		})
	})

	describe('toString()', () => {
		it('should return a valid CSS Transform matrix3d value', () => {
			const matrix = Rematrix.scale(2)
			const result = Rematrix.toString(matrix)
			const answer = 'matrix3d(2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)'
			expect(result).to.eql(answer)
		})

		it('should throw when not passed a valid source matrix', () => {
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

	describe('Transformation', () => {
		let dummy
		let transformProperty

		before('create dummy object', () => {
			dummy = document.createElement('div')
			document.body.appendChild(dummy)

			const computed = window.getComputedStyle(dummy)

			if (typeof computed['transform'] === 'string')
				return (transformProperty = 'transform')
			if (typeof computed['-webkit-transform'] === 'string')
				return (transformProperty = '-webkit-transform')
		})

		beforeEach('clean dummy object', () => {
			dummy.removeAttribute('style')
		})

		function getTransformAsArray(node) {
			const computedTransform = window.getComputedStyle(node)[transformProperty]
			const match = computedTransform.match(/\(([^)]+)\)/)[1]
			const values = match.split(', ').map(value => parseFloat(value))
			return Rematrix.format(values)
		}

		/**
		 * To account for rounding differences of Sin and Cos across browsers,
		 * all rotation values will be rounded to 6 significant digits.
		 */

		describe('rotate()', () => {
			it('should return a 4x4 matrix equal to CSS transform rotate', () => {
				dummy.setAttribute('style', `${transformProperty}: rotate(75deg)`)
				const answer = getTransformAsArray(dummy)
					.map(value => value.toPrecision(6))
					.map(value => parseFloat(value))

				const result = Rematrix.rotate(75)
					.map(value => value.toPrecision(6))
					.map(value => parseFloat(value))

				expect(result).to.be.eql(answer)
			})
		})

		describe('rotateX()', () => {
			it('should return a 4x4 matrix equal to CSS transform rotateX', () => {
				dummy.setAttribute('style', `${transformProperty}: rotateX(45deg)`)
				const answer = getTransformAsArray(dummy)
					.map(value => value.toPrecision(6))
					.map(value => parseFloat(value))

				const result = Rematrix.rotateX(45)
					.map(value => value.toPrecision(6))
					.map(value => parseFloat(value))

				expect(result).to.be.eql(answer)
			})
		})

		describe('rotateY()', () => {
			it('should return a 4x4 matrix equal to CSS transform rotateY', () => {
				dummy.setAttribute('style', `${transformProperty}: rotateY(45deg)`)
				const answer = getTransformAsArray(dummy)
					.map(value => value.toPrecision(6))
					.map(value => parseFloat(value))

				const result = Rematrix.rotateY(45)
					.map(value => value.toPrecision(6))
					.map(value => parseFloat(value))

				expect(result).to.be.eql(answer)
			})
		})

		describe('rotateZ()', () => {
			it('should return a 4x4 matrix equal to CSS transform rotateZ', () => {
				dummy.setAttribute('style', `${transformProperty}: rotateZ(45deg)`)
				const answer = getTransformAsArray(dummy)
					.map(value => value.toPrecision(6))
					.map(value => parseFloat(value))

				const result = Rematrix.rotateZ(45)
					.map(value => value.toPrecision(6))
					.map(value => parseFloat(value))

				expect(result).to.be.eql(answer)
			})
		})

		describe('scale()', () => {
			it('should return a 4x4 matrix equal to CSS transform scale with one arg', () => {
				dummy.setAttribute('style', `${transformProperty}: scale(2)`)
				const result = Rematrix.scale(2)
				const answer = getTransformAsArray(dummy)
				expect(result).to.be.eql(answer)
			})

			it('should return a 4x4 matrix equal to CSS transform scale with two args', () => {
				dummy.setAttribute('style', `${transformProperty}: scale(2, 0)`)
				const result = Rematrix.scale(2, 0)
				const answer = getTransformAsArray(dummy)
				expect(result).to.be.eql(answer)
			})
		})

		describe('scaleX()', () => {
			it('should return a 4x4 matrix equal to CSS transform scaleX', () => {
				dummy.setAttribute('style', `${transformProperty}: scaleX(2)`)
				const result = Rematrix.scaleX(2)
				const answer = getTransformAsArray(dummy)
				expect(result).to.be.eql(answer)
			})
		})

		describe('scaleY()', () => {
			it('should return a 4x4 matrix equal to CSS transform scaleY', () => {
				dummy.setAttribute('style', `${transformProperty}: scaleY(2)`)
				const result = Rematrix.scaleY(2)
				const answer = getTransformAsArray(dummy)
				expect(result).to.be.eql(answer)
			})
		})

		describe('scaleZ()', () => {
			it('should return a 4x4 matrix equal to CSS transform scaleZ', () => {
				dummy.setAttribute('style', `${transformProperty}: scaleZ(2)`)
				const result = Rematrix.scaleZ(2)
				const answer = getTransformAsArray(dummy)
				expect(result).to.be.eql(answer)
			})
		})

		/**
		 * To account for rounding differences of Tan across browsers,
		 * all skew values will be rounded to 6 significant digits.
		 */

		describe('skew()', () => {
			it('should return a 4x4 matrix equal to CSS transform skew with one arg', () => {
				dummy.setAttribute('style', `${transformProperty}: skew(20deg)`)

				const result = Rematrix.skew(20)
					.map(value => value.toPrecision(6))
					.map(value => parseFloat(value))

				const answer = getTransformAsArray(dummy)
					.map(value => value.toPrecision(6))
					.map(value => parseFloat(value))

				expect(result).to.be.eql(answer)
			})

			it('should return a 4x4 matrix equal to CSS transform skew with two args', () => {
				dummy.setAttribute('style', `${transformProperty}: skew(20deg, 30deg)`)

				const result = Rematrix.skew(20, 30)
					.map(value => value.toPrecision(6))
					.map(value => parseFloat(value))

				const answer = getTransformAsArray(dummy)
					.map(value => value.toPrecision(6))
					.map(value => parseFloat(value))

				expect(result).to.be.eql(answer)
			})
		})

		describe('skewX()', () => {
			it('should return a 4x4 matrix equal to CSS transform skewX', () => {
				dummy.setAttribute('style', `${transformProperty}: skewX(20deg)`)

				const result = Rematrix.skewX(20)
					.map(value => value.toPrecision(6))
					.map(value => parseFloat(value))

				const answer = getTransformAsArray(dummy)
					.map(value => value.toPrecision(6))
					.map(value => parseFloat(value))

				expect(result).to.be.eql(answer)
			})
		})

		describe('skewY()', () => {
			it('should return a 4x4 matrix equal to CSS transform skewY', () => {
				dummy.setAttribute('style', `${transformProperty}: skewY(30deg)`)

				const result = Rematrix.skewY(30)
					.map(value => value.toPrecision(6))
					.map(value => parseFloat(value))

				const answer = getTransformAsArray(dummy)
					.map(value => value.toPrecision(6))
					.map(value => parseFloat(value))

				expect(result).to.be.eql(answer)
			})
		})

		describe('translate()', () => {
			it('should return a 4x4 matrix equal to CSS transform translate with one arg', () => {
				dummy.setAttribute('style', `${transformProperty}: translate(20px)`)
				const result = Rematrix.translate(20)
				const answer = getTransformAsArray(dummy)
				expect(result).to.be.eql(answer)
			})

			it('should return a 4x4 matrix equal to CSS transform translate with two args', () => {
				dummy.setAttribute('style', `${transformProperty}: translate(20px, 40px)`)
				const result = Rematrix.translate(20, 40)
				const answer = getTransformAsArray(dummy)
				expect(result).to.be.eql(answer)
			})
		})

		describe('translateX', () => {
			it('should return a 4x4 matrix equal to CSS transform translateX', () => {
				dummy.setAttribute('style', `${transformProperty}: translateX(20px)`)
				const result = Rematrix.translateX(20)
				const answer = getTransformAsArray(dummy)
				expect(result).to.be.eql(answer)
			})
		})

		describe('translateY', () => {
			it('should return a 4x4 matrix equal to CSS transform translateY', () => {
				dummy.setAttribute('style', `${transformProperty}: translateY(20px)`)
				const result = Rematrix.translateY(20)
				const answer = getTransformAsArray(dummy)
				expect(result).to.be.eql(answer)
			})
		})

		describe('translateZ', () => {
			it('should return a 4x4 matrix equal to CSS transform translateZ', () => {
				dummy.setAttribute('style', `${transformProperty}: translateZ(20px)`)
				const result = Rematrix.translateZ(20)
				const answer = getTransformAsArray(dummy)
				expect(result).to.be.eql(answer)
			})
		})

		after('remove dummy object', () => {
			document.body.removeChild(dummy)
		})
	})
})
