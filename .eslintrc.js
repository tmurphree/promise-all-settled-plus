module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: "airbnb-base",
  rules: {
    'comma-dangle': [
      'error', 
      { 
        'arrays': 'always-multiline',
        'functions': 'never',
        'objects': 'always-multiline',
      },
    ],
    'linebreak-style': ['error', 'unix'],
    'no-console': 'off',
    'no-else-return': ['error', { 'allowElseIf': true }],
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
    'operator-linebreak': ['error', 'after'],
  },
};
