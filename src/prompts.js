'use strict';

// Question 1
const q1 = (retry, answer) => `${
  retry
    ? `\n"${answer}" is not a valid option! Please choose a valid option`
    : 'Choose the type of converter you want to use'
} (enter option 1-5):

1) RAML 0.8 > RAML 1.0
2) RAML 0.8 > OAS 2.0
3) RAML 1.0 > OAS 2.0
4) RAML 1.0 > OAS 3.0
5) OAS 2.0 > RAML 1.0

Enter now: `;

// Question 2
const q2 = (retry, answer) =>
  retry
    ? `The file path "${answer}" was not found! Please try again: `
    : 'Enter the source path of the file: ';

// Question 3
const q3 = () => 'Enter the destination path for the file: ';

// Question 4
const q4 = retry =>
  retry
    ? 'You can only enter (y/n) to continue. Please try again: '
    : 'Are you sure you want to continue (y/n): ';

// Exports
module.exports = {
  q1: q1,
  q2: q2,
  q3: q3,
  q4: q4
};
