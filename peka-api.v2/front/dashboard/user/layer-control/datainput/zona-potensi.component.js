(function () {
  "use strict";

  angular
    .module("layerControl")
    .controller("dataInputZpCtrl", ["$scope", "$http", "$mdDialog", "$timeout", dataInputZpCtrl]);

  function dataInputZpCtrl($scope, $http, $mdDialog, $timeout) {
    $scope.loadingLog = false;
    $scope.activeFeature = "";
    $scope.features = [];
    var temp = {};
    var balarm = false;
    var sltid;
    var slloc;
    const pgad = 30;
    var paglog = 0;
    $scope.loadingDownload = false;
    $scope.download = true;

    $scope.kabupatenSelected = '';
    $scope.loadKabupaten = function () {
      $http({
        method: "GET",
        url: "/user/input/ZonaPotensi/getLocId",
      }).then(
        function querySuccess(response) {
          $scope.kabupaten = angular.copy(response.data)
        },
        function queryError(response) {
          console.log("connection failed")
        });
    };
    $scope.loadKabupaten();

    let selkab = [];
    $scope.setKab = function (loc) {
      selkab = loc.id;
      console.log(selkab)
    };

    $scope.loadInput = function () {
      $http({
        method: "GET",
        url: "/user/input/ZonaPotensi/getFeatureType",
      }).then(
        function querySuccess(response) {
          var result = response.data.map(function (el) {
            var o = Object.assign({}, el);
            o.toggle = false;
            return o;
          });
          $scope.features = angular.copy(result);
          // console.log($scope.features);
        },
        function queryError(response) {
          console.log("connection failed");
        });
    };

    $scope.bottomData = function () {
      $scope.loadingLog = true;
      if (!balarm) {
        //run the event that was passed through
        balarm = true;
        $timeout(function () {
          if (balarm == true) {
            paglog += pgad;
            $scope.loadDetail(false, true, true);
            console.log("Hit the end");
            balarm = false;
          }
        }, 1000);
      }
    };
    $scope.loadDetail = function (itm, itm2, cond) {
      $scope.loadingLog = true;
      if (!cond) {
        paglog = 0;
        sltid = itm.id;
        slloc = itm2
        console.log(sltid, slloc)
        $scope.activeFeature = itm.name;
      }
      $http({
        method: "GET",
        url: "/user/input/ZonaPotensi/getFeatureDetail",
        params: {
          inpid: sltid,
          locid: selkab,
          ofs: paglog,
        },
      }).then(
        function querySuccess(response) {
          if (cond) {
            var temp = $scope.dataft;
            temp = temp.concat(response.data);
            angular.copy(temp, $scope.dataft);
          } else {
            $scope.dataft = angular.copy(response.data);
          }
          $scope.loadingLog = false;
        },
        function queryError(response) {
          console.log("connection failed");
          $scope.loadingLog = false;
        }
      );
    };

    $scope.search = function (row) {
      return !!((row.nama.indexOf($scope.query || '') !== -1 || row.nama_provinsi.indexOf($scope.query || '') !== -1));
    };

    $scope.downloadTemplate = function () {
      $scope.loadingDownload = true;
      $scope.download = false;
      $http({
        method: "GET",
        url: "/user/input/ZonaPotensi/getDownloadTemp",
      }).then(
        function querySuccess(response) {
          var blob = new Blob([response.data], {
            type: "text/csv",
          });
          saveAs(blob, "template.csv");
          $scope.loadingDownload = false;
          $scope.download = true;
        },
        function queryError(response) {
          console.log("connection failed");
        }
      );
    };

    $scope.deleteFeature = function (ev, iditm) {
      var confirm = $mdDialog.confirm().title("Menghapus Input Fitur").textContent("Apakah anda yakin untuk menghapus fitur?").targetEvent(ev).ok("Ya").cancel("Tidak");
      $mdDialog.show(confirm).then(
        function () {
          $http({
            method: "GET",
            url: "/user/input/getDeleteFeature",
            params: {
              idf: iditm.id,
            },
          }).then(
            function querySuccess(response) {
              $scope.loadInput();
              $mdToast
                .show(
                  $mdToast
                  .simple()
                  .textContent("Feature " + iditm.name + " berhasil dihapus!")
                  .position("top right")
                  .hideDelay(5000)
                )
                .then(function () {
                  console.log("Toast dismissed.");
                })
                .catch(function () {
                  console.log("Toast failed or was forced to close early by another toast.");
                });
            },
            function queryError(response) {
              console.log("connection failed");
            }
          );
        },
        function () {
          console.log("cancel delete");
        }
      );
    };

    $scope.showAddNewInputDialog = function (ev) {
      $mdDialog.show({
        controller: "addnewinputdialog_zp",
        parent: angular.element(document.body),
        templateUrl: "dialog/addnewinput/zona-potensi/addnewinput.template.html",
        targetEvent: ev,
      });
    };
    $scope.loadInput();

    $scope.showinpsearchbar = function () {
      $scope.showinputsearch = !$scope.showinputsearch;
      if (!$scope.showinputsearch) {
        $scope.features = temp;
        $scope.featsearch = "";
      } else {
        temp = $scope.features;
        document.getElementById("searchbar").focus();
      }
    };

    $scope.searchInputFeature = function () {
      const regexp = new RegExp($scope.featsearch, "i");
      var res = $scope.features.filter((x) => regexp.test(x.name));
      $scope.features = res;
    };
  }
})
();