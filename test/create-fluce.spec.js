/* @flow */

import createFluce from '../src/create-fluce'
import {storeCounter, storeCounter2, counterStores,
  actionAdd5, actionSubtract7, actionMult2, acAdd} from './fixtures'

describe('createFluce', () => {

  it('should return empty instance', () => {
    var fluce = createFluce()
    expect(fluce.stores).toEqual(Object.create(null))
    expect(fluce.actions).toEqual(Object.create(null))
  })

  describe('.addStore', () => {
    it('should add initial state to the .stores', () => {
      var fluce = createFluce()
      fluce.addStore('counter', storeCounter)
      expect(fluce.stores.counter).toBe(storeCounter.initial())
    })
  })

  describe('.addActionCreator', () => {
    it('should work', () => {
      var fluce = createFluce()
      var c1 = 0
      var c2 = 0
      function ac(_fluce) {
        c1++
        expect(_fluce).toBe(fluce)
        return () => {
          c2++
        }
      }
      fluce.addActionCreator('ac', ac)
      expect(c1).toBe(1)
      fluce.actions.ac()
      expect(c2).toBe(1)
    })
  })

  describe('.dispatch', () => {
    // TODO
  })

  describe('.subscribe', () => {
    // TODO
  })

  describe('middleware', () => {
    // TODO
  })

})
