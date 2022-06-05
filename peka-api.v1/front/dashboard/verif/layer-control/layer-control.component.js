'use strict';

angular
    .module('layerControl')
    .component('layerControl', {
        templateUrl: 'layer-control/layer-control.template.html',
        controller:
            function layercontrolController($scope) {
                $scope.detailFrame = 'http://karhutla.ai-innovation.id/dashboard/verif/webgis/';
            }
});
