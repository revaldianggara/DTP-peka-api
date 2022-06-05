'use strict';

angular
    .module('layerControl')
    .component('layerControl', {
        templateUrl: 'layer-control/layer-control.template.html',
        controller:
            function layercontrolController($scope, $http, mapService, $mdDialog) {
                /* $timeout(function () {
                    $mdSidenav('left').open();
                }); */
                const dt = new Date();
                const tyear = toString(dt.getFullYear());
                $scope.activeMenu = 'datainput';
                $scope.activeFeature = '';
                $scope.features = [];
                $scope.showinputsearch = false;
                var temp = {};
                $scope.detailFrame = 'http://karhutla.ai-innovation.id/dashboard/user/webgis/';
                function chunk(arr, chunkSize) {
                    if (chunkSize <= 0) throw "Invalid chunk size";
                    var R = [];
                    for (var i=0,len=arr.length; i<len; i+=chunkSize)
                      R.push(arr.slice(i,i+chunkSize));
                    return R;
                }
                $scope.showinpsearchbar = function() {                   
                    $scope.showinputsearch = !$scope.showinputsearch;
                    if (!$scope.showinputsearch) {
                        $scope.features = temp;
                        $scope.featsearch = "";
                    }
                    else {
                        temp = $scope.features;
                        document.getElementById("searchbar").focus();
                    }
                }
                $scope.loadInput = function() {
                    $http({
                        method : "GET",
                        url : "/user/input/getFeatureType"
                    }).then(function querySuccess(response) {
                        var result = response.data.map(function(el) {
                            var o = Object.assign({}, el);
                            o.toggle = false;
                            return o;
                        })
                        $scope.features = angular.copy(result);
                        console.log($scope.features);
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                $scope.removeInput = function(inid, ev) {
                    var confirm = $mdDialog.confirm()
                            .title('Menghapus Input Fitur')
                            .textContent('Apakah anda yakin untuk menghapus fitur?')
                            .targetEvent(ev)
                            .ok('Ya')
                            .cancel('Tidak');
                    $mdDialog.show(confirm).then(function () {
                        $http({
                            method : "GET",
                            url : "/user/input/getDeleteInput",
                            params : {idel: inid}
                        }).then(function querySuccess(response) {
                            $scope.loadInput();
                        }, function queryError(response) {
                            console.log('connection failed');
                        });
                    }, function () {
                        console.log('cancel delete');
                    });
                }
                $scope.searchInputFeature = function() {
                    const regexp = new RegExp($scope.featsearch, 'i');
                    var res = $scope.features.filter(x => regexp.test(x.name));
                    $scope.features = res;
                }
                $scope.loadModel = function() {
                    $http({
                        method : "GET",
                        url : "/user/model/getModels"
                    }).then(function querySuccess(response) {
                        var result = response.data.map(function(el) {
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
                $scope.loadDetail = function(itm) {
                    itm.toggle = !itm.toggle;
                    if (itm.toggle) {
                        const pol = itm.bb;
                        const bb = '[' + pol.replaceAll('{','[').replaceAll('}',']') + ']';
                        const polgjson = `{
                            "type":"FeatureCollection",
                            "features":[
                                {
                                    "type":"Feature",
                                    "geometry": {
                                        "type":"Polygon",
                                        "coordinates": `+ bb +`
                                    },
                                    "properties":{"name":"boundingbox"}
                                }
                            ]
                        }`;
                        const gj = JSON.parse(polgjson);
                        console.log(gj);
                        mapService.drawPol(gj);
                        $scope.activeFeature = itm.name;
                        $http({
                            method : "GET",
                            url : "/user/input/getFeatureYear",
                            params : {inpid: itm.idi}
                        }).then(function querySuccess(response) {
                            var result = response.data.map(function(el) {
                                var o = Object.assign({}, el);
                                o.toggle = false;
                                return o;
                            })
                            itm.fyear = angular.copy(result);
                        }, function queryError(response) {
                            console.log('connection failed');
                        });
                    }
                }
                $scope.loadYearDetail = function(itm, itm2) {
                    itm2.toggle = !itm2.toggle;
                    if (itm2.toggle) {
                        var tof = [];
                        for (var dp=46; dp>=1; dp--) {
                            const nyr = {'name': String(dp)};
                            tof.unshift(nyr) ;
                        }
                        $http({
                            method : "GET",
                            url : "/user/input/getFeaturePeriod",
                            params : {inpid: itm.idi, inpyear: itm2.name}
                        }).then(function querySuccess(response) {
                            var result = tof.map(function(el) {
                                var o = Object.assign({}, el);
                                o.status = 'unavailable';
                                response.data.map(function(el) {
                                    var o1 = Object.assign({}, el);
                                    if (o1.name == o.name) {
                                        o.status = o1.status;
                                    }
                                })
                                return o;
                            })
                            var nchunk = chunk(result, 10);
                            itm2.fperiod = nchunk;
                            console.log(itm2.fperiod);
                        }, function queryError(response) {
                            console.log('connection failed');
                        });
                    }
                }
                $scope.loadModDetail = function(itm) {
                    console.log(itm.id);
                    $scope.models.map(function(el, index) {
                        var o = Object.assign({}, el);
                        console.log(o.id);
                        if (o.id!=itm.id) {
                            $scope.models[index].toggle = false;
                        }
                        else {
                            itm.toggle = !itm.toggle;
                        }
                    })
                    //itm.toggle = !itm.toggle;
                    $http({
                        method : "GET",
                        url : "/user/model/getStreamLog",
                        params : {modid: itm.id}
                    }).then(function querySuccess(response) {
                        $scope.logText = angular.copy(response.data);
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                $scope.editModel = function(ev, edi) {
                    $scope.hotspotselected = false;
                    $mdDialog.show({
                        controller: 'editdialog',
                        parent: angular.element(document.body),
                        templateUrl: 'dialog/editdialog/editdialog.template.html',
                        targetEvent: ev,
                        locals:{dataToPass: edi}
                    }).then(function(response){
                        console.log('add data');
                    })
                    .catch(function(responseIfRejected){
                        console.log('cancel');
                    });
                }
                $scope.runModel = function(mid) {
                    $http({
                        method : "GET",
                        url : "/user/model/getRunModel",
                        params : {idm: mid}
                    }).then(function querySuccess(response) {
                        $scope.loadModel();
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                $scope.pauseModel = function(mid) {
                    $http({
                        method : "GET",
                        url : "/user/model/getPausePred",
                        params : {idm: mid}
                    }).then(function querySuccess(response) {
                        $scope.loadModel();
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                $scope.playModel = function(mid) {
                    $http({
                        method : "GET",
                        url : "/user/model/getPlayPred",
                        params : {idm: mid}
                    }).then(function querySuccess(response) {
                        $scope.loadModel();
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                $scope.cancelModel = function(ev, mid) {
                    var confirm = $mdDialog.confirm()
                            .title('Membatalkan Proses Training')
                            .textContent('Apakah anda yakin untuk membatalkan proses training?')
                            .targetEvent(ev)
                            .ok('Ya')
                            .cancel('Tidak');
                    $mdDialog.show(confirm).then(function () {
                        $http({
                            method : "GET",
                            url : "/user/model/getCancelModel",
                            params : {idm: mid}
                        }).then(function querySuccess(response) {
                            $scope.loadModel();
                        }, function queryError(response) {
                            console.log('connection failed');
                        });
                    }, function () {
                        console.log('cancel cancel');
                    });
                }
                $scope.deleteModel = function(ev, mid) {
                    var confirm = $mdDialog.confirm()
                            .title('Menghapus Model')
                            .textContent('Apakah anda yakin untuk menghapus model')
                            .targetEvent(ev)
                            .ok('Ya')
                            .cancel('Tidak');
                    $mdDialog.show(confirm).then(function () {
                        $http({
                            method : "GET",
                            url : "/user/model/getDeleteModel",
                            params : {idm: mid}
                        }).then(function querySuccess(response) {
                            $scope.loadModel();
                        }, function queryError(response) {
                            console.log('connection failed');
                        });
                    }, function () {
                        console.log('cancel delete');
                    });
                }
                $scope.showAddNewInputDialog = function(ev) {
                    $scope.hotspotselected = false;
                    $mdDialog.show({
                        controller: 'addnewinputdialog',
                        parent: angular.element(document.body),
                        templateUrl: 'dialog/addnewinput/addnewinput.template.html',
                        targetEvent: ev,
                        locals:{dataToPass: $scope.features}
                    }).then(function(response){
                        console.log('add data');
                        $scope.loadInput();
                    })
                    .catch(function(responseIfRejected){
                        console.log('cancel');
                        $scope.loadInput();
                    });
                }
                $scope.showAddNewModelDialog = function(ev) {
                    $scope.hotspotselected = false;
                    $mdDialog.show({
                        controller: 'addnewmodeldialog',
                        parent: angular.element(document.body),
                        templateUrl: 'dialog/addnewmodel/addnewmodel.template.html',
                        targetEvent: ev,
                        multiple: true,
                        locals:{dataToPass: $scope.features}
                    }).then(function(response){
                        $scope.loadModel();
                    })
                    .catch(function(responseIfRejected){
                        console.log('cancel');
                    });
                }
                $scope.loadInput();
            }
});
