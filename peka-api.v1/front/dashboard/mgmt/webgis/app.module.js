'use strict';

angular.module('untitled', [
    'ngMaterial',
    'ngMessages',
    'header',
    'ng-slide-down',
    'ng-scroll-end',
    'layerControl',
    'mapService'
])
.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('grey', {
            'default': '900'
        })
        .dark();
    $mdThemingProvider.theme('predHS')
        .primaryPalette('purple', {
            'default': '700'
        });
    $mdThemingProvider.theme('HS')
        .primaryPalette('red', {
            'default': '600'
        });
    $mdThemingProvider.theme('Veg')
        .primaryPalette('green', {
            'default': '600'
        });
    $mdThemingProvider.alwaysWatchTheme(true);
});