'use strict'
const YAML = require('yamljs')
const fs = require('fs')
const path = require('path')
const stream = require('stream')
const through = require('through2')

const fettBreakpoints = {}

function jsonToScssVars (obj, path) {
  let labels = [];
  let scssVars = '/**\n'
  let mediaQuery;
  scssVars += ' * This file is dynamically generated from:\n'
  scssVars += ' * ' + path + '\n'
  scssVars += ' */\n\n'
  scssVars += '$breakpoints: (\n'
  for (let i in obj) {
    mediaQuery = obj[i].mediaQuery.match(/([0-9]+em|[0-9]+px)(?=[^0-9]*$)/);
    mediaQuery = mediaQuery && mediaQuery[0] ? mediaQuery[0] : '0';
    scssVars += '  ' + obj[i].label + ': ' + mediaQuery + ','  + ' // converted from "' + (obj[i].mediaQuery || 0) + '"\n'
    labels.push(obj[i].label)
  }
  scssVars += ');\n'
  scssVars += '$breakpoint-classes: (' + labels.join(' ') + ');\n'
  return scssVars
}

fettBreakpoints.read = function (path) {
  let rs = stream.Readable()
  let breakpoints = YAML.load(path)
  rs._read = function () {
    rs.push(jsonToScssVars(breakpoints, path))
    rs.push(null)
  }
  return rs
}

fettBreakpoints.write = function (path) {
  let scssFile = fs.createWriteStream(path)
  return scssFile
}

fettBreakpoints.ymlToScss = function () {
  return through.obj(function (file, enc, cb) {
    var content = file.contents.toString('utf8')
    var parsedYaml = YAML.parse(content)
    var relative = path.relative(file.cwd, file.path);
    file.contents = new Buffer(String(jsonToScssVars(parsedYaml, relative)))
    cb(null, file)
  })
}

module.exports = fettBreakpoints
