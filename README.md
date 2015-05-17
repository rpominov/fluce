# Fluce

[![Join the chat at https://gitter.im/pozadi/fluce](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/pozadi/fluce?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Well, Flux again ...

 - lib agnostic, but with helpers for React
 - forces to use immutable data structures in stores, or just never mutate
 - forces to use pure functions in stores
 - stores are just reducers of events to their state
 - server-side ready
 - without singleton global flux object
 

## Store

Store in Fluce is just an object with shape `{initial: Function, reducers: {foo: Function, bar: Function, ...}}`, where `initial()` returns an intial state, and each of `reducers` is event handlers called with a current _state_ and the event _payload_ as arguments and return a new _state_. Each reducer must be a pure function, that never mutate current state, but returns a new one instead. A reducer's name (e.g. `foo` above) is an event type that the reducer want to handle.

```js
let fooStore = {
  initial() {
    return [];
  },
  reducers: {
    addFoo(foos, newFoo) {
      return foos.concat([newFoo]);
    }
  }
};
```


## Action creators

Action creator in Fluce is a function that returns another function:

```js
let myAction = function(flux) {
  return function(some, args) {
    const payload = {some, args};
    
    // here `addFoo` is an event type that handles the `fooStore` above
    flux.dispatch('addFoo', payload); 
  } 
};
```


## Fluce instance

You start use Fluce by creating an instance of it. Normally you want only one instance in the Browser, but might want to create an instance for each request on server-side.

```
const fluce = createFluce();
```
