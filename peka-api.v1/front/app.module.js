'use strict';

angular.module('untitled', [
    'ngMaterial',
    'ngMessages',
    'header',
    'layerControl',
    'mapService'
])
.config(function($mdThemingProvider, $sceDelegateProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('grey', {
        'default': '600', // by default use shade 400 from the pink palette for primary intentions
        'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
        'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
        'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
    })
    .accentPalette('blue', {
        'default': '200' // use shade 200 for default, and keep all other shades the same
    });
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain. **.
        'http://aplikasi.bbtmc.bppt.go.id:3838/**'
      ]);
});