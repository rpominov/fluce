/* @flow */

import type {Store, Action, Stores, StoreStates} from './types'


var noopReducer = (state, payload) => state

export function reduceStore(store: Store, action: Action, state: any): any {
  var reducer = store.reducers[action.type] || noopReducer
  return reducer(state, action.payload)
}

export function reduceAllStores(stores: Stores, action: Action, curState: StoreStates): StoreStates {
  var storeNames = Object.keys(stores)
  var newState = {}
  storeNames.forEach(storeName => {
    newState[storeName] = reduceStore(stores[storeName], action, curState[storeName])
  })
  return newState
}
