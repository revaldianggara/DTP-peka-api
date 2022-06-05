"use strict";

angular
  .module("layerControl")
  .controller("dataInputPhCtrl", ["$scope", "$http", "mapService_datainput", "$mdDialog", dataInputPhCtrl]);

function dataInputPhCtrl($scope, $http, mapService_datainput, $mdDialog) {
  $scope.activeFeature = "";
  $scope.features = [];
  $scope.showinputsearch = true;
  var temp = {};

  function chunk(arr, chunkSize) {
    if (chunkSize <= 0) throw "Invalid chunk size";
    var R = [];
    for (var i = 0, len = arr.length; i < len; i += chunkSize)
      R.push(arr.slice(i, i + chunkSize));
    return R;
  }

  $scope.loadInput = function () {
    $http({
      method: "GET",
      url: "/mgmt/input/PotensiHotspot/getFeatureType",
    }).then(
      function querySuccess(response) {
        var result = response.data.map(function (el) {
          var o = Object.assign({}, el);
          o.toggle = false;
          return o;
        });
        $scope.features = angular.copy(result);
        console.log($scope.features);
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };
  $scope.loadInput();

  $scope.showAddNewInputDialog = function (ev) {
    $scope.hotspotselected = false;
    $mdDialog.show({
        controller: 'addnewinputdialog_ph',
        parent: angular.element(document.body),
        templateUrl: 'dialog/addnewinput/potensi-hotspot/addnewinput.template.html',
        targetEvent: ev,
        locals: {
          dataToPass: $scope.features
        }
      }).then(function (response) {
        console.log('add data');
        $scope.loadInput();
      })
      .catch(function (responseIfRejected) {
        console.log('cancel');
        $scope.loadInput();
      });
  }

  $scope.showinpsearchbar = function () {
    $scope.showinputsearch = !$scope.showinputsearch;
    if (!$scope.showinputsearch) {
      $scope.features = temp;
      $scope.featsearch = "";
    } else {
      temp = $scope.features;
      document.getElementById("searchbar").focus();
    }
  }

  $scope.removeInput = function (inid, ev) {
    var confirm = $mdDialog.confirm()
      .title('Menghapus Input Fitur')
      .textContent('Apakah anda yakin untuk menghapus fitur?')
      .targetEvent(ev)
      .ok('Ya')
      .cancel('Tidak');
    $mdDialog.show(confirm).then(function () {
      $http({
        method: "GET",
        url: "/mgmt/input/PotensiHotspot/getDeleteInput",
        params: {
          idel: inid
        }
      }).then(function querySuccess(response) {
        $scope.loadInput();
      }, function queryError(response) {
        console.log('connection failed');
      });
    }, function () {
      console.log('cancel delete');
    });
  }
  $scope.searchInputFeature = function () {
    const regexp = new RegExp($scope.featsearch, 'i');
    var res = $scope.features.filter(x => regexp.test(x.name));
    $scope.features = res;
  }
  $scope.loadDetail = function (itm) {
    itm.toggle = !itm.toggle;
    if (itm.toggle) {
      const pol = itm.bb;
      const bb = '[' + pol.replaceAll('{', '[').replaceAll('}', ']') + ']';
      const polgjson = `{
                  "type":"FeatureCollection",
                  "features":[
                      {
                          "type":"Feature",
                          "geometry": {
                              "type":"Polygon",
                              "coordinates": ` + bb + `
                          },
                          "properties":{"name":"boundingbox"}
                      }
                  ]
              }`;
      const gj = JSON.parse(polgjson);
      console.log(gj);
      mapService_datainput.drawPol(gj);
      $scope.activeFeature = itm.name;
      $http({
        method: "GET",
        url: "/mgmt/input/PotensiHotspot/getFeatureYear",
        params: {
          inpid: itm.idi
        }
      }).then(function querySuccess(response) {
        var result = response.data.map(function (el) {
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
  $scope.loadYearDetail = function (itm, itm2) {
    itm2.toggle = !itm2.toggle;
    if (itm2.toggle) {
      var tof = [];
      for (var dp = 46; dp >= 1; dp--) {
        const nyr = {
          'name': String(dp)
        };
        tof.unshift(nyr);
      }
      $http({
        method: "GET",
        url: "/mgmt/input/PotensiHotspot/getFeaturePeriod",
        params: {
          inpid: itm.idi,
          inpyear: itm2.name
        }
      }).then(function querySuccess(response) {
        var result = tof.map(function (el) {
          var o = Object.assign({}, el);
          o.status = 'unavailable';
          response.data.map(function (el) {
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
}