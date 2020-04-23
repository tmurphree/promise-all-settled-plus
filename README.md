# promise-all-settled-plus  
Adds useful getters to the result of a call to Promise.allSettled.  

# Prerequisites 
|Prerequisite|Comments|
|---|---|
|Requires Promise.allSettled to exist.|This shouldn't be a problem for most users.  It's in Node.js 12.13.0  and most major browsers [(see caniuse.com, April 22, 2020)](https://caniuse.com/#feat=mdn-javascript_builtins_promise_allsettled), so most people won't have a problem.  Please [create an issue](https://github.com/tmurphree/promise-all-settled-plus/issues) and I'm open to working on this with you if you need it to work with a custom Promise library.  

# Accepts  
An array.  

## Note  
Input validation checks for an array, but it does NOT check that the array is all Promises.  
So you *can* call `promiseAllSettledPlus([1, 2, 3])` and it won't throw, but it won't give you the answer you probably expect.  
Why?  Because not everyone uses the built-in Promise library, and I want them to be able to use it, too.  

# Returns  
```js
/**
 * Plain JavaScript object that we get as a result of promiseAllSettledPlus.
 * @property {boolean} allFulfilled True if every Promise is fulfilled.
 * @property {boolean} allRejected True if every Promise is rejected.
 * @property {integer} fulfilledCount
 * @property {boolean} hasFulfilled True if at least one Promise is fulfilled.
 * @property {boolean} hasRejected True if at least one Promise is rejected..
 * @property {object[]} rawResult The raw result from the Promise.allSettled call.
 * @property {integer} rejectedCount
 */

e.g.
{
  allFulfilled: false,
  allRejected: false,
  fulfilledCount: 2,
  hasFulfilled: true,
  hasRejected: true,
  rawResult: [
    { status: 'fulfilled', value: 42 },
    { status: 'fulfilled', value: 99 },
    { status: 'rejected', reason: (new Error('Request timed out')) }
  ],
  rejectedCount: 1,
}
```

# Usage  
Require this module and call `promiseAllSettledPlus` wherever you'd call of Promise.allSettled.  
``` js
const promiseAllSettledPlus = require('@tmurphree/promise-all-settled-plus');

promiseAllSettledPlus([thisReturnsApromise(), soDoesThis()])
  .then((result) => {
    if (result.hasRejected) { 
      // do something
    }

    // more code goes here
  })
  .catch(errorHandler);
```


# Edge case  

```js
promiseAllSettledPlus([])

// resolves to

{
  allFulfilled: false,
  allRejected: false,
  fulfilledCount: 0,
  hasFulfilled: false,
  hasRejected: false,
  rawResult: [],
  rejectedCount: 0,
}
```

# Explanations  



## Why do I have to use an array when Promise.allSettled takes an iterable?  
We get weird results when we use iterables other than arrays in Promise.allSettled.  
This doesn't fail:  
``` js
const myMap = new Map([
  [1, Promise.resolve(2)],
  [2, Promise.reject(new Error('some error'))],
]);


Promise.allSettled(myMap)
  .then((result) {
    // result is now: 
    // [
    //   { status: 'fulfilled', value: [ 1, [Promise] ] },
    //   { status: 'fulfilled', value: [ 2, [Promise] ] }
    // ]
  })
  .catch(console.error);
```
But it also didn't give the expected result.  You were probably expecting:
``` js
[
  { status: 'fulfilled', value: 2 },
  { status: 'rejected', value: new Error('some error') }
]
```
If you want to use Maps or other iterables in this library natively, please [create an issue](https://github.com/tmurphree/promise-all-settled-plus/issues) and I'm open to working on this with you.  