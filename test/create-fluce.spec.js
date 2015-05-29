/* @flow */

import createFluce from '../src/create-fluce'
import {storeCounter, storeCounter2} from './fixtures'

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
    it('should update stores state', () => {
      var fluce = createFluce()
      fluce.addStore('counter', storeCounter)
      fluce.addStore('counter2', storeCounter2)
      fluce.dispatch('add', 1)
      expect(fluce.stores.counter).toBe(1)
      expect(fluce.stores.counter2).toBe(-1)
    })
  })

  describe('.subscribe', () => {
    it('listeners should be notified', () => {
      var log = []
      var fluce = createFluce()
      fluce.addStore('counter', storeCounter)
      fluce.addStore('counter2', storeCounter2)
      fluce.addStore('counter3', storeCounter)
      fluce.subscribe(['counter', 'counter2'], (updated) => {log.push(updated)})
      fluce.dispatch('add', 1)
      expect(log).toEqual([['counter', 'counter2', 'counter3']])
      fluce.dispatch('subtract', 1)
      expect(log).toEqual([['counter', 'counter2', 'counter3'], ['counter', 'counter3']])
      fluce.dispatch('foo', 1)
      expect(log).toEqual([['counter', 'counter2', 'counter3'], ['counter', 'counter3']])
    })
    it('listeners shouldn\'t be notified if state doesn\'t change', () => {
      var log = []
      var fluce = createFluce()
      fluce.addStore('counter', storeCounter)
      fluce.subscribe(['counter'], (updated) => {log.push(updated)})
      fluce.dispatch('add', 0)
      expect(log).toEqual([])
    })
  })

})
