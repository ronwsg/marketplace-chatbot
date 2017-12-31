const gulp = require("gulp");
const env = require('gulp-env');
const path = require("path");
const configurator = require("./configurator");
const Build = require("./build");

function createBuilder() {
  const baseDir = path.join(__dirname, "..");

  const config = configurator.create({
    baseDir: baseDir,
  });

  return new Build(config);
}

gulp.task('set-env-development', function () {
  env({
    vars: {
      NODE_ENV: 'development',
      DEBUG: "app:*,express:*",
      DEBUG_COLORS: true
    }
  })
});

gulp.task('set-env-production', function () {
  env({
    vars: {
      NODE_ENV: 'production',
      DEBUG: "app:webpack*",
      DEBUG_COLORS: true
    }
  })
});

gulp.task("dev", ['set-env-development'], function () {
  return createBuilder().start();
});

gulp.task("prod", ['set-env-production'], function () {
  return createBuilder().start();
});

gulp.task("dist", ['set-env-production'], function () {
  return createBuilder().dist();
});

gulp.task("dist:stats", ['set-env-production'], function () {
  return createBuilder().stats();
});

gulp.task("dist:dev", ['set-env-development'], function () {
  return createBuilder().dist();
});

gulp.task("test", ['set-env-development'], function () {
  return createBuilder().test();
});

gulp.task("test:dev", ['set-env-development'], function () {
  return createBuilder().testDev();
});

gulp.task("lint", function () {
  return createBuilder().lint();
});

gulp.task("i18n", ['set-env-development'], function () {
  return createBuilder().i18n();
});

gulp.task("compile-client", function () {
  return createBuilder().compileClient();
});

gulp.task("compile-server", function () {
  return createBuilder().compileServer();
});

gulp.task("pack", function () {
  return createBuilder().compileServer();
});
