const gulp = require("gulp")
const helpers = require("./helpers")
const open = require("open")
const path = require("path")
const tslint = require("gulp-tslint")
const tslintReporter = require("gulp-tslint-jenkins-reporter")
const dependencyCheck = require('check-dependencies')
var gutil = require('gulp-util')
var fs = require('fs')

class Build {
  constructor(config) {
    if (!config) {
      throw new Error("Build.ctor must recieve a non empty config object")
    }

    this.config = config
  }

  start() {
    return Promise.resolve()
      .then(this.depsCheck.bind(this))
      // .then(this.restoreTypingsClient.bind(this))
      //
      //  Webpack compiles TS files at runtime to this step is not really required
      //  However, we prefer to catch compilation errors before running the dev server
      //
      .then(this.compileClient.bind(this))
      // .then(this.restoreTypingsServer.bind(this))
      .then(this.compileServer.bind(this))
      .then(this.lint.bind(this))
      .then(this.i18n.bind(this))
      .then(this.runServer.bind(this))
      .then(this.runBrowser.bind(this))
      .catch((err) => { gutil.log(gutil.colors.red('ERROR in build!!!' + err)) })
  }

  dist() {
    return Promise.resolve()
      .then(this.lint.bind(this))
      .then(this.i18n.bind(this))
      .then(this.runWebpack.bind(this))
      // .then(this.copyIndexHTML.bind(this))
      .then(this.copyProductionServer.bind(this))
  }

  stats() {
    return Promise.resolve()
      .then(this.lint.bind(this))
      .then(this.i18n.bind(this))
      .then(this.runWebpackStats.bind(this))
      // .then(this.copyIndexHTML.bind(this))
      .then(this.copyProductionServer.bind(this))
  }

  test() {
    gutil.log("Running tests");
    return Promise.resolve()
      .then(this.depsCheck.bind(this))
      .then(this.lint.bind(this))
      .then(this.i18n.bind(this))
      .then(() => helpers.spawnAsPromise('node', ['node_modules/karma/bin/karma', 'start']))
      .catch((err) => { gutil.log(gutil.colors.red('Automated tests ended with FAILURE!!!'), err) })
  }

  testDev() {
    gutil.log("Running tests");
    return helpers.spawnAsPromise('node', ['node_modules/karma/bin/karma', 'start', '--auto-watch', '--no-single-run', '--log-level', 'debug'])
  }

  depsCheck() {
    return Promise.resolve()
      .then(dependencyCheck.bind(this))
      .then((out) => {
        return new Promise((resolve, reject) => {
          if (out.status !== 0 || !out.depsWereOk) {
            gutil.log(gutil.colors.red('Found mismatch in package module versions!'))
            gutil.log(out.error.join('\n'))
            reject(out)
          }
          else {
            gutil.log(gutil.colors.green('Package dependencies are OK!'))
            resolve()
          }
        })
      })
  }

  lint() {
    gutil.log("Running lint");

    return new Promise((resolve, reject) => {
      gulp.src(['app/**/*.ts', 'app/**/*.tsx', 'server/app.ts'])
        .pipe(tslint({
            formatter: 'stylish'
        }))
        .pipe(tslintReporter({ filename: 'build_reports/checkstyle.xml' }))
        .pipe(tslint.report({
            emitError: true,
            summarizeFailureOutput: true
        }))
        .on('end', resolve)
        .on('error', reject)
    })
  }

  i18n() {
    gutil.log("Running lang");
    return helpers.spawnAsPromise('node', ['build/translate.js'])
      .catch((err) => {
        gutil.log(gutil.colors.red('TSList - ' + err))
        return Promise.reject()
      })
  }

  runServer() {
    gutil.log("Running server");
    // helpers.shellExec("node server/app.js");
    helpers.spawnAsPromise('node', ['server/app.js'])

    return Promise.resolve()
  }

  restoreTypingsServer() {
    gutil.log("Restoring server typings")

    // return helpers.shellExec("node ../node_modules/typings/dist/bin.js install", {
    //   cwd: path.join(this.config.baseDir, "server")
    // });
    return helpers.spawnAsPromise('node', ['../node_modules/typings/dist/bin.js', 'install'], {
      cwd: path.join(this.config.baseDir, "server")
    });
  }

  restoreTypingsClient() {
    gutil.log("Restoring client typings")

    // return helpers.shellExec("node node_modules/typings/dist/bin.js install");
    return helpers.spawnAsPromise('node', ['node_modules/typings/dist/bin.js', 'install'])
  }

  compileClient() {
    gutil.log("Compiling client typescript")
    // return helpers.shellExec("node node_modules/typescript/bin/tsc --project ./app");
    return helpers.spawnAsPromise('node', ['node_modules/typescript/bin/tsc', '--project', './app'])
  }

  compileServer() {
    gutil.log("Compiling server typescript")
    // return helpers.shellExec("node node_modules/typescript/bin/tsc --project ./server");
    return helpers.spawnAsPromise('node', ['node_modules/typescript/bin/tsc', '--project', './server'])
  }

  copyIndexHTML() {
    gutil.log("Copying index.html")

    return helpers.buildPromiseFromStream(gulp.src("./index.html"))
      .pipe(gulp.dest("dist"))
      .done();
  }

  copyProductionServer() {
    gutil.log("Copying forProduction.js");

    return helpers.buildPromiseFromStream(gulp.src("./server/forProduction.js"))
      .pipe(gulp.dest("dist"))
      .done();
  }

  runWebpack() {
    gutil.log("Packaging for production")
    // return helpers.shellExec("node node_modules/webpack/bin/webpack.js --config ./build/webpack.config.prod.js");
    return helpers.spawnAsPromise('node', ['node_modules/webpack/bin/webpack.js', '--config', './build/webpack.config.prod.js'])
  }

  runWebpackStats() {
    gutil.log("Packaging for production")
    // return helpers.shellExec("node node_modules/webpack/bin/webpack.js --config ./build/webpack.config.prod.js");
    // return helpers.spawnAsPromise('node',['node_modules/webpack/bin/webpack.js','--config','./build/webpack.config.prod.js', '--json'], 
    //   {stdio: ['pipe', fs.openSync('stats.json', 'w'), 'pipe']});
    return helpers.spawnAsPromise('node', ['node_modules/webpack/bin/webpack.js', '--config', './build/webpack.config.prod.stats.js'])
  }

  runBrowser() {
    gutil.log("Openning browser")

    open("http://localhost:8080")

    return Promise.resolve()
  }
}

module.exports = Build
