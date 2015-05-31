/* @flow */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.shallowEq = shallowEq;
exports.shallowPropsDiff = shallowPropsDiff;
exports.assoc = assoc;
exports.hasIntersection = hasIntersection;

function shallowEq(a, b) {
  var keysA = Object.keys(a);
  var keysB = Object.keys(b);
  var i;
  var key;
  if (keysA.length !== keysB.length) {
    return false;
  }
  for (i = 0; i < keysA.length; i++) {
    key = keysA[i];
    if (keysB.indexOf(key) === -1 || a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}

function shallowPropsDiff(a, b) {
  var keysA = Object.keys(a);
  var keysB = Object.keys(b);
  var diff = [];
  var i;
  var key;
  for (i = 0; i < keysA.length; i++) {
    key = keysA[i];
    if (keysB.indexOf(key) === -1 || a[key] !== b[key]) {
      diff.push(key);
    }
  }
  for (i = 0; i < keysB.length; i++) {
    key = keysB[i];
    if (keysA.indexOf(key) === -1) {
      diff.push(key);
    }
  }
  return diff;
}

function assoc(key, value, source) {
  var keys = Object.keys(source);
  var result = Object.create(null);
  var i;
  for (i = 0; i < keys.length; i++) {
    result[keys[i]] = source[keys[i]];
  }
  result[key] = value;
  return result;
}

function hasIntersection(smaller, bigger) {
  var i;
  for (i = 0; i < smaller.length; i++) {
    if (bigger.indexOf(smaller[i]) !== -1) {
      return true;
    }
  }
  return false;
}