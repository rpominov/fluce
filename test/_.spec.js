/* @flow */

import * as _ from '../src/_'
import {removeProto} from './helpers'


describe('shallowEq', () => {
  it('should work', () => {
    expect(_.shallowEq({}, {})).toBe(true)
    expect(_.shallowEq({a: 1}, {})).toBe(false)
    expect(_.shallowEq({}, {a: 1})).toBe(false)
    expect(_.shallowEq({a: 2}, {a: 1})).toBe(false)
    expect(_.shallowEq({a: 2}, {a: 2})).toBe(true)
    expect(_.shallowEq({a: 2, b: 1}, {a: 2})).toBe(false)
    expect(_.shallowEq({a: 2}, {a: 2, b: 1})).toBe(false)
    expect(_.shallowEq({a: 2, b: 2}, {a: 2, b: 1})).toBe(false)
    expect(_.shallowEq({a: 2, b: 2}, {a: 2, b: 2})).toBe(true)
  })
})

describe('shallowPropsDiff', () => {
  it('should work', () => {
    expect(_.shallowPropsDiff({}, {})).toEqual([])
    expect(_.shallowPropsDiff({a: 1}, {})).toEqual(['a'])
    expect(_.shallowPropsDiff({}, {a: 1})).toEqual(['a'])
    expect(_.shallowPropsDiff({a: 2}, {a: 1})).toEqual(['a'])
    expect(_.shallowPropsDiff({a: 2}, {a: 2})).toEqual([])
    expect(_.shallowPropsDiff({a: 2, b: 1}, {a: 2})).toEqual(['b'])
    expect(_.shallowPropsDiff({a: 2}, {a: 2, b: 1})).toEqual(['b'])
    expect(_.shallowPropsDiff({a: 2, b: 2}, {a: 2, b: 1})).toEqual(['b'])
    expect(_.shallowPropsDiff({a: 2, b: 2}, {a: 1, b: 1})).toEqual(['a', 'b'])
    expect(_.shallowPropsDiff({a: 2, b: 2}, {a: 2, b: 2})).toEqual([])
  })
})

describe('assoc', () => {
  it('should not mutate', () => {
    var map = {}
    expect(_.assoc('a', 1, {})).not.toBe(map)
  })
  it('result\'s prototype should be null', () => {
    expect(_.assoc('a', 1, {}).toString).toBe(undefined)
  })
  it('should work', () => {
    expect(_.assoc('a', 1, {})).toEqual(removeProto({a: 1}))
    expect(_.assoc('a', 1, {a: 0})).toEqual(removeProto({a: 1}))
    expect(_.assoc('a', 1, {b: 0})).toEqual(removeProto({a: 1, b: 0}))
  })
})

describe('hasIntersection', () => {
  it('should work', () => {
    expect(_.hasIntersection([], [])).toBe(false)
    expect(_.hasIntersection([1], [])).toBe(false)
    expect(_.hasIntersection([], [1])).toBe(false)
    expect(_.hasIntersection([1], [1])).toBe(true)
    expect(_.hasIntersection([1], [2])).toBe(false)
    expect(_.hasIntersection([1], [2, 1])).toBe(true)
    expect(_.hasIntersection([2, 1], [1])).toBe(true)
  })
})

describe('pick', () => {
  it('should work', () => {
    expect(_.pick(['a', 'b', 'c'], {a: 1, b: 2, d: 3, e: 4})).toEqual(removeProto({a: 1, b: 2, c: undefined}))
  })
})

describe('eqArrays', () => {
  it('should work', () => {
    expect(_.eqArrays([], [])).toBe(true)
    expect(_.eqArrays([1], [])).toBe(false)
    expect(_.eqArrays([], [1])).toBe(false)
    expect(_.eqArrays([1], [1])).toBe(true)
    expect(_.eqArrays([1, 2], [1])).toBe(false)
    expect(_.eqArrays([1], [1, 2])).toBe(false)
    expect(_.eqArrays([1, 2], [1, 2])).toBe(true)
  })
})
