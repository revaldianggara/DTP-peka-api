'use strict';

angular.
module('addnewmodel').
controller('addnewmodeldialog_zp', ['$scope', '$mdDialog', '$timeout', '$http', addnewmodeldialog_zp]);

function addnewmodeldialog_zp($scope, $mdDialog, $timeout, $http) {
    var inptp = [];
    var inpyr = [];
    var model_slc;
    $scope.newModel = {};
    var inpfeature = [];
    var yeardata = [];
    $scope.emptyinput = true;
    $scope.mltype = {};
    $scope.mltype.layers = 2;
    $scope.mltype.nodes = 16;
    $scope.mltype.epoch = 10;
    $scope.mltype.batchsize = 64;
    $scope.mltype.metrics = 'accuracy';
    $scope.mltype.val_split = 0.2;
    $scope.selectedInputFeatures = [];
    $scope.selectedYearsFeatures = [];
    $scope.selectedItem = null;
    $scope.searchText = null;
    $scope.cancelAddModel = function () {
        $mdDialog.cancel('cancel');
    }
    $scope.getInputType = function () {
        $http({
            method: "GET",
            url: "/user/model_zp/getFeatureType"
        }).then(function querySuccess(response) {
            inptp = angular.copy(response.data);
            inpfeature = $scope.loadInputFeatures();
        }, function queryError(response) {
            console.log('connection failed');
        });
    }
    $scope.loadInputFeatures = function () {
        return inptp.map(function (inp) {
            inp._lowername = inp.name.toLowerCase();
            return inp;
        });
    }
    $scope.getYearComb = function (idret, idc) {
        $http({
            method: "GET",
            url: "/user/model_zp/getFeatureCombineYear",
            params: {
                inpid: idret,
                countid: idc
            }
        }).then(function querySuccess(response) {
            inpyr = angular.copy(response.data);
            yeardata = $scope.loadYears();
        }, function queryError(response) {
            console.log('connection failed');
        });
    }
    $scope.loadYears = function () {
        return inpyr.map(function (yre) {
            yre._lowername = yre.name.toLowerCase();
            return yre;
        });
    }
    $scope.inputChange = function () {
        var chid = $scope.selectedInputFeatures.map(function (el) {
            return el.idi;
        });
        const cntid = chid.length;
        chid = '{' + chid.join(",") + '}';
        $scope.newModel.InputFeatures = chid;
        $scope.getYearComb(chid, cntid);
        $scope.selectedYearsFeatures = [];
    }
    $scope.yearChange = function () {
        var chid = $scope.selectedYearsFeatures.map(function (el) {
            return el.name;
        });
        chid = '{' + chid.join(",") + '}';
        $scope.newModel.YearsFeatures = chid;
    }
    $scope.loadML = function () {
        return $http({
            method: "GET",
            url: "/user/model_zp/getMLType"
        }).then(function querySuccess(response) {
            $scope.mltypes = response.data;
            console.log($scope.mltype);
        }, function queryError(response) {
            console.log('connection failed');
        });
    }
    $scope.mlselected = function (mlnm) {
        model_slc = mlnm;
    }
    $scope.transformChip = function (chip) {
        if (angular.isObject(chip)) {
            return chip;
        }
    }
    $scope.queryFeaturesSearch = function (query) {
        var results = query ? inpfeature.filter(createFilterFor(query)) : [];
        return results;
    }
    $scope.queryYearsSearch = function (query) {
        var results = query ? yeardata.filter(createFilterFor(query)) : [];
        return results;
    }

    function createFilterFor(query) {
        var lowercaseQuery = query.toLowerCase();
        return function filterFn(inpfeatur) {
            return (inpfeatur._lowername.indexOf(lowercaseQuery) === 0);
        };
    }
    $scope.mlConfig = function (ev) {
        console.log(model_slc);
        $mdDialog.show({
                scope: $scope,
                templateUrl: 'dialog/addnewmodel/zona-potensi/mltemplate/' + model_slc + '.template.html',
                parent: angular.element(document.body),
                multiple: true,
                preserveScope: true,
                escapeToClose: true,
                clickOutsideToClose: true,
                targetEvent: ev
            }).then(function (response) {
                console.log('add data');
            })
            .catch(function (responseIfRejected) {
                console.log('cancel');
            });
    }
    $scope.addNewModel = function () {
        $scope.newModel.mlprop = JSON.stringify($scope.mltype);
        console.log($scope.newModel);
        $http({
            method: "GET",
            url: "/user/model_zp/getAddModel",
            params: {
                nm: $scope.newModel
            }
        }).then(function querySuccess(response) {
            console.log('connection success');
        }, function queryError(response) {
            console.log('connection failed');
        });
        $mdDialog.hide('cancel');
    }

    $scope.getInputType();
}