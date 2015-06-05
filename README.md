# Fluce

[![Dependency Status](https://david-dm.org/rpominov/fluce.svg)](https://david-dm.org/rpominov/fluce)
[![devDependency Status](https://david-dm.org/rpominov/fluce/dev-status.svg)](https://david-dm.org/rpominov/fluce#info=devDependencies)
[![Build Status](https://travis-ci.org/rpominov/fluce.svg)](https://travis-ci.org/rpominov/fluce)
[![Join the chat at https://gitter.im/rpominov/fluce](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/rpominov/fluce?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Well, Flux again ...

 - lib agnostic, but with helpers for React
 - forces to use immutable data structures in stores, or just never mutate
 - forces to use pure functions in stores
 - stores are just reducers of actions to their state
 - server-side ready
 - without singletons

The name is combined from "flux" and "reduce".


## Installation

```
$ npm install fluce
```


## Store

Store in Fluce is just an object with the following shape:

```js
{
  initial: Function,
  reducers: {
    foo: Function,
    bar: Function,
    ...
  }
}
```

Where `initial()` returns an initial _state_, and each of `reducers` is an action
handler called with the current _state_ and the action's _payload_ as arguments
returning a new _state_. Each reducer must be a pure function, that never
mutate current state, but returns a new one instead. A reducer's name
(e.g. `foo` above) is the action type that the reducer want to handle.

```js
let myStore = {
  initial() {
    return myInitialState;
  },
  reducers: {
    actionType1(currentStoreState, actionPayload) {
      return computeNewState(currentStoreState, actionPayload);
    },
    actionType2(currentStoreState, actionPayload) {
      /* ... */
    }
  }
};
```


## Fluce instance

You start use Fluce by creating an instance of it. Normally you want
only one instance in the browser, but may want to create an instance
for each request on the server.

```js
let createFluce = require('fluce/create-fluce');

let fluce = createFluce();
```

When an instance created, you can add stores to it:

```js
fluce.addStore('storeName1', myStore1);
fluce.addStore('storeName2', myStore2);
```

After this done, you can access each store's current state as `fluce.stores.storeName`,
and dispatch actions with `fluce.dispatch('actionType', payload)`.
Also you can subscribe to changes of stores' states:

```js
let unsubscribe = fluce.subscribe(['storeName1', 'storeName2'], (updatedStoresNames) => {
  // you can read new state directly from `fluce.stores.storeName`
});

// later...
unsubscribe();
```

Callback is called when some of specified stores change their state (via a reducer).
If two or more stores change in response to a single action, the callback will
be called only once. Also if a reducer returns same state, the store will be
considered not changed.


## Example

```js
let createFluce = require('fluce/create-fluce');


// Setup

let fluce = createFluce();

fluce.addStore('counter', {
  initial() {
    return 0;
  },
  reducers: {
    counterAdd(cur, x) {
      return cur + x;
    },
    counterSubtract(cur, x) {
      return cur - x;
    }
  }
});

fluce.addStore('counterInverted', {
  initial() {
    return 0;
  },
  reducers: {
    counterAdd(cur, x) {
      return cur - x;
    },
    counterSubtract(cur, x) {
      return cur + x;
    }
  }
});


// Usage

console.log(fluce.stores.counter); // => 0
console.log(fluce.stores.counterInverted); // => 0

fluce.actions.dispatch('counterAdd', 10);

console.log(fluce.stores.counter); // => 10
console.log(fluce.stores.counterInverted); // => -10

fluce.subscribe(['counter', 'counterInverted'], (updated) => {
  console.log('following stores have updated:', updated);
});

fluce.actions.dispatch('counterSubtract', 5);
// => following stores have updated: ['counter', 'counterInverted']
```


# In progress

The features below aren't done yet.

## &lt;Fluce /&gt; React component

`<Fluce/>` is an helper component, you can use to subscribe to stores and
fire actions from a component that know nothing about Fluce. It outputs nothing
but it's child component to the result DOM. It can have only one child, and
renders it with a bit of a magic (adds more props to it).

`<Fluce/>` accepts following props:

 - `fluce` — the Fluce instance to use, the property is optional if there is another `<Fluce/>` up the tree with this property specified.
 - `stores` — object of the shape `{foo: 'storeName', bar: 'anotherStoreName', ...}`, containing name of stores from which you want to read.
 Current state of each of these stores will be always available on the child component's props (`foo` and `bar` are the props names).
 - `actionCreators` — object of shape `{foo: (fluce, arg1, agr2) => {...}, ...}`, containing action creators that will be available as props on the child component. You will be able to call them like this `this.props.foo(arg1, agr2)` (without providing the first argument `fluce` —  an instance of Fluce).
 - `render` — a custom render function you can provide, that will be used instead of simply render child with additional props.


```js
let Fluce = require('fluce/fluce-component');

class Counter extends React.Component {
  render() {

    // Also `this.props.fluce` will be available here,
    // but you shouldn't need it in most cases.

    return <div>
      <button onClick={this.props.onDecrement}>-</button>  
      {this.props.counter}
      <button onClick={this.props.onIncrement}>+</button>
    </div>;
  }
}

function increment(fluce) {
  fluce.dispatch('counterAdd', 1);
}

function decrement(fluce) {
  fluce.dispatch('counterSubtract', 1);
}

class App extends React.Component {
  constructor() {
    render() {
      return <div>
        ...
        <Fluce
          stores={{counter: 'myCounterStore'}}
          actionCreators={{onDecrement: decrement, onIncrement: increment}}
        >
          <Counter />
        </Fluce>
        ...
      </div>;
    }
  }
}

React.render(<Fluce fluce={fluce}><App /></Fluce>, document.getElementById('root'));
```

And here is an example with custom render function:

```js
<Fluce
  stores={{counter: 'myCounterStore'}}
  actionCreators={{decrement, increment}}
  render={(stores, actionCreators, fluce) => {

    return <Counter
      counter={stores.counter}
      onIncrement={actionCreators.increment}
      onDecrement={actionCreators.decrement}
    />;

  }}
/>

```

Internally we use [context](https://facebook.github.io/react/blog/2014/03/28/the-road-to-1.0.html#context)
to pass `fluce` instance through components tree, and
[`React.addons.cloneWithProps`](https://facebook.github.io/react/docs/clone-with-props.html)
to add props to child component.


## Optimistic dispatch

Thanks to pure action handlers we can support
optimistic dispatch of actions. An optimistic dispatch can be canceled,
in this case we simply roll back to the state before that action,
and replay all actions except the canceled one.

```js
fluce.addActionCreator('fooAdd', (fluce) => {
  return (foo) => {
    let action = fluce.optimisticallyDispatch('fooAdd', foo);
    addFooOnServer(foo)
      .then(
        // To confirm an optimistic dispatch is as important as to cancel,
        // because before it confirmed we have to collect
        // all actions (with payloads) that comes after the action in question.
        () => action.confirm(),
        () => action.cancel()
      );
  };
});
```
