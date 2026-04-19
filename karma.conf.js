module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {}
    },
    reporters: ['progress'],
    browsers: ['Chrome'],
    restartOnFileChange: true
  });
};