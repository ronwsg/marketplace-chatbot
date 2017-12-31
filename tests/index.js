//
//  require.context is a special webpack function
//  it allows us to dynamically decide which files are considered dependency of this file and therefore will
//  be processed by webpack
//  In our case, we should search for all app/**/*.spec.ts files
//  However since we want to generate a code coverag report we includes all application TS[x] files
//  that's way a TS file that was not covered by our tests is still visible inside coverage report
//
// i18n polyfill
if (!global.Intl) {
    global.Intl = require('intl');
    // require('intl/locale-data/jsonp/en.js');
}

const testsContext = require.context('../app', true, /^((?!main.tsx).)*\.ts[x]?$/)
testsContext.keys().forEach(testsContext);
