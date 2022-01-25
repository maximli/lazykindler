const fabric = require('@umijs/fabric');

module.exports = {
    singleQuote: true,
    printWidth: 80,
    proseWrap: 'always',
    tabWidth: 4,
    requireConfig: false,
    useTabs: false,
    bracketSpacing: true,
    jsxBracketSameLine: false,
    semi: true,
    trailingComma: 'all',
    singleQuote: true,
    semi: true,
    importOrder: ['^@core/(.*)$', '^@server/(.*)$', '^@ui/(.*)$', '^[./]'],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    ...fabric.prettier,
};
