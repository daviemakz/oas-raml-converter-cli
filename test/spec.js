'use strict';

// Load NPM modules
const { assert } = require('chai');
const converter = require('oas-raml-converter');

// Load libs
const converterCore = require('../src/converter')();

// Converter reference object
const converterRef = {
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

// Test
describe('oas-raml-converter-cli', () => {
  describe('converter', () => {
    for (let option in converterRef) {
      if (converterRef.hasOwnProperty(option)) {
        describe(`check converter: ${converterRef[option].name}`, () => {
          it('hasName', () => {
            assert.isDefined(converterCore[option].name);
          });
          it('nameIsExpected', () => {
            assert.equal(converterCore[option].name, converterRef[option].name);
          });
          it('hasConverter', () => {
            assert.isDefined(converterCore[option].con);
          });
          it('converterIsExpected', () => {
            assert.deepEqual(
              converterCore[option].con,
              converterRef[option].con
            );
          });
        });
      }
    }
  });
});
