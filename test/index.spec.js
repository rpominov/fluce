/* @flow */

import {reduceStore, reduceAllStores, getUpdatedStores} from '../src/index';



// Fixture stores

var storeCounter = {
  initial() {return 0},
  reducers: {
    add(cur, x) {return cur + x},
    subtract(cur, x) {return cur - x}
  }
};

var storeCounter2 = {
  initial() {return 0},
  reducers: {
    add(cur, x) {return cur - x},
    mult(cur, x) {return cur * x}
  }
};

var counterStores = {
  counter: storeCounter,
  counter2: storeCounter2
};



// Fixture actions

var actionAdd5 = {type: 'add', payload: 5};
var actionSubtract7 = {type: 'subtract', payload: 7};
var actionMult2 = {type: 'mult', payload: 2};




describe('reduceStore', () => {

  it('should return new state, if the store has the action handler', () => {
    expect(reduceStore(storeCounter, actionAdd5, 5)).toBe(10);
  });

  it('should return same state, if the store doesn\'t have the action handler', () => {
    var state = {};
    expect(reduceStore(storeCounter, actionMult2, state)).toBe(state);
  });

});


describe('reduceAllStores', () => {

  it('update all stores', () => {

    var states = {
      counter: 0,
      counter2: 5
    };

    expect(reduceAllStores(counterStores, actionAdd5, states)).toEqual({counter: 5, counter2: 0});
  });

  it('update some stores', () => {

    var states = {
      counter: {test: 'test'},
      counter2: 5
    };

    expect(reduceAllStores(counterStores, actionMult2, states)).toEqual({counter: {test: 'test'}, counter2: 10});
  });


});


describe('getUpdatedStores', () => {

  it('should work', () => {
    var prevStates = {a: 1, b: 2, c: 3};
    var nextStates = {a: 1, b: -2, c: -3};

    expect(getUpdatedStores(prevStates, nextStates)).toEqual(['b', 'c']);
  });

});
