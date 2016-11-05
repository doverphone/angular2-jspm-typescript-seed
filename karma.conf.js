// Karma configuration
'use strict';

var argv = require('yargs').argv;
var chalk = require('chalk');
var Config = require('./tools/config').default;

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './' + Config.BROWSER_PATH,

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jspm', 'jasmine'],

    // list of files / patterns to load in the browser
    // See https://github.com/UIUXEngineering/karma-jspm
    jspm: {
      stripExtension: false,

      /**
       * jspm.browser.js or custom name.
       */
      browserConfig: null,

      /**
       * jspm.dev.js or custom name.
       */
      devConfig: null,

      /**
       * jspm.node.js or custom name.
       */
      nodeConfig: null,

      /**
       * jspm.config.js or custom name.
       */
      jspmConfig: 'jspm.karma.config.js',

      packages: 'jspm_packages',

      /**
       * Adapters load application and test files,
       * do any pre-work needed to run tests,
       * and implement the karma.start method.
       *
       * 'angular2' is the only option for now.
       * If not defined, a standard set of files
       * needed for angular 2 testing are loaded,
       * provided they are installed via jspm.
       *
       * PR's welcome to implement other frameworks.
       *
       * @param path to adapter | 'angular2'
       */
      adapter: 'angular2',

      /**
       * If test files are wrapped in a method,
       * call the wrapper to initiate tests.
       *
       * @param wrapper method name
       */
      testWrapperFunctionName: 'main',


      /**
       * Files loaded by system js before app is loaded.
       * They will load in same order provided.
       *
       * Default files are set for 'angular2' adapter.
       * This property will override defaults if set.
       */
      preloadBySystemJS: [
        // 'es6-shim',
        // 'reflect-metadata/Reflect.js',
        //
        // // Test Assistance
        // 'zone.js/dist/zone.js',
        // 'zone.js/dist/proxy.js',
        // 'zone.js/dist/sync-test.js',
        // 'zone.js/dist/jasmine-patch.js',
        // 'zone.js/dist/async-test.js',
        // 'zone.js/dist/fake-async-test.js',
        // 'zone.js/dist/long-stack-trace-zone.js',
        //
        // // TestBed.initTestEnvironment
        // '@angular/core/testing',
        // '@angular/platform-browser-dynamic/testing'
      ],

      /**
       * SystemJS will load ts files.
       *
       * Glob 7.x supported.
       *
       * See https://www.npmjs.com/package/glob.
       *
       */
      files: [
        'app/**/!(*.e2e-spec).ts',
        'app/**/*.html',
        'app/**/*.css',
        'assets/**/*.json'
      ]
    },

    // must have path roots of serveFiles and loadFiles, suppress annoying 404 warnings.
    proxies: {
      '/app/': '/base/app/',
      '/assets/': '/base/assets/',
      '/jspm_packages/': '/base/jspm_packages/',
      '/scss/': '/base/scss/'
    },

    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'app/**/!(*.spec).ts': ['jspm']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    // reporters: ['junit', 'coverage', 'spec'],
    reporters: ['mocha', 'jspm'],

    coverageReporter: {

      // map coverage to source typescript or es6 files.
      remap: true,

      dir: process.cwd() + '/test-reports/unit',

      subdir: function(directory) {
        return directory.replace(/\s/g, '_');
      },

      reporters: [

        // will generate html report
        {type: 'html'},

        // will generate json report file and this report is loaded to
        // make sure failed coverage cause gulp to exit non-zero
        {type: 'json', file: 'coverage-final.json'},

        // will generate Icov report file and this report is published to coveralls
        {type: 'lcov'},

        // it does not generate any file but it will print coverage to console
        // a summary of the coverage
        // {type: 'text-summary'},

        // it does not generate any file but it will print coverage to console
        // a detail report of every file
        {type: 'text'}
      ]
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,

    loggers: [{
      "type": "file",
      "filename": "./log_file.log",
      "maxLogSize": 20480,
      "backups": 3,
      "category": "absolute-logger"
    }],

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      'Chrome'
    ],

    plugins: [
      'karma-uiuxengineering-jspm',
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-ie-launcher',
      'karma-mocha-reporter'
    ],

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },


    browserNoActivityTimeout: 3000000,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Passing command line arguments to tests
    client: {
      files: argv.files
    }
  });

  if (process.env.APPVEYOR) {
    config.reporters = ['mocha'];
    config.browsers = ['IE'];
    config.singleRun = true;
    config.browserNoActivityTimeout = 3000000; // Note: default value (10000) is not enough
    chalkHeader('APPVEYOR');
  } else if (process.env.TRAVIS || process.env.CIRCLECI) {
    config.reporters = ['mocha'];
    config.browsers = ['Chrome_travis_ci'];
    config.singleRun = true;
    config.browserNoActivityTimeout = 3000000; // Note: default value (10000) is not enough
    chalkHeader('TRAVIS || CIRCLECI');
  } else {
    chalkHeader('LOCALHOST');
  }

  chalkOptionList(config);
};

function chalkOptionList (config) {
  chalkOption(config, 'frameworks');
  chalkOption(config, 'reporters');
  chalkOption(config, 'browsers');
  chalkOption(config, 'singleRun');
  chalkOption(config, 'browserNoActivityTimeout');
}

function chalkHeader(msg) {
  console.log('\n' + chalk.yellow.bgRed.bold('\nKarma config options for ' + msg + ' environment:'));
}

function chalkOption(option, prop) {
  console.log(chalk.yellow(prop + ": " + option[prop]));
}
