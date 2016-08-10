# Fett Breakpoints

> Convert Drupal 8's breakpoints (`*.breakpoints.yml`) to scss `$variables`.

## Install
```
npm install --save-dev https://github.com/jacerider/fett-breakpoints
```

## What it does
Converts this:
```yml
theme.small:
  label: breakpoint-small
  mediaQuery: 'all and (max-width: 500px)'
  weight: 1
  multipliers:
    - 1x

theme.medium:
  label: breakpoint-medium
  mediaQuery: 'all and (max-width: 700px)'
  weight: 1
  multipliers:
    - 1x
```
into this:
```scss
$breakpoints: (
  small: 500px,
  medium: 700px,
);
$breakpoint-classes: (small medium);
```

## Usage
```javascript
const fettBreakpoints = require('fett-breakpoints')

fettBreakpoints.read('./theme.breakpoints.yml')
  .pipe(fettBreakpoints.write('./scss/_breakpoints.scss'))
```

## Usage with gulp
```javascript
const gulp = require('gulp')
const rename = require('gulp-rename')
const fettBreakpoints = require('fett-breakpoints')

gulp.task('task', function () {
  return gulp.src('./breakpoints.yml')
    .pipe(fettBreakpoints.ymlToScss())
    .pipe(rename('_breakpoints.scss'))
    .pipe(gulp.dest('./scss'))
})
```
