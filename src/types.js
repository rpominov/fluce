/* @flow */

export type map = {[key: string]: any}

export type ReplaceState = (newState: map) => void
export type ReplaceStateMiddleware = (replace: ReplaceState) => ReplaceState

export type Reducer = (state: any, payload: any) => any
export type Store = {initial: () => any, reducers: {[key: string]: Reducer}}

export type Action = {type: string; payload: any}
export type Stores = {[key: string]: Store}
export type StoreStates = {[key: string]: any}

export type FluceInstance = {
  stores: {[key: string]: any},
  actions: {[key: string]: Function},
  addStore(name: string, store: Store): void,
  addActionCreator(name: string, getCreator: (fluce: FluceInstance) => Function): void,
  dispatch(type: string, payload: any): void,
  subscribe(stores: Array<string>, callback: (updatedStores: Array<string>) => void): () => void,
  _countListeners(): number
}
