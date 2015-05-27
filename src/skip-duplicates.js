/* @flow */


import {shallowEq} from './_'
import type {ReplaceState} from './types'


export default function(replace: ReplaceState): ReplaceState {
  var prevState = {}
  return (newState) => {
    if (!shallowEq(prevState, newState)) {
      prevState = newState
      replace(newState)
    }
  }
}
