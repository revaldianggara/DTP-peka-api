(function () {
  "use strict";

  angular.module("app", [
      // Angular modules
      "ngRoute",
      "ngAnimate",
      "ngAria",
      "ngMaterial",
      "ng-scroll-end",
      'ng-slide-down',
      'textAngular',

      // 3rd Party Modules
      "ui.bootstrap",
      'duScroll',

      // Custom modules
      "app.nav",
      "chart.js",
      "layerControl",
      'mapService_webgis',
      'mapService_datainput',
      'angularFileUpload'
    ])
    .config(function ($mdThemingProvider) {
      $mdThemingProvider.theme('predHS')
        .primaryPalette('purple', {
          'default': '700'
        });
      $mdThemingProvider.theme('HS')
        .primaryPalette('red', {
          'default': '800'
        });
      $mdThemingProvider.theme('Veg')
        .primaryPalette('green', {
          'default': '600'
        });
      $mdThemingProvider.alwaysWatchTheme(true);
    });
})();