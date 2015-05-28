/* @flow */

import {shallowPropsDiff, assoc, hasIntersection, skipDuplicates, shallowEq} from './_'
import {reduceAllStores} from './reduce'
import type {ReplaceStateMiddleware, FluceInstance} from './types'


export default function(): FluceInstance {

  var stores = Object.create(null)
  var listeners = []

  function addStore(name, store) {
    replaceState(assoc(name, store.initial(), fluce.stores))
    stores[name] = store
  }

  function addActionCreator(name, getCreator) {
    fluce.actions[name] = getCreator(fluce)
  }

  function dispatch(type, payload) {
    replaceState(reduceAllStores(stores, {type, payload}, fluce.stores))
  }

  function subscribe(stores, callback) {
    var listener = {stores, callback}
    listeners = listeners.concat([listener])
    return () => {
      listeners = listeners.filter(s => s !== listener)
    }
  }

  function notify(updatedStores) {
    listeners.forEach(listener => {
      if (hasIntersection(updatedStores, listener.stores)) {
        listener.callback(updatedStores)
      }
    })
  }

  var fluce = {
    stores: Object.create(null),
    actions: Object.create(null),
    addStore,
    addActionCreator,
    dispatch,
    subscribe
  }


  var replaceState = skipDuplicates(shallowEq, (newState) => {
    var undatedStores = shallowPropsDiff(fluce.stores, newState)
    fluce.stores = newState
    notify(undatedStores)
  })

  return fluce
}
