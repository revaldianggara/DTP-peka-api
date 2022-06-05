(function () {
        'use strict';

        angular.module('layerControl')
                .controller('monitoringCtrl', ['$scope', '$http', '$interval', '$timeout', '$mdDialog', monitoringCtrl]);

        function monitoringCtrl($scope, $http, $interval, $timeout, $mdDialog) {
                $scope.loadingLog = false;
                var falarm = false;
                const pgad = 30;
                var paglog = 0;
                var reloadHW = undefined;
                $scope.visiblePd = true;
                $scope.visiblePr = false;
                $scope.visibleInput = false;
                $scope.visiblePh = false;
                $scope.visiblePv = false;
                $scope.toggle = {};
                $scope.toggle.list1 = true;

                $scope.bottomLog_pd = function () {
                        $scope.loadingLog = true;
                        if (!falarm) {
                                falarm = true;
                                $timeout(function () {
                                        if (falarm == true) {
                                                paglog += pgad;
                                                $scope.loadPd(true);
                                                $scope.loadPr(false);
                                                $scope.loadInput(false);
                                                $scope.loadPh(false);
                                                console.log("Hit the end pd");
                                                falarm = false;
                                        }
                                }, 500);
                        }
                }
                $scope.loadPd = function () {
                        if (angular.isDefined(reloadHW)) {
                                $interval.cancel(reloadHW);
                                reloadHW = undefined;
                        }
                        $http({
                                method: "GET",
                                url: "/admin/process/getPerolehanData",
                        }).then(function querySuccess(response) {
                                $scope.dataPd = angular.copy(response.data);
                                console.log($scope.dataPd);
                        }, function queryError(response) {
                                console.log('connection failed');
                        });
                }
                $scope.loadPr = function () {
                        if (angular.isDefined(reloadHW)) {
                                $interval.cancel(reloadHW);
                                reloadHW = undefined;
                        }
                        $http({
                                method: "GET",
                                url: "/admin/process/getPreprocessing",
                        }).then(function querySuccess(response) {
                                $scope.dataPr = angular.copy(response.data);
                                console.log($scope.dataPr);
                        }, function queryError(response) {
                                console.log('connection failed');
                        });
                }
                $scope.loadInput = function () {
                        if (angular.isDefined(reloadHW)) {
                                $interval.cancel(reloadHW);
                                reloadHW = undefined;
                        }
                        $http({
                                method: "GET",
                                url: "/admin/process/getInput",
                        }).then(function querySuccess(response) {
                                $scope.dataInput = angular.copy(response.data);
                                console.log($scope.dataInput);
                        }, function queryError(response) {
                                console.log('connection failed');
                        });
                }
                $scope.loadPh = function () {
                        if (angular.isDefined(reloadHW)) {
                                $interval.cancel(reloadHW);
                                reloadHW = undefined;
                        }
                        $http({
                                method: "GET",
                                url: "/admin/process/getPrediksiModelHotspot",
                        }).then(function querySuccess(response) {
                                $scope.dataPh = angular.copy(response.data);
                                console.log($scope.dataPh);
                        }, function queryError(response) {
                                console.log('connection failed');
                        });
                }
                $scope.category = 'perolehandata';
                $scope.showPd = function (id) {
                        $scope.toggle.list2 = false;
                        $scope.toggle.list3 = false;
                        $scope.toggle.list4 = false;
                        $scope.toggle.list5 = false;
                        $scope.category = id;
                        $scope.visiblePd = true;
                        $scope.visiblePr = false;
                        $scope.visibleInput = false;
                        $scope.visiblePh = false;
                        $scope.visiblePv = false;
                }
                // DATA INPUT show processing
                $scope.showPr = function (id) {
                        $scope.bottomLog_pr = function () {
                                $scope.loadingLog = true;
                                if (!falarm) {
                                        falarm = true;
                                        $timeout(function () {
                                                if (falarm == true) {
                                                        paglog += pgad;
                                                        $scope.loadPr(true);
                                                        $scope.loadPd(false);
                                                        console.log("Hit the end pr");
                                                        falarm = false;
                                                }
                                        }, 500);
                                }
                        }
                        $scope.toggle.list1 = false;
                        $scope.toggle.list3 = false;
                        $scope.toggle.list4 = false;
                        $scope.toggle.list5 = false;
                        $scope.category = id;
                        $scope.visiblePd = false;
                        $scope.visiblePr = true;
                        $scope.visibleInput = false;
                        $scope.visiblePh = false;
                        $scope.visiblePv = false;
                }
                // DATA INPUT show input
                $scope.showInput = function (id) {
                        $scope.bottomLog_input = function () {
                                $scope.loadingLog = true;
                                if (!falarm) {
                                        falarm = true;
                                        $timeout(function () {
                                                if (falarm == true) {
                                                        paglog += pgad;
                                                        $scope.loadInput(true);
                                                        $scope.loadPr(false);
                                                        $scope.loadPd(false);
                                                        $scope.loadPh(false);
                                                        console.log("Hit the end input");
                                                        falarm = false;
                                                }
                                        }, 500);
                                }
                        }
                        $scope.toggle.list1 = false;
                        $scope.toggle.list2 = false;
                        $scope.toggle.list4 = false;
                        $scope.toggle.list5 = false;
                        $scope.category = id;
                        $scope.visiblePd = false;
                        $scope.visiblePr = false;
                        $scope.visibleInput = true;
                        $scope.visiblePh = false;
                        $scope.visiblePv = false;
                }
                // DATA INPUT show potensi hotspot
                $scope.showPh = function (id) {
                        $scope.bottomLog_ph = function () {
                                $scope.loadingLog = true;
                                if (!falarm) {
                                        falarm = true;
                                        $timeout(function () {
                                                if (falarm == true) {
                                                        paglog += pgad;
                                                        $scope.loadPd(false);
                                                        $scope.loadPr(false);
                                                        $scope.loadInput(false);
                                                        $scope.loadPh(true);
                                                        console.log("Hit the end ph");
                                                        falarm = false;
                                                }
                                        }, 500);
                                }
                        }
                        $scope.toggle.list1 = false;
                        $scope.toggle.list2 = false;
                        $scope.toggle.list3 = false;
                        $scope.toggle.list5 = false;
                        $scope.category = id;
                        $scope.visiblePd = false;
                        $scope.visiblePreprocess = false;
                        $scope.visibleInput = false;
                        $scope.visiblePh = true;
                        $scope.visiblePv = false;
                }
                // DATA INPUT show prediksi devegetasi
                $scope.showPv = function (id) {
                        $scope.bottomLog_pv = function () {
                                $scope.loadingLog = true;
                                if (!falarm) {
                                        falarm = true;
                                        $timeout(function () {
                                                if (falarm == true) {
                                                        paglog += pgad;
                                                        $scope.loadPd(false);
                                                        $scope.loadPr(false);
                                                        $scope.loadInput(false);
                                                        $scope.loadPh(true);
                                                        console.log("Hit the end pv");
                                                        falarm = false;
                                                }
                                        }, 500);
                                }
                        }
                        $scope.toggle.list1 = false;
                        $scope.toggle.list2 = false;
                        $scope.toggle.list3 = false;
                        $scope.toggle.list4 = false;
                        $scope.category = id;
                        $scope.visiblePd = false;
                        $scope.visiblePreprocess = false;
                        $scope.visibleInput = false;
                        $scope.visiblePh = false;
                        $scope.visiblePv = true;
                }
                $scope.bottomLog_pd();
        }
})();