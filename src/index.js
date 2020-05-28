/**
 * @description Add useful getters to the result of a call to Promise.allSettled.
 * @param {Promise[]} vows An array of the Promises you want to call.
 * @param {object} promises
 * @param {object} options
 * @param {boolean} [options.checkInputForPromises=true] If true, checks that all items in the
 *   input array are native Promises.
 * @returns {object} object
*/
const promiseAllSettledPlus = function promiseAllSettledPlus(
  promises,
  options = { checkInputForPromises: true }
) {
  if (typeof options !== 'object') {
    throw new Error('options must be an object if you supply a value for it.');
  }

  const { checkInputForPromises } = options;

  if (!(Array.isArray(promises))) {
    throw new TypeError('input must be an array');
  }

  if (typeof checkInputForPromises !== 'boolean') {
    throw new Error('checkInputForPromises must be boolean');
  }

  if (checkInputForPromises && !(promises.every((el) => el instanceof Promise))) {
    throw new Error('input must be an array of Promises');
  }

  if (typeof Promise.allSettled !== 'function') {
    throw new Error('Promise.allSettled must be present for promiseAllSettledPlus to work.');
  }

  return Promise.allSettled(promises)
    .then((rawResult) => {
      const fulfilledTest = (el) => el.status === 'fulfilled';
      const rejectedTest = (el) => el.status === 'rejected';

      return {
        get areAllFulfilled() {
          return this.rawResult.length > 0 && this.rawResult.every(fulfilledTest);
        },
        get areAllRejected() {
          return this.rawResult.length > 0 && this.rawResult.every(rejectedTest);
        },
        get fulfilledCount() {
          return this.rawResult.filter(fulfilledTest).length;
        },
        get hasFulfilled() {
          return this.rawResult.length > 0 && this.rawResult.some(fulfilledTest);
        },
        get hasRejected() {
          return this.rawResult.length > 0 && this.rawResult.some(rejectedTest);
        },
        rawResult,
        get rejectedCount() {
          return this.rawResult.filter(rejectedTest).length;
        },
      };
    });
};

module.exports = promiseAllSettledPlus;
