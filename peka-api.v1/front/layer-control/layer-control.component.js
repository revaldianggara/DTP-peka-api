'use strict';

angular
    .module('layerControl')
    .component('layerControl', {
        templateUrl: 'layer-control/layer-control.template.html',
        controller:
            function layercontrolController($scope, $http, $mdSidenav, mapService, $interval) {
                $scope.hs = mapService.info_detail;
                var phsar = [];
                var devar = [];
                var recar = [];
                $scope.activeMenu = 'webgis';
                $scope.detailFrame = 'http://aplikasi.bbtmc.bppt.go.id:3838/AI_BBTMC/';
                $scope.predHSItemCheck = function() {
                    $http({
                        method : "GET",
                        url : "/getPredHS"
                    }).then(function querySuccess(response) {
                        if (response.data.features) {
                            const nphsar = response.data.features;
                            const toadd = nphsar.filter(({ id: id1 }) => !phsar.some(({ id: id2 }) => id2 === id1));
                            const todel = phsar.filter(({ id: id1 }) => !nphsar.some(({ id: id2 }) => id2 === id1));
                            phsar = nphsar;
                            var pid;
                            var ngjson = {};
                            ngjson.type = 'FeatureCollection';
                            ngjson.features = [];
                            toadd.map(function (el) {
                                ngjson.features.push(el);
                                pid = el.properties.pid;
                            });
                            if (pid) {
                                mapService.drawHS('predHS_'+pid, ngjson);
                            }
                            var dpid;
                            todel.map(function (el) {
                                dpid = el.properties.pid;
                            });
                            if (dpid) {
                                mapService.removeHS('predHS_'+dpid);
                            }
                        }
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                $scope.predVegItemCheck = function() {
                    $http({
                        method : "GET",
                        url : "/getPredVeg"
                    }).then(function querySuccess(response) {
                        if (response.data.features) {
                            const ndevar = response.data.features;
                            const toadd = ndevar.filter(({ id: id1 }) => !devar.some(({ id: id2 }) => id2 === id1));
                            const todel = devar.filter(({ id: id1 }) => !ndevar.some(({ id: id2 }) => id2 === id1));
                            devar = ndevar;
                            var pid;
                            var ngjson = {};
                            ngjson.type = 'FeatureCollection';
                            ngjson.features = [];
                            toadd.map(function (el) {
                                ngjson.features.push(el);
                                pid = el.properties.pid;
                            });
                            if (pid) {
                                mapService.drawHS('predVeg_'+pid, ngjson);
                            }
                            var dpid;
                            todel.map(function (el) {
                                dpid = el.properties.pid;
                            });
                            if (dpid) {
                                mapService.removeHS('predVeg_'+dpid);
                            }
                        }
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                $scope.recItemCheck = function() {
                    $http({
                        method : "GET",
                        url : "/getRec"
                    }).then(function querySuccess(response) {
                        if (response.data.features) {
                            const nrecar = response.data.features;
                            const toadd = nrecar.filter(({ id: id1 }) => !recar.some(({ id: id2 }) => id2 === id1));
                            const todel = recar.filter(({ id: id1 }) => !nrecar.some(({ id: id2 }) => id2 === id1));
                            recar = nrecar;
                            toadd.map(function (el) {
                                var ngjson = {};
                                ngjson.type = 'FeatureCollection';
                                ngjson.features = [];
                                ngjson.features.push(el);
                                mapService.drawHS('rec_'+el.id, ngjson);
                            });
                            todel.map(function (el) { 
                                mapService.removeHS('rec_'+el.id);
                            });
                        }
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                $scope.predHSItemCheck();
                $scope.predVegItemCheck();
                $scope.recItemCheck();
                $interval(function() {$scope.predHSItemCheck()}, 1000*600);
                $interval(function() {$scope.predVegItemCheck()}, 1000*1000);
                $interval(function() {$scope.recItemCheck()}, 1000*300);
            }
});