/* @flow */

import {shallowEq, shallowPropsDiff, assign, hasIntersection} from '../src/_'

describe('shallowEq', () => {
  it('should work', () => {
    expect(shallowEq({}, {})).toBe(true);
    expect(shallowEq({a: 1}, {})).toBe(false);
    expect(shallowEq({}, {a: 1})).toBe(false);
    expect(shallowEq({a: 2}, {a: 1})).toBe(false);
    expect(shallowEq({a: 2}, {a: 2})).toBe(true);
    expect(shallowEq({a: 2, b: 1}, {a: 2})).toBe(false);
    expect(shallowEq({a: 2}, {a: 2, b: 1})).toBe(false);
    expect(shallowEq({a: 2, b: 2}, {a: 2, b: 1})).toBe(false);
    expect(shallowEq({a: 2, b: 2}, {a: 2, b: 2})).toBe(true);
  })
})

describe('shallowPropsDiff', () => {
  it('should work', () => {
    expect(shallowPropsDiff({}, {})).toEqual([]);
    expect(shallowPropsDiff({a: 1}, {})).toEqual(['a']);
    expect(shallowPropsDiff({}, {a: 1})).toEqual(['a']);
    expect(shallowPropsDiff({a: 2}, {a: 1})).toEqual(['a']);
    expect(shallowPropsDiff({a: 2}, {a: 2})).toEqual([]);
    expect(shallowPropsDiff({a: 2, b: 1}, {a: 2})).toEqual(['b']);
    expect(shallowPropsDiff({a: 2}, {a: 2, b: 1})).toEqual(['b']);
    expect(shallowPropsDiff({a: 2, b: 2}, {a: 2, b: 1})).toEqual(['b']);
    expect(shallowPropsDiff({a: 2, b: 2}, {a: 1, b: 1})).toEqual(['a', 'b']);
    expect(shallowPropsDiff({a: 2, b: 2}, {a: 2, b: 2})).toEqual([]);
  })
})

describe('assign', () => {
  it('should not mutate', () => {
    var map = {};
    expect(assign('a', 1, {})).not.toBe(map);
  })
  it('result\'s prototype should be null', () => {
    expect(assign('a', 1, {}).toString).toBe(undefined)
  })
  it('should work', () => {
    expect(assign('a', 1, {}).a).toBe(1)
    expect(assign('a', 1, {a: 0}).a).toBe(1)
    expect(assign('a', 1, {b: 0}).b).toBe(0)
  })
})

describe('hasIntersection', () => {
  it('should work', () => {
    expect(hasIntersection([], [])).toBe(false)
    expect(hasIntersection([1], [])).toBe(false)
    expect(hasIntersection([], [1])).toBe(false)
    expect(hasIntersection([1], [1])).toBe(true)
    expect(hasIntersection([1], [2])).toBe(false)
    expect(hasIntersection([1], [2, 1])).toBe(true)
    expect(hasIntersection([2, 1], [1])).toBe(true)
  })
})
