/* @flow */

import {reduceStore, reduceAllStores} from '../src/reduce'
import {storeCounter, storeCounter2, counterStores,
  actionAdd5, actionSubtract7, actionMult2} from './fixtures'

describe('reduceStore', () => {

  it('should return new state, if the store has the action handler', () => {
    expect(reduceStore(storeCounter, actionAdd5, 5)).toBe(10)
  })

  it('should return same state, if the store doesn\'t have the action handler', () => {
    var state = {}
    expect(reduceStore(storeCounter, actionMult2, state)).toBe(state)
  })

})


describe('reduceAllStores', () => {

  it('update all stores', () => {
    var states = {
      counter: 0,
      counter2: 5
    }
    expect(reduceAllStores(counterStores, actionAdd5, states)).toEqual({counter: 5, counter2: 0})
  })

  it('update some stores', () => {
    var states = {
      counter: {test: 'test'},
      counter2: 5
    }
    expect(reduceAllStores(counterStores, actionMult2, states)).toEqual({counter: {test: 'test'}, counter2: 10})
  })


})
