module.exports = {
  extends: "airbnb-base",
  rules: {
    "no-underscore-dangle": ["error", { "allowAfterThis": true }],
    "prefer-const": ["warn"],
    "indent": ["error", 2, { "MemberExpression": 0 , "SwitchCase": 1 }],
    "class-methods-use-this": ["off"]
  }
};
