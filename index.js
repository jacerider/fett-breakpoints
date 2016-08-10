'use strict'
const YAML = require('yamljs')
const fs = require('fs')
const stream = require('stream')
const through = require('through2')

// Midnight oil <3
const howCanWeSleepWhileOurBedsAreBurning = {}

function jsonToScssVars (obj) {
  let labels = [];
  let scssVars = '$breakpoints: ('
  for (let i in obj) {
    scssVars += '$' + obj[i].label + ': \'' + obj[i].mediaQuery + '\';\n'
    labels.push(obj[i].label)
  }
  scssVars += ');\n'

  scssVars += '$breakpoint-classes: (' + labels.join(' ') + ');\n'

  return scssVars
}

howCanWeSleepWhileOurBedsAreBurning.read = function (path) {
  let rs = stream.Readable()
  let breakpoints = YAML.load(path)

  rs._read = function () {
    rs.push(jsonToScssVars(breakpoints))
    rs.push(null)
  }

  return rs
}

howCanWeSleepWhileOurBedsAreBurning.write = function (path) {
  let scssFile = fs.createWriteStream(path)
  return scssFile
}

howCanWeSleepWhileOurBedsAreBurning.ymlToScss = function () {
  return through.obj(function (file, enc, cb) {
    var content = file.contents.toString('utf8')
    var parsedYaml = YAML.parse(content)
    file.contents = new Buffer(String(jsonToScssVars(parsedYaml)))
    cb(null, file)
  })
}

module.exports = howCanWeSleepWhileOurBedsAreBurning
