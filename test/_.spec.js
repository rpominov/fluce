/* @flow */

import {shallowEq, shallowPropsDiff, assoc, hasIntersection, pick, eqArrays} from '../src/_'

describe('shallowEq', () => {
  it('should work', () => {
    expect(shallowEq({}, {})).toBe(true)
    expect(shallowEq({a: 1}, {})).toBe(false)
    expect(shallowEq({}, {a: 1})).toBe(false)
    expect(shallowEq({a: 2}, {a: 1})).toBe(false)
    expect(shallowEq({a: 2}, {a: 2})).toBe(true)
    expect(shallowEq({a: 2, b: 1}, {a: 2})).toBe(false)
    expect(shallowEq({a: 2}, {a: 2, b: 1})).toBe(false)
    expect(shallowEq({a: 2, b: 2}, {a: 2, b: 1})).toBe(false)
    expect(shallowEq({a: 2, b: 2}, {a: 2, b: 2})).toBe(true)
  })
})

describe('shallowPropsDiff', () => {
  it('should work', () => {
    expect(shallowPropsDiff({}, {})).toEqual([])
    expect(shallowPropsDiff({a: 1}, {})).toEqual(['a'])
    expect(shallowPropsDiff({}, {a: 1})).toEqual(['a'])
    expect(shallowPropsDiff({a: 2}, {a: 1})).toEqual(['a'])
    expect(shallowPropsDiff({a: 2}, {a: 2})).toEqual([])
    expect(shallowPropsDiff({a: 2, b: 1}, {a: 2})).toEqual(['b'])
    expect(shallowPropsDiff({a: 2}, {a: 2, b: 1})).toEqual(['b'])
    expect(shallowPropsDiff({a: 2, b: 2}, {a: 2, b: 1})).toEqual(['b'])
    expect(shallowPropsDiff({a: 2, b: 2}, {a: 1, b: 1})).toEqual(['a', 'b'])
    expect(shallowPropsDiff({a: 2, b: 2}, {a: 2, b: 2})).toEqual([])
  })
})

describe('assoc', () => {
  it('should not mutate', () => {
    var map = {}
    expect(assoc('a', 1, {})).not.toBe(map)
  })
  it('result\'s prototype should be null', () => {
    expect(assoc('a', 1, {}).toString).toBe(undefined)
  })
  it('should work', () => {
    expect(assoc('a', 1, {}).a).toBe(1)
    expect(assoc('a', 1, {a: 0}).a).toBe(1)
    expect(assoc('a', 1, {b: 0}).b).toBe(0)
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

describe('pick', () => {
  it('should work', () => {
    var result: any = Object.create(null)
    result.a = 1
    result.b = 2
    result.c = undefined
    expect(pick(['a', 'b', 'c'], {a: 1, b: 2, d: 3, e: 4})).toEqual(result)
  })
})

describe('eqArrays', () => {
  it('should work', () => {
    expect(eqArrays([], [])).toBe(true)
    expect(eqArrays([1], [])).toBe(false)
    expect(eqArrays([], [1])).toBe(false)
    expect(eqArrays([1], [1])).toBe(true)
    expect(eqArrays([1, 2], [1])).toBe(false)
    expect(eqArrays([1], [1, 2])).toBe(false)
    expect(eqArrays([1, 2], [1, 2])).toBe(true)
  })
})
