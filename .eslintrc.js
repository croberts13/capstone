//https://eslint.org/docs/user-guide/configuring
module.exports = {
    root: true,
    extends: ['eslint-config-mfe/eslintrc.es6.js'],
    ignorePatterns: ['node_modules', 'client/'],
    rules: {
        camelcase: 'off',
        'arrow-parren': 'asNeeded',
        'comma-dangle': 'off'
    }
};
