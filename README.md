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
 - without singleton global flux object

The name is combined from "flux" and "reduce".


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

Where `initial()` returns an intial state, and each of `reducers` is an action
handler called with a current _state_ and the action's _payload_ as arguments
returning a new _state_. Each reducer must be a pure function, that never
mutate current state, but returns a new one instead. A reducer's name
(e.g. `foo` above) is the action type that the reducer want to handle.

```js
let myStore = {
  initial() {
    return myInitialState;
  },
  reducers: {
    actionName1(currentStoreState, actionPayload) {
      return computeNewState(currentStoreState, actionPayload);
    },
    actionName2(currentStoreState, actionPayload) {
      /* ... */
    }
  }
};
```


## Action creators

Action creator in Fluce is a function that returns another function — the action creator itself:

```js
let myActionCreator = (fluce) => {
  return (some, args) => {
    // do something, call `fluce.dispatch()` eventually with the result
    fluce.dispatch('actionName', payload);
  }
};
```


## Fluce instance

You start use Fluce by creating an instance of it. Normally you want
only one instance in the browser, but might want to create an instance
for each request on server-side.

```js
const fluce = createFluce();
```

When an instance created, you can add action creators and stores to it,
order in which you add them doesn't matter:

```js
fluce.addStore('storeName', myStore);
fluce.addActionCreator('actionCreatorName', myActionCreator);
```

After this done, you can access each store's current state as `fluce.stores.storeName`,
and call an action creator as `fluce.actions.actionCreatorName(some, args)`.
Also you can subscribe to changes of states:

```js
let unsubscribe = fluce.subscribe(['storeName1', 'storeName2'], (updatedStoresNames) => {
  // you can read new state directly from `fluce.stores.storeName`
});

// later...
unsubscribe();
```

Callback is called when some of specified stores change their state (via a reducer).
If two or more stores change in response to a single action, the callback will
be called only once. Also if a reducer returns same state, the store will be considered not changed.

## Example

```js
// Setup

const fluce = createFluce();

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

fluce.addActionCreator('counterAdd', (fluce) => {
  return (x) => fluce.dispatch('counterAdd', x);
});

fluce.addActionCreator('counterSubtract', (fluce) => {
  return (x) => fluce.dispatch('counterSubtract', x);
});


// Usage

console.log(fluce.stores.counter); // => 0
console.log(fluce.stores.counterInverted); // => 0

fluce.actions.counterAdd(10);

console.log(fluce.stores.counter); // => 10
console.log(fluce.stores.counterInverted); // => -10

fluce.subscribe(['counter', 'counterInverted'], (updated) => {
  console.log('following stores have updated:', updated);
});

fluce.actions.counterSubtract(5);
// => following stores have updated: ['counter', 'counterInverted']
```


# In progress

Following features are in progress.

## &lt;Fluce /&gt; React component

`Fluce` is an helper component, you can use to subscribe to stores.
It outputs nothing but it's child component to the result DOM.
It can have only one child, and renders it with a bit of magic
(adds two more props to it).

```js
React.render(<Fluce fluce={fluce}>
  <div>
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
  </div>
</Fluce>, document.getElementById('root'));
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
[`React.addons.cloneWithProps`](http://facebook.github.io/react/docs/clone-with-props.html)
to add props to child component.


## Higher-order React components

You can think of it like wrapping your component into &lt;Fluce /&gt; in advance.
Learn more about
[Higher-order components as a pattern](https://gist.github.com/sebmarkbage/ef0bf1f338a7182b6775).

```js
class UserBlock {
  render() {
    return <div>
      Hi, {this.props.stores.user.name}!
      <button onClick={() => this.fluce.actions.logout()}>logout</button>
    </div>;
  }
}

const UserBlockEnhanced = listenStores(['user'], UserBlock);

// We still need to pass fluce instance somewhere,
// that's why top <Fluce> wrapper is still used.
React.render(<Fluce fluce={fluce}>
  ...
  <UserBlockEnhanced />
  ...
<Fluce>, document.getElementById('root'))
```

## Optimistic dispatch

Thanks to pure action handlers we can support
optimistic dispatch of actions. An optimistic dispatch can be canceled,
in this case we simply roll back to the state before that action,
and replay all actions except the canceled one.

```js
fluce.addActionCreator('fooAdd', (fluce) => {
  return (foo) => {
    const action = fluce.optimisticallyDispatch('fooAdd', foo);
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

<!--
## State update middleware

When creating a Fluce instance you can provide a middleware that will be used
to change default fluce behavior regarding update stores state. A middleware is
a function that returns another function:

```js
const myMiddleware = (replaceState) => {
  // The returned function will be called when fluce want to update its state.
  // It is called with the state object that contains state of all stores,
  // (the same object that is available as `fluce.stores`).
  return (newState) => {
    // Now you're in charge, and can decide whether the state will be changed
    // and to what value. To set the new state you should call the
    // `replaceState` function. You can not call `replaceState` on a request
    // from fluce, and you can also call it at any time you want. For instance,
    // you can delay all changes like this:
    setTimeout(() => replaceState(newState), 1000);
  }
}
```

A no op middleware is looks like this `(replaceState) => replaceState`,
it won't change the default behavior.

To set a middleware you need to pass it to `createFluce()` function:

```js
const fluce = createFluce(myMiddleware);
```

This feature allows you to implement advanced stuff like "time travelling" or "undo" from
[this prototype](https://gist.github.com/gaearon/c02f3eb38724b64ab812) by
[@gaearon](https://github.com/gaearon).
-->
