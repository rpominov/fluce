/* @flow */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.reduceStore = reduceStore;
exports.reduceAllStores = reduceAllStores;

var noopReducer = function noopReducer(state, payload) {
  return state;
};

function reduceStore(store, action, state) {
  var reducer = store.reducers[action.type] || noopReducer;
  return reducer(state, action.payload);
}

function reduceAllStores(stores, action, curState) {
  var storeNames = Object.keys(stores);
  var newState = {};
  storeNames.forEach(function (storeName) {
    newState[storeName] = reduceStore(stores[storeName], action, curState[storeName]);
  });
  return newState;
}