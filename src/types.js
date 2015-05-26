/* @flow */

// exporting map types is buggy: https://github.com/facebook/flow/issues/464
type map = {[key: string]: any}

export type ReplaceState = (newState: map) => void
export type ReplaceStateMiddleware = (replace: ReplaceState) => ReplaceState
