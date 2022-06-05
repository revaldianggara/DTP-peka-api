'use strict';

angular.module('untitled', [
    'ngMaterial',
    'ngMessages',
    'header',
    'layerControl'
])
.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('grey', {
            'default': '300',
            'hue-1': '500',
            'hue-2': '200',
        });
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