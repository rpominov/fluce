/* @flow */

import type {Store} from './types'


type Action = {type: string; payload: any}
type Stores = {[key: string]: Store}
type StoreStates = {[key: string]: any}



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
