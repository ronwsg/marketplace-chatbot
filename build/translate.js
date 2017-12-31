var fs = require('fs');
var glob = require("glob")
var mkdirp = require('mkdirp');
var chalk = require('chalk')
var debug = require('debug')
var log = debug('app:bin:translate')
var warning = debug('app:bin:translate:warning');
var error = debug('app:bin:translate:error');

const MESSAGES_PATTERN = './app/**/*.messages.json';
const LANG_DIR = './app/i18n/';
const DEFAULT_LOCALE = 'en-US'

let errors = []

const isForbiddenChars = (string) => /[A-Z]/.test(string)

const validateMessage = (collection, descriptors, key) => {
  if (typeof descriptors.msgsObject[key] !== 'string') {
    errors.push((`ERROR in file: ${descriptors.filename} message of entry '${key}' must be a string!`))
  }
  if (collection.hasOwnProperty(key)) {
    errors.push(`Duplicate message id: ${key}`);
  }
  if (isForbiddenChars(key)) {
    warning(`WARNING: Should not use uppercase letters in message ID --> ${key}`)
  }
}

log('Run Translate')

// Aggregates the messages from the app's React component messages files
// message file pattern should be: <component name>.messages.json
// An error will be thrown if there are messages in different components that use the same `id`.
// The result is a flat collection of `id: message` pairs for the app's default locale.
let defaultMessages = glob.sync(MESSAGES_PATTERN)
  .map((filename) => {
    log('processing file ' + filename)
    return {name: filename, data: fs.readFileSync(filename, 'utf8')}
  })
  .map((file) => ({msgsObject: JSON.parse(file.data), filename: file.name}))
  .reduce((collection, descriptors) => {
    Object.keys(descriptors.msgsObject).forEach((key) => {
      validateMessage(collection, descriptors, key)

      collection[key] = descriptors.msgsObject[key];
    });

    return collection;
  }, {});

// check error buffer
if (errors.length > 0) {
  for (let err of errors) {
    console.log(chalk.red(err))
  }
  process.exit(1)
}

mkdirp.sync(LANG_DIR);
fs.writeFileSync(LANG_DIR + DEFAULT_LOCALE + '.json', JSON.stringify(defaultMessages, null, 2));
