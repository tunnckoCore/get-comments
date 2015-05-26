/*!
 * get-comments <https://github.com/tunnckoCore/get-comments>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var hasValue = require('has-value')

module.exports = function getComments (input, array) {
  var len = input.length, i = 0, commentStart = 0, line = 1, column = 0, number = 0
  var raw = '', code = ''
  var o = {start: 0, end: 0}
  var res = array ? [] : {}

  while (i < len) {
    var ch = input.charAt(i)
    var prev = input.charAt(i - 1)
    var next = input.charAt(i + 1)
    var post = input.charAt(i + 2)

    raw += ch

    if (prev !== ' ' && ch === '/' && next === '*' && post === '*') {
      o.type = 'Block'
      o.loc = {
        start: {
          line: line,
          column: column - 1
        }
      }
      o.start = commentStart = i
    }
    if (o.start && prev === '*' && ch === '/') {
      o.loc.end = {
        line: line,
        column: column
      }
      o.value = raw.slice(commentStart, i + 2)
      o.value = o.value.slice(2).slice(0, -2) // normalize
      o.api = o.value.indexOf('@api') !== -1
      o.end = i + 1
    }
    if (o.start && prev === '/' && /[\r\n]+/.test(ch)) {
      array ? res.push(o) : res[number++] = o

      // resets
      o = {start: 0, end: 0}
      commentStart = 0
    }
    if (hasValue(res)) {
      var last = array ? res[res.length - 1] : res[Object.keys(res).length - 1]
      if (last) {
        code = raw.slice(last.end + 1).replace(/^\n*/, '')
        code = code.split('\n\n').filter(Boolean)
        code = code[0]
        if (code) {
          last.after = code.trim()
        }
      }
    }
    if (/[\r\n]+/.test(ch)) {
      line++
      column = 0
    }

    column++
    i++
  }
  return res
}
