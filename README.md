# promise-all-settled-plus  
Adds useful getters to the result of a call to Promise.allSettled.  

# Prerequisites 
|Prerequisite|Comments|
|---|---|
|Requires Promise.allSettled to exist.|This shouldn't be a problem for most users.  It's in Node.js 12.13.0  and most major browsers [(see caniuse.com, April 22, 2020)](https://caniuse.com/#feat=mdn-javascript_builtins_promise_allsettled), so most people won't have a problem.  Please [create an issue](https://github.com/tmurphree/promise-all-settled-plus/issues) and I'm open to working on this with you if you need it to work with a custom Promise library.  

# Accepts  
An array of Promises.

Input is validated for an array of native Promises.  If you use a module that uses another Promise library, you may need to bypass this check with the `checkInputForPromises` option:
``` js
promiseAllSettledPlus([customPromise1, customPromise2], { checkInputForPromises: false })
// etc
```
# Returns  
```js
/**
 * Plain JavaScript object that we get as a result of promiseAllSettledPlus.
 * @property {boolean} areAllFulfilled True if every Promise is fulfilled.
 * @property {boolean} areAllRejected True if every Promise is rejected.
 * @property {number} fulfilledCount
 * @property {boolean} hasFulfilled True if at least one Promise is fulfilled.
 * @property {boolean} hasRejected True if at least one Promise is rejected.
 * @property {object[]} rawResult The raw result from the Promise.allSettled call.
 * @property {number} rejectedCount
 */

e.g.
{
  areAllFulfilled: false,
  areAllRejected: false,
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

// resolves to:
{
  areAllFulfilled: false,
  areAllRejected: false,
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