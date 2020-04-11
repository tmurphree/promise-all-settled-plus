/* eslint no-undef:"off" */

const promiseAllSettledPlus = require('../index.js');

// #region jasmine setup
const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

const revertJasmineTimeout = function revertJasmineTimeout() {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout;
};

const setJasmineTimeout = function setJasmineTimeout(milliseconds) {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = milliseconds;
};

// you can set more options than are shown here: see https://jasmine.github.io/api/edge/Reporter.html
// tutorial: https://jasmine.github.io/tutorials/custom_reporter
const myReporter = {
  jasmineStarted: function jasmineStarted(suiteInfo, done) {
    // optional setup goes here
    setJasmineTimeout(10000);
    done();
  },
  jasmineDone: function jasmineDone(suiteInfo, done) {
    console.log(`Tests ended ${new Date().toLocaleString()}`);
    revertJasmineTimeout();
    done();
  },
};

jasmine.getEnv().addReporter(myReporter);
// #endregion jasmine setup

const promiseFactory = function promiseFactory(input) {
  if (input) {
    return Promise.resolve(Math.random());
  }

  return Promise.reject(new Error('Some fake error'));
};

describe('promiseAllSettledPlus throws on bad input', () => {
  it('expects an iterable', () => {
    // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
    // numbers are not iterables
    expect(() => { promiseAllSettledPlus(12); }).toThrow();
  });
});

describe('promiseAllSettledPlus returns an object with useful helper properties', () => {
  xit('returns a rational result for populated iterables (all resolved)', () => (
    promiseAllSettledPlus([true, true, true, true].map(promiseFactory))
      .then(() => 'do something useful')
      .catch((err) => {
        fail(err.stack)
      })
  ));

  xit('returns a rational result for populated iterables (mixed results)', () => (
    promiseAllSettledPlus([true, true, false, false, false].map(promiseFactory))
      .then(() => 'do something useful')
      .catch((err) => {
        fail(err.stack)
      })
  ));

  xit('returns a rational result for populated iterables (all rejected)', () => (
    promiseAllSettledPlus([false, false, false, false, false].map(promiseFactory))
      .then(() => 'do something useful')
      .catch((err) => {
        fail(err.stack)
      })
  ));

  xit('returns a rational result for empty iterables', () => promiseAllSettledPlus([])
    .then(() => 'do something useful')
    .catch((err) => {
      fail(err.stack)
    })
  );

  it('takes iterables other than arrays', () => {
    pending('successful completion of previous specs');
    const myMap = new Map([
      [1, Promise.resolve(2)],
      [2, Promise.reject(4)]
    ]);

    return promiseAllSettledPlus(myMap)
      .then(() => 'do something useful')
      .catch((err) => {
        fail(err.stack)
      })
  });
});
