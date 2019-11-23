const myFn = function myFn(x) {
  if (x === undefined) {
    throw new Error('some error');
  }

  return true;
};

module.exports = { myFn };
