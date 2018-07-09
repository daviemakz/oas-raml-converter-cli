'use strict';

// Load NPM modules
const readline = require('readline');
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');

// Load libs
const mainOptions = require('./../');
const converterIndex = require('./convIndex')();
const { q1, q2, q3, q4 } = require('./prompts');

// FUNCTION: Get file destination
const finalPrompt = (retry = false, options) =>
  new Promise((resolve, reject) => {
    // Init readline
    let rd = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    // Ask question
    rd.question(q4(retry), answer => {
      // Check that the answer is correct
      if (
        !['y', 'n'].includes((answer || '').toLowerCase())
      ) {
        return (async () => {
          rd.close();
          try {
            options.pipeline(4, [true, options]);
            // await finalPrompt(true);
          } catch (err) {
            console.warn(`An error has occurred, ${err}`);
            console.error('Script will exit...');
            process.exit();
          }
        })();
      }
      // Validate entry
      if ((answer || '').toLowerCase() !== 'y') {
        rd.close();
        return reject(
          'the conversion was cancelled by the user!'
        );
      }
      // Close readline
      rd.close();
      // Show in console
      console.log(
        'Checking destination file path & creating folders if necessary'
      );
      // Check that file path exists
      return mkdirp(path.dirname(options.dest), function(
        err
      ) {
        // Error
        err && reject(err);
        console.log('Destination file path verified');
        console.log(
          `Attempting to convert specification: ${
            converterIndex[options.option].name
          }`
        );
        // Start process
        return options.converter
          .convertFile(options.source)
          .then(raml => {
            console.log('The conversion was successful');
            // Write file to disk
            return fs.writeFile(
              path.resolve(options.dest),
              typeof raml === 'object'
                ? JSON.stringify(raml, null, 2)
                : raml,
              'utf8',
              err => {
                // Reject error
                err && reject(err);
                // Show result
                console.log(
                  'The file has been saved successfully! Script will exit :)'
                );
                // Resolve
                return resolve({});
              }
            );
          })
          .catch(err => reject(err));
      });
    });
  });

// FUNCTION: Get file destination
const getConverterDest = options =>
  new Promise((resolve, reject) => {
    // Init readline
    let rd = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    // Ask question
    return rd.question(q3(), answer => {
      // Validate entry
      if (!answer) {
        rd.close();
        return reject(
          'destination file path is not defined or is invalid!'
        );
      }
      // // Assign converter and close the
      // options.dest = answer;
      // Close readline
      rd.close();
      // Resolve
      return resolve({
        dest: answer
      });
    });
  });

// FUNCTION: Get file source
const getConverterSource = (
  retry = false,
  lastAnswer = void 0,
  options
) =>
  new Promise(resolve => {
    // Init readline
    let rd = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    // Ask question
    return rd.question(q2(retry, lastAnswer), answer => {
      // Validate entry
      if (!fs.existsSync(path.resolve(answer))) {
        return (async () => {
          rd.close();
          try {
            options.pipeline(2, [
              true,
              path.resolve(answer),
              options
            ]);
            // await getConverterSource();
            // await getConverterDest(options);
            // await finalPrompt(false, options);
          } catch (err) {
            console.warn(`An error has occurred, ${err}`);
            console.error('Script will exit...');
            process.exit();
          }
        })();
      }
      // // Assign converter and close the
      // options.source = answer;
      // Close readline
      rd.close();
      // Resolve
      return resolve({
        source: answer
      });
    });
  });

// FUNCTION: Get type of converter
const getConverterType = (
  retry = false,
  lastAnswer = void 0,
  options
) =>
  new Promise(resolve => {
    // Init readline
    let rd = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    // Ask question
    return rd.question(q1(retry, lastAnswer), answer => {
      // Validate entry
      if (!['1', '2', '3', '4', '5'].includes(answer)) {
        return (async () => {
          rd.close();
          try {
            options.pipeline(1, [true, answer, options]);
            // await getConverterType(true, answer, options);
            // await getConverterSource(false, void 0, options);
            // await getConverterDest(options);
            // await finalPrompt(false, options);
          } catch (err) {
            console.warn(`An error has occurred, ${err}`);
            console.error('Script will exit...');
            process.exit();
          }
        })();
      }
      // // Assign converter and close the
      // options.converter = converterIndex[answer].con;
      // options.option = answer;
      // Close readline
      rd.close();
      // Resolve
      return resolve({
        converter: converterIndex[answer].con,
        option: answer
      });
    });
  });

// Exports
module.exports = {
  finalPrompt: finalPrompt,
  getConverterDest: getConverterDest,
  getConverterSource: getConverterSource,
  getConverterType: getConverterType
};
