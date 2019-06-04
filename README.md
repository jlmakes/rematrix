<p align="center">
  <a href="https://rematrix.now.sh" title="Visit Rematrix demo">
	  <img src="https://jlmak.es/logos/svg/rematrix.svg" width="120px" >
  </a>
</p>

<br>

<p align="center">
  <a href="https://rematrix.now.sh" title="Visit Rematrix demo">
	  <img src="https://jlmak.es/logos/svg/rematrix-logotype.svg" alt="Rematrix" width="130px" >
  </a>
</p>

<p align="center">Matrix transformations made easy.</p>

<p align="center">
	<a href="https://travis-ci.org/jlmakes/rematrix"><img src="https://img.shields.io/travis/jlmakes/rematrix.svg" alt="Build status"></a>
	<a href="https://coveralls.io/github/jlmakes/rematrix"><img src="https://img.shields.io/coveralls/jlmakes/rematrix.svg" alt="Coverage"></a>
	<a href="https://www.npmjs.com/package/rematrix"><img src="https://img.shields.io/npm/v/rematrix.svg" alt="Version"></a>
    <a href="https://github.com/jlmakes/rematrix/blob/master/src/index.js"><img src="https://img.shields.io/badge/min+gzip-1.2_kB-blue.svg" alt="1.2 kB min+gzip"></a>
	<a href="https://github.com/jlmakes/rematrix/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT license"></a>
</p>
<p align="center">
	<a href="https://saucelabs.com/u/rematrix">
		<img src="https://saucelabs.com/browser-matrix/rematrix.svg" alt="Browser compatibility matrix" width="100%">
	</a>
</p>

<br>

<br>

# Introduction

Imagine a HTML element that may have a CSS transform applied. If we want to add 45° of Z-rotation, we have no way to handle this safely in CSS—we’d just risk overwriting an existing transform. So we decide to use JavaScript, and check the current transform...

`getComputedStyle(element)` returns the computed styles, and inspecting the `transform` property shows:

```js
'matrix3d(0.707107, 0.707107, 0, 0, -0.707107, 0.707107, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)'
```

It’s here we discover that browsers actually use [transformation matrices](https://en.wikipedia.org/wiki/Transformation_matrix) under the hood to describe rotation, translation, scale and shear. This means if we wish to manage CSS transforms with JavaScript (without overwriting existing transformations), we’re stuck working with matrices.

**Rematrix** is an easy way to create and combine matrix transformations that work seamlessly with CSS.

<br>

# Installation

## Browser

A simple and fast way to get started is to include this script on your page:

```html
<script src="https://unpkg.com/rematrix"></script>
```

> If you use this method in production, be sure to specify a fixed version number, and use the minified distribution; e.g: `https://unpkg.com/rematrix@1.0.0/dist/rematrix.min.js`. This improves performance, but also prevents library changes from impacting your project.

This will create the global variable `Rematrix`.

## Module

```bash
npm install rematrix
```

#### CommonJS

```js
const Rematrix = require('rematrix');
```

#### ES2015

```js
import * as Rematrix from 'rematrix';
```

<br>

<br>

# Guide

## Creating Transforms

Most API methods look a lot like CSS, so for example, in CSS if we would write `transform: rotateZ(45deg)`, we can create the same transformation in JavaScript using Rematrix like this:

```js
Rematrix.rotateZ(45)
```

This returns a 45° rotation along the Z-axis, represented as an array of 16 values:

```js
[0.707107, 0.707107, 0, 0, -0.707107, 0.707107, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
```

These 16 values represent our **transformation matrix** in [column-major order](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix3d).

<br>

## Combining Transforms (Using Multiplication)

Where Rematrix really outshines CSS, is the ability to combine transforms — using **matrix multiplication**. We’ll recreate the same 45° rotation along the Z-axis, but using separate matrices this time:

```js
var r1 = Rematrix.rotateZ(20);
var r2 = Rematrix.rotateZ(25);

var product = Rematrix.multiply(r1, r2);
```

Here `product` describes the same array of 16 values (seen above):

```js
[0.707107, 0.707107, 0, 0, -0.707107, 0.707107, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
```

#### Better Multiplication (Using Reduce)

There’s a good chance we’ll need to multiply quite a few matrices together, so its helpful to store them in an array in order to use `Array.prototype.reduce` to multiply them all in one line:

```js
var r1 = Rematrix.rotateZ(20);
var r2 = Rematrix.rotateZ(65);
var r3 = Rematrix.rotateZ(-40);

var product = [r1, r2, r3].reduce(Rematrix.multiply);
```

> Order is very important. For example, rotating 45° along the Z-axis, followed by translating 500 pixels along the Y-axis... is not the same as translating 500 pixels along the Y-axis, followed by rotating 45° along on the Z-axis.

## Preserving Transforms

Before applying any of our transforms, we should capture the existing transform of our element using `Rematrix.fromString()`, e.g:

```js
var element = document.querySelector('#example');
var style = getComputedStyle(element).transform;

var transform = Rematrix.fromString(style);

var r1 = Rematrix.rotateZ(20);
var r2 = Rematrix.rotateZ(65);
var r3 = Rematrix.rotateZ(-40);

var product = [transform, r1, r2, r3].reduce(Rematrix.multiply);
```

By passing the computed transform styles to `Rematrix.fromString()`, we create a matrix of the existing transform. We can now factor this into our multiplication.

> The existing transformation has been _deliberately_ placed at the start of the array to ensure the computed transform is the foundation for the succeeding transformations.

## Applying Transforms

We can turn our matrix into valid CSS using `Rematrix.toString()`, which we can apply to our element’s style, e.g:

```js
element.style.transform = Rematrix.toString(product);
```

#### _And that concludes this introduction to Rematrix. Please explore the finished [Live Demo on JSFiddle](https://jsfiddle.net/utoqhkzc/)._

<br>

<br>

<a name="module_Rematrix"></a>

# API Reference

* [Rematrix](#module_Rematrix)
  * [.fromString(source)](#module_Rematrix.fromString)
  * [.format(source)](#module_Rematrix.format)
  * [.identity()](#module_Rematrix.identity)
  * [.inverse(source)](#module_Rematrix.inverse)
  * [.multiply(m, x)](#module_Rematrix.multiply)
  * [.rotate(angle)](#module_Rematrix.rotate)
  * [.rotateX(angle)](#module_Rematrix.rotateX)
  * [.rotateY(angle)](#module_Rematrix.rotateY)
  * [.rotateZ(angle)](#module_Rematrix.rotateZ)
  * [.scale(scalar, [scalarY])](#module_Rematrix.scale)
  * [.scaleX(scalar)](#module_Rematrix.scaleX)
  * [.scaleY(scalar)](#module_Rematrix.scaleY)
  * [.scaleZ(scalar)](#module_Rematrix.scaleZ)
  * [.skew(angleX, [angleY])](#module_Rematrix.skew)
  * [.skewX(angle)](#module_Rematrix.skewX)
  * [.skewY(angle)](#module_Rematrix.skewY)
  * [.toString(source)](#module_Rematrix.toString)
  * [.translate(distanceX, [distanceY])](#module_Rematrix.translate)
  * [.translateX(distance)](#module_Rematrix.translateX)
  * [.translateY(distance)](#module_Rematrix.translateY)
  * [.translateZ(distance)](#module_Rematrix.translateZ)
  * [.translate3d(distanceX, distanceY, distanceZ)](#module_Rematrix.translate3d)

<a name="module_Rematrix.fromString"></a>

<br>

### Rematrix.fromString(source) ⇒ <code>array</code>

Attempts to return a 4x4 matrix describing the CSS transform matrix passed
in, but will return the identity matrix as a fallback.

**Kind**: static method of <code>[Rematrix](#module_Rematrix)</code>

| Param  | Type                | Description                                 |
| ------ | ------------------- | ------------------------------------------- |
| source | <code>string</code> | `matrix` or `matrix3d` CSS Transform value. |

<a name="module_Rematrix.format"></a>

<br>

### Rematrix.format(source) ⇒ <code>array</code>

Transformation matrices in the browser come in two flavors:

* `matrix` using 6 values (short)
* `matrix3d` using 16 values (long)

This utility follows this [conversion guide](https://goo.gl/EJlUQ1)
to expand short form matrices to their equivalent long form.

**Kind**: static method of <code>[Rematrix](#module_Rematrix)</code>

| Param  | Type               | Description                                |
| ------ | ------------------ | ------------------------------------------ |
| source | <code>array</code> | Accepts both short and long form matrices. |

<a name="module_Rematrix.identity"></a>

<br>

### Rematrix.identity() ⇒ <code>array</code>

Returns a matrix representing no transformation. The product of any matrix
multiplied by the identity matrix will be the original matrix.

> **Tip:** Similar to how `5 * 1 === 5`, where `1` is the identity.

**Kind**: static method of <code>[Rematrix](#module_Rematrix)</code>
<a name="module_Rematrix.inverse"></a>

<br>

### Rematrix.inverse(source) ⇒ <code>array</code>

Returns a matrix describing the inverse transformation of the source
matrix. The product of any matrix multiplied by its inverse will be the
identity matrix.

> **Tip:** Similar to how `5 * (1/5) === 1`, where `1/5` is the inverse.

**Kind**: static method of <code>[Rematrix](#module_Rematrix)</code>

| Param  | Type               | Description                                |
| ------ | ------------------ | ------------------------------------------ |
| source | <code>array</code> | Accepts both short and long form matrices. |

<a name="module_Rematrix.multiply"></a>

<br>

### Rematrix.multiply(m, x) ⇒ <code>array</code>

Returns a 4x4 matrix describing the combined transformations
of both arguments.

> **Note:** Order is very important. For example, rotating 45°
> along the Z-axis, followed by translating 500 pixels along the
> Y-axis... is not the same as translating 500 pixels along the
> Y-axis, followed by rotating 45° along on the Z-axis.

**Kind**: static method of <code>[Rematrix](#module_Rematrix)</code>

| Param | Type               | Description                                |
| ----- | ------------------ | ------------------------------------------ |
| m     | <code>array</code> | Accepts both short and long form matrices. |
| x     | <code>array</code> | Accepts both short and long form matrices. |

<a name="module_Rematrix.rotate"></a>

<br>

### Rematrix.rotate(angle) ⇒ <code>array</code>

Returns a 4x4 matrix describing Z-axis rotation.

> **Tip:** This is just an alias for `Rematrix.rotateZ` for parity with CSS

**Kind**: static method of <code>[Rematrix](#module_Rematrix)</code>

| Param | Type                | Description          |
| ----- | ------------------- | -------------------- |
| angle | <code>number</code> | Measured in degrees. |

<a name="module_Rematrix.rotateX"></a>

<br>

### Rematrix.rotateX(angle) ⇒ <code>array</code>

Returns a 4x4 matrix describing X-axis rotation.

**Kind**: static method of <code>[Rematrix](#module_Rematrix)</code>

| Param | Type                | Description          |
| ----- | ------------------- | -------------------- |
| angle | <code>number</code> | Measured in degrees. |

<a name="module_Rematrix.rotateY"></a>

<br>

### Rematrix.rotateY(angle) ⇒ <code>array</code>

Returns a 4x4 matrix describing Y-axis rotation.

**Kind**: static method of <code>[Rematrix](#module_Rematrix)</code>

| Param | Type                | Description          |
| ----- | ------------------- | -------------------- |
| angle | <code>number</code> | Measured in degrees. |

<a name="module_Rematrix.rotateZ"></a>

<br>

### Rematrix.rotateZ(angle) ⇒ <code>array</code>

Returns a 4x4 matrix describing Z-axis rotation.

**Kind**: static method of <code>[Rematrix](#module_Rematrix)</code>

| Param | Type                | Description          |
| ----- | ------------------- | -------------------- |
| angle | <code>number</code> | Measured in degrees. |

<a name="module_Rematrix.scale"></a>

<br>

### Rematrix.scale(scalar, [scalarY]) ⇒ <code>array</code>

Returns a 4x4 matrix describing 2D scaling. The first argument
is used for both X and Y-axis scaling, unless an optional
second argument is provided to explicitly define Y-axis scaling.

**Kind**: static method of <code>[Rematrix](#module_Rematrix)</code>

| Param     | Type                | Description         |
| --------- | ------------------- | ------------------- |
| scalar    | <code>number</code> | Decimal multiplier. |
| [scalarY] | <code>number</code> | Decimal multiplier. |

<a name="module_Rematrix.scaleX"></a>

<br>

### Rematrix.scaleX(scalar) ⇒ <code>array</code>

Returns a 4x4 matrix describing X-axis scaling.

**Kind**: static method of <code>[Rematrix](#module_Rematrix)</code>

| Param  | Type                | Description         |
| ------ | ------------------- | ------------------- |
| scalar | <code>number</code> | Decimal multiplier. |

<a name="module_Rematrix.scaleY"></a>

<br>

### Rematrix.scaleY(scalar) ⇒ <code>array</code>

Returns a 4x4 matrix describing Y-axis scaling.

**Kind**: static method of <code>[Rematrix](#module_Rematrix)</code>

| Param  | Type                | Description         |
| ------ | ------------------- | ------------------- |
| scalar | <code>number</code> | Decimal multiplier. |

<a name="module_Rematrix.scaleZ"></a>

<br>

### Rematrix.scaleZ(scalar) ⇒ <code>array</code>

Returns a 4x4 matrix describing Z-axis scaling.

**Kind**: static method of <code>[Rematrix](#module_Rematrix)</code>

| Param  | Type                | Description         |
| ------ | ------------------- | ------------------- |
| scalar | <code>number</code> | Decimal multiplier. |

<a name="module_Rematrix.skew"></a>

<br>

### Rematrix.skew(angleX, [angleY]) ⇒ <code>array</code>

Returns a 4x4 matrix describing shear. The first argument
defines X-axis shearing, and an optional second argument
defines Y-axis shearing.

**Kind**: static method of <code>[Rematrix](#module_Rematrix)</code>

| Param    | Type                | Description          |
| -------- | ------------------- | -------------------- |
| angleX   | <code>number</code> | Measured in degrees. |
| [angleY] | <code>number</code> | Measured in degrees. |

<a name="module_Rematrix.skewX"></a>

<br>

### Rematrix.skewX(angle) ⇒ <code>array</code>

Returns a 4x4 matrix describing X-axis shear.

**Kind**: static method of <code>[Rematrix](#module_Rematrix)</code>

| Param | Type                | Description          |
| ----- | ------------------- | -------------------- |
| angle | <code>number</code> | Measured in degrees. |

<a name="module_Rematrix.skewY"></a>

<br>

### Rematrix.skewY(angle) ⇒ <code>array</code>

Returns a 4x4 matrix describing Y-axis shear.

**Kind**: static method of <code>[Rematrix](#module_Rematrix)</code>

| Param | Type                | Description         |
| ----- | ------------------- | ------------------- |
| angle | <code>number</code> | Measured in degrees |

<a name="module_Rematrix.toString"></a>

<br>

### Rematrix.toString(source) ⇒ <code>string</code>

Returns a CSS Transform property value equivalent to the source matrix.

**Kind**: static method of <code>[Rematrix](#module_Rematrix)</code>

| Param  | Type               | Description                                |
| ------ | ------------------ | ------------------------------------------ |
| source | <code>array</code> | Accepts both short and long form matrices. |

<a name="module_Rematrix.translate"></a>

<br>

### Rematrix.translate(distanceX, [distanceY]) ⇒ <code>array</code>

Returns a 4x4 matrix describing 2D translation. The first
argument defines X-axis translation, and an optional second
argument defines Y-axis translation.

**Kind**: static method of <code>[Rematrix](#module_Rematrix)</code>

| Param       | Type                | Description         |
| ----------- | ------------------- | ------------------- |
| distanceX   | <code>number</code> | Measured in pixels. |
| [distanceY] | <code>number</code> | Measured in pixels. |

<a name="module_Rematrix.translateX"></a>

<br>

### Rematrix.translateX(distance) ⇒ <code>array</code>

Returns a 4x4 matrix describing X-axis translation.

**Kind**: static method of <code>[Rematrix](#module_Rematrix)</code>

| Param    | Type                | Description         |
| -------- | ------------------- | ------------------- |
| distance | <code>number</code> | Measured in pixels. |

<a name="module_Rematrix.translateY"></a>

<br>

### Rematrix.translateY(distance) ⇒ <code>array</code>

Returns a 4x4 matrix describing Y-axis translation.

**Kind**: static method of <code>[Rematrix](#module_Rematrix)</code>

| Param    | Type                | Description         |
| -------- | ------------------- | ------------------- |
| distance | <code>number</code> | Measured in pixels. |

<a name="module_Rematrix.translateZ"></a>

<br>

### Rematrix.translateZ(distance) ⇒ <code>array</code>

Returns a 4x4 matrix describing Z-axis translation.

**Kind**: static method of <code>[Rematrix](#module_Rematrix)</code>

| Param    | Type                | Description         |
| -------- | ------------------- | ------------------- |
| distance | <code>number</code> | Measured in pixels. |

<a name="module_Rematrix.translate3d"></a>

<br>

### Rematrix.translate3d(distanceX, distanceY, distanceZ) ⇒ <code>array</code>

Returns a 4x4 matrix describing 3D translation. The first
argument defines X-axis translation, the second argument defines Y-axis
translation, and the third argument defines Z-axis translation.

**Kind**: static method of <code>[Rematrix](#module_Rematrix)</code>

| Param     | Type                | Description         |
| --------- | ------------------- | ------------------- |
| distanceX | <code>number</code> | Measured in pixels. |
| distanceY | <code>number</code> | Measured in pixels. |
| distanceZ | <code>number</code> | Measured in pixels. |

<br>

<br>

---

Copyright 2018 Julian Lloyd
<br>
Open source under the [MIT License](https://github.com/jlmakes/rematrix/blob/master/LICENSE).
