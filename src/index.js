'use strict';

// Load NPM modules
const converter = require('oas-raml-converter');
const readline = require('readline');
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');

// Store session object
const conversionSettings = {
  converter: void 0,
  source: void 0,
  dest: void 0,
  option: void 0
};

// Build converter index
const converterIndex = {
  1: {
    con: new converter.Converter(
      converter.Formats.RAML,
      converter.Formats.RAML
    ),
    name: 'RAML 0.8 > RAML 1.0'
  },
  2: {
    con: new converter.Converter(
      converter.Formats.RAML,
      converter.Formats.OAS20
    ),
    name: 'RAML 0.8 > OAS 2.0'
  },
  3: {
    con: new converter.Converter(
      converter.Formats.RAML,
      converter.Formats.OAS20
    ),
    name: 'RAML 1.0 > OAS 2.0'
  },
  4: {
    con: new converter.Converter(
      converter.Formats.RAML,
      converter.Formats.OAS30
    ),
    name: 'RAML 1.0 > OAS 3.0'
  },
  5: {
    con: new converter.Converter(
      converter.Formats.OAS20,
      converter.Formats.RAML
    ),
    name: 'OAS 2.0 > RAML 1.0'
  }
};

// Question 1
const question1 = (retry, answer) => `
${
  retry
    ? `"${answer}" is not a valid option! Please choose a valid option`
    : 'Choose the type of converter you want to use'
} (enter option 1-5):

1) RAML 0.8 > RAML 1.0
2) RAML 0.8 > OAS 2.0
3) RAML 1.0 > OAS 2.0
4) RAML 1.0 > OAS 3.0
5) OAS 2.0 > RAML 1.0

Enter now: `;

// Question 2
const question2 = (retry, answer) =>
  retry
    ? `The file path "${answer}" was not found! Please try again:`
    : `Enter the source path of the file: `;

// Question 3
const question3 = () => `Enter the destination path for the file: `;

// Question 4
const question4 = retry =>
  retry
    ? `You can only enter (y/n) to continue. Please try again: `
    : `Are you sure you want to continue (y/n): `;

// FUNCTION: Get file destination
const finalPrompt = (retry = false) =>
  new Promise((resolve, reject) => {
    // Init readline
    let rd = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    // Ask question
    rd.question(question4(retry), answer => {
      // Check that the answer is correct
      if (!['y', 'n'].includes((answer || '').toLowerCase())) {
        return (async () => {
          rd.close();
          try {
            await finalPrompt(true);
          } catch (err) {
            console.warn(`An error has occurred, ${err}`);
            console.error('Script will exit...');
          }
        })();
      }
      // Validate entry
      if ((answer || '').toLowerCase() !== 'y') {
        rd.close();
        return reject(`the conversion was cancelled by the user!`);
      }
      // Close readline
      rd.close();
      // Show in console
      console.log(
        'Checking destination file path & creating folders if necessary'
      );
      // Check that file path exists
      return mkdirp(path.dirname(conversionSettings.dest), function(err) {
        // Error
        err && reject(err);
        console.log('Destination file path verified');
        console.log(
          `Attempting to convert specification: ${
            converterIndex[conversionSettings.option].name
          }`
        );
        // Start process
        return conversionSettings.converter
          .convertFile(conversionSettings.source)
          .then(raml => {
            console.log('The conversion was successful');
            // Write file to disk
            return fs.writeFile(
              path.resolve(conversionSettings.dest),
              typeof raml === 'object' ? JSON.stringify(raml, null, 2) : raml,
              'utf8',
              err => {
                // Reject error
                err && reject(err);
                // Show result
                console.log(
                  'The file has been saved successfully! Script will exit :)'
                );
                // Resolve
                return resolve();
              }
            );
          })
          .catch(err => reject(err));
      });
    });
  });

// FUNCTION: Get file destination
const getConverterDest = () =>
  new Promise((resolve, reject) => {
    // Init readline
    let rd = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    // Ask question
    return rd.question(question3(), answer => {
      // Validate entry
      if (!answer) {
        rd.close();
        return reject(`destination file path is not defined or is invalid!`);
      }
      // Assign converter and close the
      conversionSettings.dest = answer;
      // Close readline
      rd.close();
      // Resolve
      return resolve();
    });
  });
// FUNCTION: Get file source
const getConverterSource = (retry = false, lastAnswer = void 0) =>
  new Promise(resolve => {
    // Init readline
    let rd = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    // Ask question
    return rd.question(question2(retry, lastAnswer), answer => {
      // Validate entry
      if (!fs.existsSync(path.resolve(answer))) {
        return (async () => {
          rd.close();
          try {
            await getConverterSource(true, path.resolve(answer));
            await getConverterDest();
            await finalPrompt();
          } catch (err) {
            console.warn(`An error has occurred, ${err}`);
            console.error('Script will exit...');
          }
        })();
      }
      // Assign converter and close the
      conversionSettings.source = answer;
      // Close readline
      rd.close();
      // Resolve
      return resolve();
    });
  });

// FUNCTION: Get type of converter
const getConverterType = (retry = false, lastAnswer = void 0) =>
  new Promise(resolve => {
    // Init readline
    let rd = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    // Ask question
    return rd.question(question1(retry, lastAnswer), answer => {
      // Validate entry
      if (!['1', '2', '3', '4', '5'].includes(answer)) {
        return (async () => {
          rd.close();
          try {
            await getConverterType(true, answer);
            await getConverterSource();
            await getConverterDest();
            await finalPrompt();
          } catch (err) {
            console.warn(`An error has occurred, ${err}`);
            console.error('Script will exit...');
          }
        })();
      }
      // Assign converter and close the
      conversionSettings.converter = converterIndex[answer].con;
      conversionSettings.option = answer;
      // Close readline
      rd.close();
      // Resolve
      return resolve();
    });
  });

// FUNCTION: Start process
const execute = async () => {
  try {
    await getConverterType();
    await getConverterSource();
    await getConverterDest();
    await finalPrompt();
  } catch (err) {
    console.warn(`An error has occurred, ${err}`);
    console.error('Script will exit...');
  }
};

// Start process
execute();
