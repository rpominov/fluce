/* @flow */

import skipDuplicates from '../src/skip-duplicates-middleware'



describe('skipDuplicatesMiddleware', () => {
  it('should return function', () => {
    expect(typeof skipDuplicates(x => undefined)).toBe('function')
  })
  it('should work as expected', () => {
    var count = 0
    var curState = {}
    var replaceState = skipDuplicates((x) => {
      count++
      curState = x
    })

    replaceState({})
    expect(count).toBe(0)

    replaceState({a: 1})
    expect(count).toBe(1)
    expect(curState).toEqual({a: 1})

    replaceState({a: 1})
    expect(count).toBe(1)

    replaceState({a: 2})
    expect(count).toBe(2)
    expect(curState).toEqual({a: 2})

    replaceState({a: 2, b: 1})
    expect(count).toBe(3)
    expect(curState).toEqual({a: 2, b: 1})

    replaceState({a: 2, b: 1})
    expect(count).toBe(3)

    replaceState({b: 1})
    expect(count).toBe(4)
    expect(curState).toEqual({b: 1})
  })
})
