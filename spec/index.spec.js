/* eslint no-undef:"off" */

const promiseAllSettledPlus = require('../src/index');

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

const isPasResult = function isValidPromiseAllSettledResult(rawResult) {
  return Array.isArray(rawResult) &&
    rawResult.length > 0 &&
    rawResult.every((el) => ['fulfilled', 'rejected'].includes(el.status)) &&
    rawResult.every((el) => (el.value || el.reason));
};

const promiseFactory = function promiseFactory(input) {
  if (input) {
    return Promise.resolve(Math.random());
  }

  return Promise.reject(new Error('Some fake error'));
};


describe('promiseAllSettledPlus', () => {
  it('validates input', () => {
    // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
    // numbers are not arrays
    expect(() => { promiseAllSettledPlus(12); }).toThrowError('input must be an array');

    expect(() => { promiseAllSettledPlus([1, 2, 3]); })
      .toThrowError('input must be an array of Promises');

    expect(() => {
      promiseAllSettledPlus([Promise.resolve(12)]);
    }).not.toThrow();
  });

  it('optionally lets you bypass checking for Promises', () => {
    expect(() => {
      promiseAllSettledPlus([1, 2, 3], { checkInputForPromises: false });
    }).not.toThrow();
  });

  it('returns a rational result for populated arrays (all resolved)', () => (
    promiseAllSettledPlus([true, true, true, true].map(promiseFactory))
      .then((result) => {
        // all
        expect(result.areAllFulfilled).toBeTrue();
        expect(result.areAllRejected).toBeFalse();

        // some
        expect(result.hasFulfilled).toBeTrue();
        expect(result.hasRejected).toBeFalse();

        // rawResult
        expect(isPasResult(result.rawResult)).toBeTrue();

        // counts
        expect(result.fulfilledCount).toBe(4);
        expect(result.rejectedCount).toBe(0);
      })
      .catch((err) => {
        fail(err.stack);
      })
  ));

  it('returns a rational result for populated arrays (mixed results)', () => (
    promiseAllSettledPlus([true, true, false, false, false].map(promiseFactory))
      .then((result) => {
        // all
        expect(result.areAllFulfilled).toBeFalse();
        expect(result.areAllRejected).toBeFalse();

        // some
        expect(result.hasFulfilled).toBeTrue();
        expect(result.hasRejected).toBeTrue();

        // rawResult
        expect(isPasResult(result.rawResult)).toBeTrue();

        // counts
        expect(result.fulfilledCount).toBe(2);
        expect(result.rejectedCount).toBe(3);
      })
      .catch((err) => {
        fail(err.stack);
      })
  ));

  it('returns a rational result for populated arrays (all rejected)', () => (
    promiseAllSettledPlus([false, false, false, false, false].map(promiseFactory))
      .then((result) => {
        // all
        expect(result.areAllFulfilled).toBeFalse();
        expect(result.areAllRejected).toBeTrue();

        // some
        expect(result.hasFulfilled).toBeFalse();
        expect(result.hasRejected).toBeTrue();

        // rawResult
        expect(isPasResult(result.rawResult)).toBeTrue();

        // counts
        expect(result.fulfilledCount).toBe(0);
        expect(result.rejectedCount).toBe(5);
      })
      .catch((err) => {
        fail(err.stack);
      })
  ));

  it('returns a rational result for empty arrays', () => promiseAllSettledPlus([])
    .then((result) => {
      // all
      expect(result.areAllFulfilled).toBeFalse();
      expect(result.areAllRejected).toBeFalse();

      // some
      expect(result.hasFulfilled).toBeFalse();
      expect(result.hasRejected).toBeFalse();

      // rawResult
      expect(result.rawResult).toEqual([]);

      // counts
      expect(result.fulfilledCount).toBe(0);
      expect(result.rejectedCount).toBe(0);
    })
    .catch((err) => {
      fail(err.stack);
    }));
});
