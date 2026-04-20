module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'src/test.ts'
    ],
    browsers: ['Chrome'],
    singleRun: true,
    reporters: ['progress'],
    preprocessors: {
      'src/test.ts': ['webpack']
    },
    webpack: {
      // Your webpack configuration
    }
  });
};