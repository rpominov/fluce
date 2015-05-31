/* @flow */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ = require('./_');

var _reduce = require('./reduce');

exports['default'] = function () {

  var stores = Object.create(null);
  var listeners = [];

  function addStore(name, store) {
    replaceState((0, _.assoc)(name, store.initial(), fluce.stores));
    stores[name] = store;
  }

  function addActionCreator(name, getCreator) {
    fluce.actions[name] = getCreator(fluce);
  }

  function dispatch(type, payload) {
    replaceState((0, _reduce.reduceAllStores)(stores, { type: type, payload: payload }, fluce.stores));
  }

  function subscribe(stores, callback) {
    var listener = { stores: stores, callback: callback };
    listeners = listeners.concat([listener]);
    return function () {
      listeners = listeners.filter(function (s) {
        return s !== listener;
      });
    };
  }

  function replaceState(newState) {
    if (!(0, _.shallowEq)(fluce.stores, newState)) {
      var updatedStores = (0, _.shallowPropsDiff)(fluce.stores, newState);
      fluce.stores = newState;
      notify(updatedStores);
    }
  }

  function notify(updatedStores) {
    listeners.forEach(function (listener) {
      if ((0, _.hasIntersection)(updatedStores, listener.stores)) {
        listener.callback(updatedStores);
      }
    });
  }

  var fluce = {
    stores: Object.create(null),
    actions: Object.create(null),
    addStore: addStore,
    addActionCreator: addActionCreator,
    dispatch: dispatch,
    subscribe: subscribe
  };

  return fluce;
};

module.exports = exports['default'];