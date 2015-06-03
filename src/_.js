/* @flow */

import type {map} from './types'

export function shallowEq(a: map, b: map): boolean {
  var keysA = Object.keys(a)
  var keysB = Object.keys(b)
  var i
  var key
  if (keysA.length !== keysB.length) {
    return false
  }
  for (i = 0; i < keysA.length; i++) {
    key = keysA[i]
    if (keysB.indexOf(key) === -1 || a[key] !== b[key]) {
      return false
    }
  }
  return true
}

export function shallowPropsDiff(a: map, b: map): Array<string> {
  var keysA = Object.keys(a)
  var keysB = Object.keys(b)
  var diff = []
  var i
  var key
  for (i = 0; i < keysA.length; i++) {
    key = keysA[i]
    if (keysB.indexOf(key) === -1 || a[key] !== b[key]) {
      diff.push(key)
    }
  }
  for (i = 0; i < keysB.length; i++) {
    key = keysB[i]
    if (keysA.indexOf(key) === -1) {
      diff.push(key)
    }
  }
  return diff
}

export function assoc(key: string, value: any, source: map): map {
  var keys = Object.keys(source)
  var result = Object.create(null)
  var i
  for (i = 0; i < keys.length; i++) {
    result[keys[i]] = source[keys[i]]
  }
  result[key] = value
  return result
}

export function hasIntersection(smaller: Array<any>, bigger: Array<any>): boolean {
  var i
  for (i = 0; i < smaller.length; i++) {
    if (bigger.indexOf(smaller[i]) !== -1) {
      return true
    }
  }
  return false
}

export function pick(keys: Array<string>, source: map): map {
  var result = Object.create(null)
  var i
  for (i = 0; i < keys.length; i++) {
    result[keys[i]] = source[keys[i]]
  }
  return result
}

export function eqArrays(a: Array<any>, b: Array<any>): boolean {
  var i
  if (a.length !== b.length) {
    return false
  }
  for (i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}
