<p align="center">
  <a href="https://rematrix.now.sh" title="Visit Rematrix demo">
	  <img src="https://jlmakes.com/logos/svg/rematrix.svg" width="120px">
  </a>
</p>

<br>

<p align="center">
  <a href="https://rematrix.now.sh" title="Visit Rematrix demo">
	  <img src="https://jlmakes.com/logos/svg/rematrix-logotype.svg" alt="Rematrix" width="130px">
  </a>
</p>

<p align="center">Matrix transformations made easy.</p>

<p align="center">
	<a href="https://travis-ci.org/jlmakes/rematrix"><img src="https://img.shields.io/travis/jlmakes/rematrix.svg" alt="Build status"></a>
	<a href="https://coveralls.io/github/jlmakes/rematrix"><img src="https://img.shields.io/coveralls/jlmakes/rematrix.svg" alt="Coverage"></a>
	<a href="https://www.npmjs.com/package/rematrix"><img src="https://img.shields.io/npm/dm/rematrix.svg" alt="Downloads"></a>
	<a href="https://www.npmjs.com/package/rematrix"><img src="https://img.shields.io/npm/v/rematrix.svg" alt="Version"></a>
    <a href="https://github.com/jlmakes/rematrix/blob/master/src/index.js"><img src="https://img.shields.io/badge/min+gzip-1.3_kB-blue.svg" alt="1.3 kB min+gzip"></a>
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

> If you use this method in production, be sure to specify a fixed version number, and use the minified distribution; e.g: `https://unpkg.com/rematrix@0.7.2/dist/rematrix.min.js`. This improves performance, but also prevents library changes from impacting your project.

This will create the global variable `Rematrix`.

## Module

```bash
npm install rematrix
```

#### CommonJS

```js
const Rematrix = require('rematrix')
```

#### ES2015

```js
import * as Rematrix from 'rematrix'
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
let r1 = Rematrix.rotateZ(20)
let r2 = Rematrix.rotateZ(25)

let product = Rematrix.multiply(r1, r2)
```

Here `product` describes the same array of 16 values (seen above):

```js
[0.707107, 0.707107, 0, 0, -0.707107, 0.707107, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
```

#### Better Multiplication (Using Reduce)

There’s a good chance we’ll need to multiply quite a few matrices together, so its helpful to store them in an array in order to use `Array.prototype.reduce` to multiply them all in one line:

```js
let r1 = Rematrix.rotateZ(20)
let r2 = Rematrix.rotateZ(65)
let r3 = Rematrix.rotateZ(-40)

let product = [r1, r2, r3].reduce(Rematrix.multiply)
```

> Order is important. For example, rotating 45° along the Z-axis, followed by translating 500 pixels along the Y-axis... is not the same as translating 500 pixels along the Y-axis, followed by rotating 45° along on the Z-axis.

## Preserving Transforms

Before applying any of our transforms, we should capture the existing transform of our element using `Rematrix.fromString()`, e.g:

```js
let element = document.querySelector('#example')
let style = getComputedStyle(element).transform

let transform = Rematrix.fromString(style)

let r1 = Rematrix.rotateZ(20)
let r2 = Rematrix.rotateZ(65)
let r3 = Rematrix.rotateZ(-40)

let product = [transform, r1, r2, r3].reduce(Rematrix.multiply)
```

By passing the computed transform styles to `Rematrix.fromString()`, we create a matrix of the existing transform. We can now factor this into our multiplication.

> The existing transformation has been _deliberately_ placed at the start of the array to ensure the computed transform is the foundation for the succeeding transformations.

## Applying Transforms

We can turn our matrix into valid CSS using `Rematrix.toString()`, which we can apply to our element’s style, e.g:

```js
element.style.transform = Rematrix.toString(product)
```

#### _And that concludes this introduction to Rematrix. Please explore the finished [Live Demo on JSFiddle](https://jsfiddle.net/ufrLymvo/)._

<br>

<br>

<a name="Rematrix"></a>

# API Reference

* [format(source)](#Rematrix.format)
* [fromString(source)](#Rematrix.fromString)
* [identity()](#Rematrix.identity)
* [inverse(source)](#Rematrix.inverse)
* [multiply(matrixA, matrixB)](#Rematrix.multiply)
* [perspective(distance)](#Rematrix.perspective)
* [rotate(angle)](#Rematrix.rotate)
* [rotateX(angle)](#Rematrix.rotateX)
* [rotateY(angle)](#Rematrix.rotateY)
* [rotateZ(angle)](#Rematrix.rotateZ)
* [scale(scalar, [scalarY])](#Rematrix.scale)
* [scaleX(scalar)](#Rematrix.scaleX)
* [scaleY(scalar)](#Rematrix.scaleY)
* [scaleZ(scalar)](#Rematrix.scaleZ)
* [skew(angleX, [angleY])](#Rematrix.skew)
* [skewX(angle)](#Rematrix.skewX)
* [skewY(angle)](#Rematrix.skewY)
* [toString(source)](#Rematrix.toString)
* [translate(distanceX, [distanceY])](#Rematrix.translate)
* [translate3d(distanceX, distanceY, distanceZ)](#Rematrix.translate3d)
* [translateX(distance)](#Rematrix.translateX)
* [translateY(distance)](#Rematrix.translateY)
* [translateZ(distance)](#Rematrix.translateZ)


<a name="Rematrix.format"></a>
<br>
### format(source) ⇒ `number[]`

Transformation matrices in the browser come in two flavors:

* `matrix` using 6 values (short)
* `matrix3d` using 16 values (long)

This utility follows this [conversion guide](https://goo.gl/EJlUQ1)
to expand short form matrices to their equivalent long form.

| Param  | Description                      |
| ------ | -------------------------------- |
| source | A `number[]` with length 6 or 16 |


<a name="Rematrix.fromString"></a>
<br>
### fromString(source) ⇒ `number[]`

Converts a CSS Transform to array.

| Param  | Description                                                    |
| ------ | -------------------------------------------------------------- |
| source | A `string` containing a `matrix` or `matrix3d` property value. |


<a name="Rematrix.identity"></a>
<br>
### identity() ⇒ `number[]`

Returns a matrix representing no transformation. The product of any matrix
multiplied by the identity matrix will be the original matrix.

> **Tip:** Similar to how `5 * 1 === 5`, where `1` is the identity.

<a name="Rematrix.inverse"></a>
<br>
### inverse(source) ⇒ `number[]`

Returns a matrix representing the inverse transformation of the source
matrix. The product of any matrix multiplied by its inverse will be the
identity matrix.

> **Tip:** Similar to how `5 * (1/5) === 1`, where `1/5` is the inverse.

| Param  | Description                      |
| ------ | -------------------------------- |
| source | A `number[]` with length 6 or 16 |


<a name="Rematrix.multiply"></a>
<br>
### multiply(matrixA, matrixB) ⇒ `number[]`

Returns a matrix representing the combined transformations
of both arguments.

> **Note:** Order is important. For example, rotating 45° along the Z-axis,
> followed by translating 500 pixels along the Y-axis...
> Is not the same as translating 500 pixels along the Y-axis,
> followed by rotating 45° along on the Z-axis.

| Param   | Description                      |
| ------- | -------------------------------- |
| matrixA | A `number[]` with length 6 or 16 |
| matrixB | A `number[]` with length 6 or 16 |


<a name="Rematrix.perspective"></a>
<br>
### perspective(distance) ⇒ `number[]`

Returns a matrix representing perspective.

| Param    | Description                    |
| -------- | ------------------------------ |
| distance | A `number` measured in pixels. |


<a name="Rematrix.rotate"></a>
<br>
### rotate(angle) ⇒ `number[]`

Returns a matrix representing Z-axis rotation.

> **Tip:** This is just an alias for `Rematrix.rotateZ` for parity with CSS

| Param | Description                     |
| ----- | ------------------------------- |
| angle | A `number` measured in degrees. |


<a name="Rematrix.rotateX"></a>
<br>
### rotateX(angle) ⇒ `number[]`

Returns a matrix representing X-axis rotation.

| Param | Description                     |
| ----- | ------------------------------- |
| angle | A `number` measured in degrees. |


<a name="Rematrix.rotateY"></a>
<br>
### rotateY(angle) ⇒ `number[]`

Returns a matrix representing Y-axis rotation.

| Param | Description                     |
| ----- | ------------------------------- |
| angle | A `number` measured in degrees. |


<a name="Rematrix.rotateZ"></a>
<br>
### rotateZ(angle) ⇒ `number[]`

Returns a matrix representing Z-axis rotation.

| Param | Description                     |
| ----- | ------------------------------- |
| angle | A `number` measured in degrees. |


<a name="Rematrix.scale"></a>
<br>
### scale(scalar, [scalarY]) ⇒ `number[]`

Returns a matrix representing 2D scaling. The first argument
is used for both X and Y-axis scaling, unless an optional
second argument is provided to explicitly define Y-axis scaling.

| Param     | Description                               |
| --------- | ----------------------------------------- |
| scalar    | A `number` decimal multiplier.            |
| [scalarY] | A `number` decimal multiplier. (Optional) |


<a name="Rematrix.scaleX"></a>
<br>
### scaleX(scalar) ⇒ `number[]`

Returns a matrix representing X-axis scaling.

| Param  | Description                    |
| ------ | ------------------------------ |
| scalar | A `number` decimal multiplier. |


<a name="Rematrix.scaleY"></a>
<br>
### scaleY(scalar) ⇒ `number[]`

Returns a matrix representing Y-axis scaling.

| Param  | Description                    |
| ------ | ------------------------------ |
| scalar | A `number` decimal multiplier. |


<a name="Rematrix.scaleZ"></a>
<br>
### scaleZ(scalar) ⇒ `number[]`

Returns a matrix representing Z-axis scaling.

| Param  | Description                    |
| ------ | ------------------------------ |
| scalar | A `number` decimal multiplier. |


<a name="Rematrix.skew"></a>
<br>
### skew(angleX, [angleY]) ⇒ `number[]`

Returns a matrix representing shear. The first argument
defines X-axis shearing, and an optional second argument
defines Y-axis shearing.

| Param    | Description                                |
| -------- | ------------------------------------------ |
| angleX   | A `number` measured in degrees.            |
| [angleY] | A `number` measured in degrees. (Optional) |


<a name="Rematrix.skewX"></a>
<br>
### skewX(angle) ⇒ `number[]`

Returns a matrix representing X-axis shear.

| Param | Description                     |
| ----- | ------------------------------- |
| angle | A `number` measured in degrees. |


<a name="Rematrix.skewY"></a>
<br>
### skewY(angle) ⇒ `number[]`

Returns a matrix representing Y-axis shear.

| Param | Description                     |
| ----- | ------------------------------- |
| angle | A `number` measured in degrees. |


<a name="Rematrix.toString"></a>
<br>
### toString(source) ⇒ `string`

Returns a CSS Transform property value equivalent to the source matrix.

| Param  | Description                      |
| ------ | -------------------------------- |
| source | A `number[]` with length 6 or 16 |


<a name="Rematrix.translate"></a>
<br>
### translate(distanceX, [distanceY]) ⇒ `number[]`

Returns a matrix representing 2D translation. The first
argument defines X-axis translation, and an optional second
argument defines Y-axis translation.

| Param       | Description                               |
| ----------- | ----------------------------------------- |
| distanceX   | A `number` measured in pixels.            |
| [distanceY] | A `number` measured in pixels. (Optional) |


<a name="Rematrix.translate3d"></a>
<br>
### translate3d(distanceX, distanceY, distanceZ) ⇒ `number[]`

Returns a matrix representing 3D translation. The first
argument defines X-axis translation, the second argument defines Y-axis
translation, and the third argument defines Z-axis translation.

| Param     | Description                    |
| ----------| ------------------------------ |
| distanceX | A `number` measured in pixels. |
| distanceY | A `number` measured in pixels. |
| distanceZ | A `number` measured in pixels. |


<a name="Rematrix.translateX"></a>
<br>
### translateX(distance) ⇒ `number[]`

Returns a matrix representing X-axis translation.

| Param    | Description                    |
| -------- | ------------------------------ |
| distance | A `number` measured in pixels. |


<a name="Rematrix.translateY"></a>
<br>
### translateY(distance) ⇒ `number[]`

Returns a matrix representing Y-axis translation.

| Param    | Description                    |
| -------- | ------------------------------ |
| distance | A `number` measured in pixels. |


<a name="Rematrix.translateZ"></a>
<br>
### translateZ(distance) ⇒ `number[]`

Returns a matrix representing Z-axis translation.

| Param    | Description                    |
| -------- | ------------------------------ |
| distance | A `number` measured in pixels. |

<br>

<br>

---

Copyright 2021 Julian Lloyd.
<br>
Open source under the [MIT License](https://github.com/jlmakes/rematrix/blob/master/LICENSE).
