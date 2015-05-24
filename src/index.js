/* @flow */

type Action = {type: string; payload: any};
type Reducer = (state: any, payload: any) => any;
type Reducers = {[key: string]: Reducer};
type Store = {initial: () => any; reducers: Reducers};
type Stores = {[key: string]: Store};
type StoreStates = {[key: string]: any};


var noopReducer = (state, payload) => state;

export function reduceStore(store: Store, action: Action, state: any): any {
  var reducer = store.reducers[action.type] || noopReducer;
  return reducer(state, action.payload);
}

export function reduceAllStores(stores: Stores, action: Action, states: StoreStates): StoreStates {
  var result = {};
  Object.keys(stores).forEach((storeName) => {
    result[storeName] = reduceStore(stores[storeName], action, states[storeName]);
  });
  return result;
}

export function getUpdatedStores(statesA: StoreStates, statesB: StoreStates): Array<string>  {
  return Object.keys(statesA).filter((storeName) => statesA[storeName] !== statesB[storeName]);
}
