/**
 * Export a function. Accept the base config as the only param.
 * @param {Object} options
 * @param {Required<import('webpack').Configuration>} options.config
 * @param {'DEVELOPMENT' | 'PRODUCTION'} options.mode - change the build configuration. 'PRODUCTION' is used when building the static version of storybook.
 */
module.exports = async ({ config, mode }) => {
  // Make whatever fine-grained changes you need

  config.stats = {
    errorDetails: false,
    warningsFilter: [
      /imported as .* was not found/,
      /deprecated and will be removed soon/,
      /Conflicting values for 'process.env'/,
    ],
  };

  // Return the altered config
  return config;
};
