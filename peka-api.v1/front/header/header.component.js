'use strict';

angular.
    module('header').
    component('header', {
        templateUrl: 'header/header.template.html',
        controller: function headerController($scope, $mdSidenav) {
            console.log('header on');
            $scope.showGuideDownload = function ($mdMenu, ev) {
                $mdMenu.open(ev);
            }
            $scope.hideMenu = function() {
                $mdSidenav('left').toggle();
            }
        }
});
