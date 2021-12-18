const fabric = require('@umijs/fabric');

module.exports = {
  singleQuote: true,
  printWidth: 80,
  proseWrap: "always",
  tabWidth: 4,
  requireConfig: false,
  useTabs: false,
  railingComma: "none",
  bracketSpacing: true,
  jsxBracketSameLine: false,
  semi: true,
  ...fabric.prettier,
};
