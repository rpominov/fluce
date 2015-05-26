/* @flow */

import skipDuplicatesMiddleware from './skip-duplicates-middleware'
import {shallowPropsDiff, assign} from '../src/_'
import type {ReplaceStateMiddleware} from './types'


type Action = {type: string; payload: any}
type Reducer = (state: any, payload: any) => any
type Reducers = {[key: string]: Reducer}
type Store = {initial: () => any, reducers: Reducers}
type Stores = {[key: string]: Store}
type StoreStates = {[key: string]: any}
type FluceInstance = {
  stores: {[key: string]: any},
  actions: {[key: string]: Function},
  addStore: (name: string, store: Store) => void,
  addActionCreator: (name: string, getCreator: (fluce: FluceInstance) => Function) => void,
  dispatch: (type: string, payload: any) => void
}


var noopReducer = (state, payload) => state

export function reduceStore(store: Store, action: Action, state: any): any {
  var reducer = store.reducers[action.type] || noopReducer
  return reducer(state, action.payload)
}

export function reduceAllStores(stores: Stores, action: Action, states: StoreStates): StoreStates {
  var result = {}
  Object.keys(stores).forEach((storeName) => {
    result[storeName] = reduceStore(stores[storeName], action, states[storeName])
  })
  return result
}

// TODO: tests
export function createFlux(middleware: ReplaceStateMiddleware = (x => x)): FluceInstance {

  var stores = Object.create(null);

  function addStore(name, store) {
    replaceState(assign('name', store.initial(), fluce.stores))
    stores[name] = store
  }

  function addActionCreator(name, getCreator) {
    fluce.actions[name] = getCreator(fluce)
  }

  function dispatch(type, payload) {
    replaceState(reduceAllStores(stores, {type, payload}, fluce.stores))
  }

  var fluce = {
    stores: Object.create(null),
    actions: Object.create(null),
    addStore,
    addActionCreator,
    dispatch
  }

  var replaceState = middleware(skipDuplicatesMiddleware((newState) => {
    var storesUpdated = shallowPropsDiff(fluce.stores, newState);
    fluce.stores = newState;
    // TODO notify listeners
  }));

  return fluce
}
