const webpackConfig = require('./build/webpack.config')(true);
const build_reports = 'build_reports/';

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['es6-shim', 'mocha', 'chai', 'sinon'],

    reporters: ['mocha', 'junit', 'coverage', 'remap-coverage'],

    //for jenkins to run this build
    junitReporter: {
      outputDir: build_reports + 'test-results',
      outputFile: 'test-results.xml'
    },

    //generates coverage reports
    coverageReporter: {
      type: 'in-memory',
      check: {
        global: {
          statements: 75,
          branches: 50,
          functions: 65,
          lines: 75
        }
      }
    },

    remapCoverageReporter: {
      'text': null,
      'text-summary': null,
      'json': 'build_reports/test-results/coverage/report-json/coverage.json',
      'html': 'build_reports/test-results/coverage/report-html',
      'lcovonly': 'build_reports/test-results/coverage/report-lcov/lcov.info'
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './tests/index.js': ['webpack', 'sourcemap']
    },

    // list of files / patterns to load in the browser
    files: [
      './tests/index.js',
      './tests/find-polyfill.js',
      './tests/findIndex-polyfill.js',
      './node_modules/phantomjs-polyfill-object-assign/object-assign-polyfill.js',
      './node_modules/es6-promise/dist/es6-promise.auto.js',
    ],

    // list of files to exclude
    exclude: [
    ],

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    client: {
      captureConsole: true,
      mocha: {
        bail: false
      }
    },

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true,
      stats: 'errors-only'
    },
  })
}