'use strict';

// Load process functions
const {
  finalPrompt,
  getConverterDest,
  getConverterSource,
  getConverterType,
  handleFatalError
} = require('./process');

// FUNCTION: Merge new changes into application
const mergeChanges = (delta, options) => Object.assign({}, options, delta);

// FUNCTION: Stage 1
const stage1 = (stage, args, options) => {
  return new Promise(resolve => {
    if (!stage || stage <= 1) {
      (async () => {
        try {
          resolve(
            mergeChanges(
              await ((stage, args, options) =>
                stage === 1
                  ? getConverterType.apply(null, args)
                  : getConverterType(false, void 0, options))(
                stage,
                args,
                options
              ),
              options
            )
          );
        } catch (err) {
          handleFatalError(err);
        }
      })();
    } else {
      resolve(options);
    }
  });
};

// FUNCTION: Stage 2
const stage2 = (stage, args, options) =>
  new Promise(resolve => {
    if (!stage || stage <= 2) {
      (async () => {
        try {
          resolve(
            mergeChanges(
              await ((stage, args, options) =>
                stage === 2
                  ? getConverterSource.apply(null, args)
                  : getConverterSource(false, void 0, options))(
                stage,
                args,
                options
              ),
              options
            )
          );
        } catch (err) {
          handleFatalError(err);
        }
      })();
    } else {
      resolve(options);
    }
  });

// FUNCTION: Stage 3
const stage3 = (stage, args, options) =>
  new Promise(resolve => {
    if (!stage || stage <= 3) {
      (async () => {
        try {
          resolve(
            mergeChanges(
              await ((stage, args, options) =>
                stage === 3
                  ? getConverterDest.apply(null, args)
                  : getConverterDest(false, void 0, options))(
                stage,
                args,
                options
              ),
              options
            )
          );
        } catch (err) {
          handleFatalError(err);
        }
      })();
    } else {
      resolve(options);
    }
  });

// FUNCTION: Stage 4
const stage4 = (stage, args, options) =>
  new Promise(resolve => {
    if (!stage || stage <= 4) {
      (async () => {
        try {
          resolve(
            mergeChanges(
              await ((stage, args, options) =>
                stage === 4
                  ? finalPrompt.apply(null, args)
                  : finalPrompt(false, options))(stage, args, options)
            )
          );
        } catch (err) {
          handleFatalError(err);
        }
      })();
    } else {
      resolve(options);
    }
  });

// FUNCTION: Process pipeline
async function pipeline(stage, args, options) {
  // Track stage
  let currentState = stage;
  let currentArgs = args;
  let currentOptions = options;
  // SUB-FUNCTION: Clear state
  const clearState = (options, stepState, procesState) => {
    // Clear state if past the correct error state
    if (stepState === procesState) {
      currentState = void 0;
      currentArgs = void 0;
    }
    // Return
    return options;
  };
  // Stage 1
  currentOptions = await stage1(currentState, currentArgs, currentOptions);
  // Clear state
  clearState(currentOptions, 1, currentState);
  // Stage 2
  currentOptions = await stage2(currentState, currentArgs, currentOptions);
  // Clear state
  clearState(currentOptions, 2, currentState);
  // Stage 3
  currentOptions = await stage3(currentState, currentArgs, currentOptions);
  // Clear state
  clearState(currentOptions, 3, currentState);
  // Stage 4
  currentOptions = await stage4(currentState, currentArgs, currentOptions);
}

// Store session object
let options = {
  converter: void 0,
  source: void 0,
  dest: void 0,
  option: void 0,
  pipeline: pipeline
};

// FUNCTION: Start process
try {
  pipeline(void 0, [], options);
} catch (err) {
  handleFatalError(err);
}
