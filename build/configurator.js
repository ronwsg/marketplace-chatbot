const path = require("path");

function create(options) {
    if(!options) {
        throw new Error("Must specify non empty options");
    }

    if(!options.baseDir) {
        throw new Error("Must specify non empty baseDir");
    }

    return {
        baseDir: options.baseDir,
    };
}

module.exports = {
    create: create,
};
