'use strict';

// Load process functions
const {
  finalPrompt,
  getConverterDest,
  getConverterSource,
  getConverterType
} = require('./process');

// Store session object
let options = {
  converter: void 0,
  source: void 0,
  dest: void 0,
  option: void 0,
  pipeline: pipeline
};

// FUNCTION: Merge new changes into application
const mergeChanges = (delta, options) =>
  Object.assign({}, options, delta);

// FUNCTION: Stage 1
const stage1 = (stage, args) =>
  new Promise(resolve => {
    console.log('Resolving!');
    if (stage >= 1) {
      (async () => {
        options = mergeChanges(
          (await (stage === 1))
            ? getConverterType.apply(null, args)
            : getConverterType(false, void 0, options),
          options
        );
        resolve();
      })();
    } else {
      resolve();
    }
  });

// FUNCTION: Stage 2
const stage2 = (stage, args) =>
  new Promise(resolve => {
    if (stage >= 2) {
      (async () => {
        options = mergeChanges(
          (await (stage === 2))
            ? getConverterSource.apply(null, args)
            : getConverterSource(false, void 0, options),
          options
        );
        resolve();
      })();
    } else {
      resolve();
    }
  });

// FUNCTION: Stage 3
const stage3 = (stage, args) =>
  new Promise(resolve => {
    if (stage >= 3) {
      (async () => {
        options = mergeChanges(
          (await (stage === 3))
            ? getConverterDest.apply(null, args)
            : getConverterDest(false, void 0, options),
          options
        );
        resolve();
      })();
    } else {
      resolve();
    }
  });

// FUNCTION: Stage 4
const stage4 = (stage, args) =>
  new Promise(resolve => {
    if (stage >= 4) {
      (async () => {
        options = mergeChanges(
          (await (stage === 4))
            ? finalPrompt.apply(null, args)
            : finalPrompt(false, void 0, options)
        );
        resolve();
      })();
    } else {
      resolve();
    }
  });

// FUNCTION: Process pipeline
async function pipeline(
  stage,
  args = [false, void 0, options]
) {
  await stage1(stage || 1, args);
  await stage2(stage || 2, args);
  await stage3(stage || 3, args);
  await stage4(stage || 4, args);

  // Stage 0
  // (stage >= 1) &&
  //   (options = mergeChanges(
  //     (await (stage === 1))
  //       ? getConverterType.apply(null, args)
  //       : getConverterType(false, void 0, options),
  //     options
  //   ));
  // Stage 1
  // (stage >= 2) &&
  //   (options = mergeChanges(
  //     (await (stage === 2))
  //       ? getConverterSource.apply(null, args)
  //       : getConverterSource(false, void 0, options),
  //     options
  //   ));
  // Stage 2
  // (stage >= 3) &&
  //   (options = mergeChanges(
  //     (await (stage === 3))
  //       ? getConverterDest.apply(null, args)
  //       : getConverterDest(false, void 0, options),
  //     options
  //   ));
  // Stage 3
  // (stage >= 4) &&
  //   (options = mergeChanges(
  //     (await (stage === 4))
  //       ? finalPrompt.apply(null, args)
  //       : finalPrompt(false, void 0, options)
  //   ));
}
// FUNCTION: Start process
try {
  pipeline(1, []);
} catch (err) {
  console.warn(`An error has occurred, ${err}`);
  console.error('Script will exit...');
  process.exit();
}
