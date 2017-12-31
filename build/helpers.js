"use strict";

var shell = require("shelljs");
const { exec, spawn } = require('child_process');
var gutil = require('gulp-util');

function shellExec(command, options) {
    console.log("Running command: " + command);

    return new Promise(function(resolve, reject) {
        options = options || {};

        if(options.openNewCommandWindow) {
            if(process.platform == "win32") {
                command = "START " + command;
            }
        }

        shell.exec(command, options, function (code) {
            if (code != 0) {
                reject(new Error("Command \"" + command + "\" failed with exit code: " + code));
            }
            else {
                resolve();
            }
        });
    });
}

var buildPromiseFromStream = (function() {
    function PromiseBuilder(stream) {
        this.end = this.begin = stream;
    }

    PromiseBuilder.prototype.pipe = function(pipe) {
        this.end = this.end.pipe(pipe);

        return this;
    };

    PromiseBuilder.prototype.done = function() {
        var me = this;

        return new Promise(function(resolve, reject) {
            //
            //  Must read the stream completely (flowing mode), else, no end event will occur
            //
            me.end.resume();

            me.end.on('end', function () {
                resolve();
            });

            me.end.on('error', function (err) {
                me.begin.end();

                reject(err);
            });
        });
    };

    return function buildPromiseFromStream(stream) {
        return new PromiseBuilder(stream);
    }
})();

// //////////////////////////////////////////////////////////////////
// execute a child process as a Promise
// //////////////////////////////////////////////////////////////////
var execAsPromise = (command, options) => {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      }
      else{
          resolve('Finished successfully!')
      }
    })
  })
}

// //////////////////////////////////////////////////////////////////
// spawn a child process as a Promise
// //////////////////////////////////////////////////////////////////
var spawnAsPromise = (command, args, options) => {
  return new Promise((resolve, reject) => {
    let opts = options ? options : {}
    opts['stdio'] = options && options['stdio'] ? options['stdio'] : 'inherit'
    gutil.log(gutil.colors.cyan("executing >>> %s %s | %j"),command, args.join(' '), opts);
    let proc = spawn(command, args, opts)
    
    proc.on('close', (code) => {
      if (code !== 0) {
        reject(`error: process exited with code ${code}`);
      }
      else{
        resolve('Finished successfully!')
      }
    });
  })
}

module.exports = {
    shellExec: shellExec,
    buildPromiseFromStream: buildPromiseFromStream,
    execAsPromise: execAsPromise,
    spawnAsPromise: spawnAsPromise,
};
