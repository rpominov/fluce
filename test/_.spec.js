/* @flow */

import {shallowEq, shallowPropsDiff, assoc, hasIntersection, skipDuplicates} from '../src/_'

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


describe('skipDuplicates', () => {

  function eq(a, b) {return a === b}
  function roundEq(a, b) {return Math.round(a) === Math.round(b)}

  it('should return function', () => {
    expect(typeof skipDuplicates(eq, x => undefined)).toBe('function')
  })

  it('should work as expected (eq)', () => {
    var log = []
    var cb = skipDuplicates(eq, (x) => {
      log.push(x)
    })

    cb(1)
    cb(2)
    cb(2)
    cb(3)
    cb(4)
    cb(4)
    cb(4)
    cb(1)

    expect(log).toEqual([1, 2, 3, 4, 1])
  })

  it('should work as expected (roundEq)', () => {
    var log = []
    var cb = skipDuplicates(roundEq, (x) => {
      log.push(x)
    })

    cb(1)
    cb(2)
    cb(2)
    cb(3)
    cb(4.1)
    cb(4.2)
    cb(3.8)
    cb(1)

    expect(log).toEqual([1, 2, 3, 4.1, 1])
  })

})
