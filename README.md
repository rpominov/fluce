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

`Fluce` is an helper component, you can use to subscribe to stores.
It outputs nothing but it's child component to the result DOM.
It can have only one child, and renders it with a bit of a magic
(adds two more props to it).

```js
let Fluce = require('fluce/fluce-component');

class App extends React.Component {
  render() {
    return <div>
      <Fluce stores={['user']}>
        <Header />
      </Fluce>
      <div>
        <Fluce stores={['productsFilter']}>
          <ProductsFilter />
        </Fluce>
        <Fluce stores={['products', 'productsFilter']}>
          <ProductsList layout='cards' />
        </Fluce>
      </div>
    </div>;
  }
}

React.render(<Fluce fluce={fluce}><App /></Fluce>, document.getElementById('root'));
```

In this example `Header` will be rendered as
`<Header fluce={fluce} stores={{user: userStoreState}} />`. So you can access
stores' state, and the `fluce` instance from `this.props`. Same goes for
`ProductsFilter` and `ProductsList`, except `ProductsList` will also have
`layout` property, like so:

```js
<ProductsList layout='cards' fluce={fluce} stores={{
  products: currentStateOfProductsStore,
  productsFilter: currentStateOfProductsFilterStore
}} />
```

Note: you need to provide `fluce` instance that will be used. You can pass it to
any instance of `Fluce` component, but normally you pass it only to one on top,
and others get it from there.

Internally we use [context](https://facebook.github.io/react/blog/2014/03/28/the-road-to-1.0.html#context)
to pass `fluce` instance through components tree, and
[`React.addons.cloneWithProps`](https://facebook.github.io/react/docs/clone-with-props.html)
to add props to child component.


## Higher-order React component

You can think of it like wrapping your component into &lt;Fluce /&gt; in advance.
Learn more about
[Higher-order components as a pattern](https://gist.github.com/sebmarkbage/ef0bf1f338a7182b6775).

```js
let fluceHOC = require('fluce/fluce-hoc');

class UserBlock {
  render() {
    return <div>
      Hi, {this.props.stores.user.name}!
      <button onClick={() => this.fluce.actions.logout()}>logout</button>
    </div>;
  }
}

let UserBlockFluced = fluceHOC({stores: ['user']}, UserBlock);


class App extends React.Component {
  render() {
    return <div>
      ...
      <UserBlockFluced />
      ...
    </div>;
  }
}

React.render(<Fluce fluce={fluce}><App /></Fluce>, document.getElementById('root'))
```

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
