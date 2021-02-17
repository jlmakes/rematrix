# Change Log

## [0.7.2] - 2021-02-08

### Fixed

* `fromString()` now recognizes `"none"` and `""` as property values.

## [0.7.1] - 2020-12-31

### Fixed

* `fromString()` parsing error.

## [0.7.0] - 2020-05-04

### Fixed

* Removed features that break IE10 and IE11.

## 0.6.0 - Bad Release

## [0.5.0] - 2020-03-02

### Added

* TypeScript declaration file.

### Changed

* **Breaking:** Dropped support for Node `< 10.0.0`.
* **Breaking:** `fromString()` throws instead of returning an identity matrix as fallback.
* **Breaking:** Removed deprecated `parse` method.

### Fixed

* Improved IntelliSense formatting.

## [0.4.1] - 2019-07-05

### Fixed

* `translate3d()` no longer breaks when passed `0`.

## [0.4.0] - 2019-07-04

### Added

* New `translate3d()` method.
* New `perspective()` method.

### Changed

* Rename `parse()` method to `fromString()`.
* Drop support for Bower.
* Upgrade dependencies.

## [0.3.0] - 2018-08-30

### Added

* New `toString()` method.

## [0.2.3] - 2018-08-14

### Changed

* Update readme formatting.
* Update copyright year.

## [0.2.2] - 2018-01-05

### Changed

* PhantomJS has been replaced with Headless Chrome.
* The `coverage` environment variable is now cross-platform.
* The minified distribution now uses a condensed license format.

## [0.2.1] - 2017-10-08

### Added

* Source now formatted by prettier.

## [0.2.0] - 2017-09-21

### Added

* New `rotate()` method, aliases `rotateZ()`.

### Fixed

* `scale()` no longer ignores `0` as a second argument.

## [0.1.3] - 2017-08-25

* Update dependencies for breaking change in Rollup v0.48.

## [0.1.2] - 2017-07-30

### Fixed

* Update dependencies for breaking change in Rollup v0.45.

## [0.1.1] - 2017-05-30

### Changed

* Update documentation for accuracy and clarity.

## [0.1.0] - 2017-05-25

Hello world!

[0.7.2]: https://github.com/jlmakes/rematrix/compare/0.7.1...0.7.2
[0.7.1]: https://github.com/jlmakes/rematrix/compare/0.7.0...0.7.1
[0.7.0]: https://github.com/jlmakes/rematrix/compare/0.5.0...0.7.0
[0.5.0]: https://github.com/jlmakes/rematrix/compare/0.4.1...0.5.0
[0.4.1]: https://github.com/jlmakes/rematrix/compare/0.4.0...0.4.1
[0.4.0]: https://github.com/jlmakes/rematrix/compare/0.3.0...0.4.0
[0.3.0]: https://github.com/jlmakes/rematrix/compare/0.2.3...0.3.0
[0.2.3]: https://github.com/jlmakes/rematrix/compare/0.2.2...0.2.3
[0.2.2]: https://github.com/jlmakes/rematrix/compare/0.2.1...0.2.2
[0.2.1]: https://github.com/jlmakes/rematrix/compare/0.2.0...0.2.1
[0.2.0]: https://github.com/jlmakes/rematrix/compare/0.1.3...0.2.0
[0.1.3]: https://github.com/jlmakes/rematrix/compare/0.1.2...0.1.3
[0.1.2]: https://github.com/jlmakes/rematrix/compare/0.1.1...0.1.2
[0.1.1]: https://github.com/jlmakes/rematrix/compare/0.1.0...0.1.1
[0.1.0]: https://github.com/jlmakes/rematrix/tree/0.1.0
