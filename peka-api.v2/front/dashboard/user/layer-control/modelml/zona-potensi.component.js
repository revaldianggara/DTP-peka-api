'use strict';

angular.module('layerControl')
    .controller('modelmlZpCtrl', ['$scope', '$http', '$mdDialog', "$interval", modelmlZpCtrl]);

function modelmlZpCtrl($scope, $http, $mdDialog, $interval) {

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
        console.log("HW update status");
        $scope.loadHwStats();
    }, 1000 * 30);

    $scope.loadModel = function () {
        $http({
            method: "GET",
            url: "/user/model_zp/getModels"
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
            url: "/user/model_zp/getStreamLog",
            params: {
                modid: itm.id
            }
        }).then(function querySuccess(response) {
            $scope.logText = angular.copy(response.data);
        }, function queryError(response) {
            console.log('connection failed');
        });
    }

    $scope.editModel = function (ev, edi) {
        $scope.hotspotselected = false;
        $mdDialog.show({
                controller: 'editdialog_zp',
                parent: angular.element(document.body),
                templateUrl: 'dialog/editdialog/potensi-hotspot.template.html',
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
            url: "/user/model_zp/getRunModel",
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
            url: "/user/model_zp/getPausePred",
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
            url: "/user/model_zp/getPlayPred",
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
                url: "/user/model_zp/getCancelModel",
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
                url: "/user/model_zp/getDeleteModel",
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
                controller: 'addnewmodeldialog_zp',
                parent: angular.element(document.body),
                templateUrl: 'dialog/addnewmodel/zona-potensi/addnewmodel.template.html',
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