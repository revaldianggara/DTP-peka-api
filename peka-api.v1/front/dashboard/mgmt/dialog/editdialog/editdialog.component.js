'use strict';

angular.
    module('editdialog').
    controller('editdialog', ['$scope', '$mdDialog', '$http', 'dataToPass', editmodeldialog]);
        function editmodeldialog($scope, $mdDialog, $http, dataToPass) {
            var mlid = dataToPass;
            $scope.newModel = {};
            $scope.mltype = {};
            $scope.cancelAddModel = function() {
                $mdDialog.cancel('cancel');
            }
            $scope.loadModelConf = function() {
                $http({
                    method : "GET",
                    url : "/user/model/getModelConf",
                    params : {modid: mlid}
                }).then(function querySuccess(response) {
                    $scope.newModel = angular.copy(response.data[0]);
                    $scope.mltype = JSON.parse($scope.newModel.prop);
                    console.log($scope.mltype);
		            $scope.newModel.outputts = parseInt($scope.newModel.outputts);
                    const tyr = $scope.newModel.years.replace('{','').replace('}','').split(',');
                    $scope.newModel.tyears = tyr;
                }, function queryError(response) {
                    console.log('connection failed');
                });
            }
            $scope.loadInputConf = function() {
                $http({
                    method : "GET",
                    url : "/user/model/getModelInput",
                    params : {modid: mlid}
                }).then(function querySuccess(response) {
                    $scope.newModel.input = [];
                    for (var oj in response.data) {
                        $scope.newModel.input.push(response.data[oj].type_name);
                    }
                    console.log(response.data);
                }, function queryError(response) {
                    console.log('connection failed');
                });
            }
            $scope.mlConfig = function(ev) {
                $mdDialog.show({
                    scope: $scope,
                    templateUrl: 'dialog/editdialog/mltemplate/'+ $scope.newModel.mltype + '.template.html',
                    parent: angular.element(document.body),
                    multiple: true,
                    preserveScope: true,
                    escapeToClose: true,
                    clickOutsideToClose: true,
                    targetEvent: ev
                }).then(function(response){
                    console.log('add data');
                })
                .catch(function(responseIfRejected){
                    console.log('cancel');
                });
            }
            $scope.editFinish = function() {
                $mdDialog.hide('cancel');
            }
            $scope.loadModelConf();
            $scope.loadInputConf();
        }
