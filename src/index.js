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

// FUNCTION: Promise assembler
const promiseBuilder = (currentStage, promiseFunction) => (
  stage,
  args,
  options
) =>
  new Promise(resolve => {
    if (!stage || stage <= currentStage) {
      (async () => {
        try {
          resolve(
            mergeChanges(
              await ((stage, args, options) =>
                stage === currentStage
                  ? promiseFunction.apply(null, args)
                  : promiseFunction(false, void 0, options))(
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
  currentOptions = await promiseBuilder(1, getConverterType)(
    currentState,
    currentArgs,
    currentOptions
  );
  // Clear state
  clearState(currentOptions, 1, currentState);
  // Stage 2
  currentOptions = await promiseBuilder(2, getConverterSource)(
    currentState,
    currentArgs,
    currentOptions
  );
  // Clear state
  clearState(currentOptions, 2, currentState);
  // Stage 3
  currentOptions = await promiseBuilder(3, getConverterDest)(
    currentState,
    currentArgs,
    currentOptions
  );
  // Clear state
  clearState(currentOptions, 3, currentState);
  // Stage 4
  currentOptions = await promiseBuilder(4, finalPrompt)(
    currentState,
    currentArgs,
    currentOptions
  );
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
