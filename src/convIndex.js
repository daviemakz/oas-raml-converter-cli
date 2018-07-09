'use strict';

// Load NPM modules
const converter = require('oas-raml-converter');

// Build converter index
module.exports = () => ({
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
});
