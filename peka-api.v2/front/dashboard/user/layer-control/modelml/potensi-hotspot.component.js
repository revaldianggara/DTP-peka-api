(function () {
        'use strict';

        angular.module('layerControl')
                .controller('modelmlPhCtrl', ['$scope', '$http', '$mdDialog', "$interval", modelmlPhCtrl]);

        function modelmlPhCtrl($scope, $http, $mdDialog, $interval) {

                $scope.activeModel = '';
                $scope.modelStatus = '';
                $scope.modelLevel = '';
                $scope.features = [];

                $scope.loadHwStats = function () {
                        $http({
                                method: "GET",
                                url: "/user/getHWStats"
                        }).then(
                                function querySuccess(response) {
                                        var hw = angular.copy(response.data)
                                        var gputil_val = [hw[2].tags[0].val.replace("%", "")]; //utilization value
                                        var gputil = [hw[2].tags[0].val]; //utilization persentase
                                        var ram_val = [hw[2].tags[17].val.replace("%", "")]; //RAM value
                                        var ram = [hw[2].tags[17].val]; //RAM
                                        $scope.gpu = gputil_val.concat(gputil);
                                        $scope.ram = ram_val.concat(ram);
                                },
                                function queryError(response) {
                                        console.log("connection failed")
                                }
                        );
                };
                $scope.loadHwStats();

                $interval(function () {
                        $scope.loadHwStats();
                }, 1000 * 30);

                $scope.loadModel = function () {
                        $http({
                                method: "GET",
                                url: "/user/model_ph/getModels"
                        }).then(function querySuccess(response) {
                                var result = response.data.map(function (el) {
                                        var o = Object.assign({}, el);
                                        o.toggle = false;
                                        return o;
                                })
                                $scope.models = angular.copy(result);
                                console.log($scope.models);
                        }, function queryError(response) {
                                console.log('connection failed');
                        });
                }

                $scope.loadModDetail = function (itm) {
                        console.log(itm.id);
                        $scope.activeModelId = itm.id;
                        $scope.activeModel = itm.name;
                        $scope.modelStatus = itm.status;
                        $scope.modelLevel = itm.level;
                        $scope.models.map(function (el, index) {
                                var o = Object.assign({}, el);
                                console.log(o.id);
                                if (o.id != itm.id) {
                                        $scope.models[index].toggle = false;
                                } else {
                                        itm.toggle = !itm.toggle;
                                }
                        })
                        //itm.toggle = !itm.toggle;
                        $http({
                                method: "GET",
                                url: "/user/model_ph/getStreamLog",
                                params: {
                                        modid: itm.id
                                }
                        }).then(function querySuccess(response) {
                                $scope.logText = angular.copy(response.data);
                        }, function queryError(response) {
                                console.log('connection failed');
                        });
                }

                function loadHWSt() {
                        console.log('reloaded');
                        $http({
                                method: "GET",
                                url: "/admin/hw/getHWStats"
                        }).then(function querySuccess(response) {
                                $scope.hwst = angular.copy(response.data);
                                console.log($scope.hwst);
                                console.log($scope.hwst[0].tags);
                        }, function queryError(response) {
                                console.log('connection failed');
                        });
                }
                $scope.logHWStats = function () {
                        loadHWSt();
                        reloadHW = $interval(function () {
                                loadHWSt();
                        }, 60000);
                }

                $scope.editModel = function (ev, edi) {
                        $scope.hotspotselected = false;
                        $mdDialog.show({
                                        controller: 'editdialog_ph',
                                        parent: angular.element(document.body),
                                        templateUrl: 'dialog/editdialog/potensi-hotspot/editdialog.template.html',
                                        targetEvent: ev,
                                        locals: {
                                                dataToPass: edi
                                        }
                                }).then(function (response) {
                                        console.log('add data');
                                })
                                .catch(function (responseIfRejected) {
                                        console.log('cancel');
                                });
                }
                $scope.runModel = function (mid) {
                        $http({
                                method: "GET",
                                url: "/user/model_ph/getRunModel",
                                params: {
                                        idm: mid
                                }
                        }).then(function querySuccess(response) {
                                $scope.loadModel();
                        }, function queryError(response) {
                                console.log('connection failed');
                        });
                }
                $scope.pauseModel = function (mid) {
                        $http({
                                method: "GET",
                                url: "/user/model_ph/getPausePred",
                                params: {
                                        idm: mid
                                }
                        }).then(function querySuccess(response) {
                                $scope.loadModel();
                        }, function queryError(response) {
                                console.log('connection failed');
                        });
                }
                $scope.playModel = function (mid) {
                        $http({
                                method: "GET",
                                url: "/user/model_ph/getPlayPred",
                                params: {
                                        idm: mid
                                }
                        }).then(function querySuccess(response) {
                                $scope.loadModel();
                        }, function queryError(response) {
                                console.log('connection failed');
                        });
                }
                $scope.cancelModel = function (ev, mid) {
                        var confirm = $mdDialog.confirm()
                                .title('Membatalkan Proses Training')
                                .textContent('Apakah anda yakin untuk membatalkan proses training?')
                                .targetEvent(ev)
                                .ok('Ya')
                                .cancel('Tidak');
                        $mdDialog.show(confirm).then(function () {
                                $http({
                                        method: "GET",
                                        url: "/user/model_ph/getCancelModel",
                                        params: {
                                                idm: mid
                                        }
                                }).then(function querySuccess(response) {
                                        $scope.loadModel();
                                }, function queryError(response) {
                                        console.log('connection failed');
                                });
                        }, function () {
                                console.log('cancel cancel');
                        });
                }
                $scope.deleteModel = function (ev, mid) {
                        var confirm = $mdDialog.confirm()
                                .title('Menghapus Model')
                                .textContent('Apakah anda yakin untuk menghapus model')
                                .targetEvent(ev)
                                .ok('Ya')
                                .cancel('Tidak');
                        $mdDialog.show(confirm).then(function () {
                                $http({
                                        method: "GET",
                                        url: "/user/model_ph/getDeleteModel",
                                        params: {
                                                idm: mid
                                        }
                                }).then(function querySuccess(response) {
                                        $scope.loadModel();
                                }, function queryError(response) {
                                        console.log('connection failed');
                                });
                        }, function () {
                                console.log('cancel delete');
                        });
                }
                $scope.showAddNewModelDialog = function (ev) {
                        $scope.hotspotselected = false;
                        $mdDialog.show({
                                        controller: 'addnewmodeldialog_ph',
                                        parent: angular.element(document.body),
                                        templateUrl: 'dialog/addnewmodel/potensi-hotspot/addnewmodel.template.html',
                                        targetEvent: ev,
                                        multiple: true,
                                        locals: {
                                                dataToPass: $scope.features
                                        }
                                }).then(function (response) {
                                        $scope.loadModel();
                                })
                                .catch(function (responseIfRejected) {
                                        console.log('cancel');
                                });
                }
                $scope.loadModel();
        }

})();