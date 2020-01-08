module.exports = {
  extends: 'airbnb-base',
  plugins: [
    'jsdoc'
  ],
  settings: {
    jsdoc: {
      tagNamePreference: {
        returns: 'return'
      }
    }
  },
  rules: {
    'no-underscore-dangle': ['error', { 'allowAfterThis': true }],
    'prefer-const': ['warn'],
    'indent': ['error', 2, { 'MemberExpression': 0 , 'SwitchCase': 1 }],
    'class-methods-use-this': ['off'],
    'max-lines-per-function': [
      'warn',
      {'max': 60, 'skipComments': true, 'skipBlankLines': true}
    ],
    'max-lines': [
      'warn',
      {'max': 500}
    ],
    'jsdoc/require-jsdoc': [
      'warn',
      {
        'require': {
          'FunctionExpression': true,
          'MethodDefinition': true
        }
      }
    ],
    'quotes': [
      'error',
      'single'
    ],
  }
};
