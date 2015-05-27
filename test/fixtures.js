/* @flow */

import type {FluceInstance} from '../src/types'


// Stores

export var storeCounter = {
  initial(): number {return 0},
  reducers: {
    add(cur: number, x: number): number {return cur + x},
    subtract(cur: number, x: number): number {return cur - x}
  }
}

export var storeCounter2 = {
  initial(): number {return 0},
  reducers: {
    add(cur: number, x: number): number {return cur - x},
    multiply(cur: number, x: number): number {return cur * x}
  }
}

export var counterStores = {
  counter: storeCounter,
  counter2: storeCounter2
}


// Action creators

export function acAdd(fluce: FluceInstance): (x: number) => void {
  return (x) => {
    fluce.dispatch('add', x)
  }
}

export function acSubtract(fluce: FluceInstance): (x: number) => void {
  return (x) => {
    fluce.dispatch('subtract', x)
  }
}

export function acMultiply(fluce: FluceInstance): (x: number) => void {
  return (x) => {
    fluce.dispatch('multiply', x)
  }
}



// Actions

export var actionAdd5 = {type: 'add', payload: 5}
export var actionSubtract7 = {type: 'subtract', payload: 7}
export var actionMult2 = {type: 'multiply', payload: 2}
