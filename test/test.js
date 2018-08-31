const lint = require('mocha-eslint');

const paths = [
  '.',
  '!./node_modules',
];

lint(paths);

require('./api');
