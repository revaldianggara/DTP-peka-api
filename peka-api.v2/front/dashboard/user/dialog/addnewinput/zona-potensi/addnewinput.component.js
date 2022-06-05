"use strict";

angular.module("addnewinput").controller("addnewinputdialog_zp", ["$scope", "$mdDialog", "$http", "FileUploader", addnewinputdialog_zp]);

function addnewinputdialog_zp($scope, $mdDialog, $http, FileUploader) {
  $scope.dyear = [];
  $scope.dperiod = [];
  var dperiod = [];
  var inpfeature = [];
  $scope.progressper = 0;
  $scope.fileSelected = false;
  $scope.selectedInputFeatures = [];
  $scope.selectedItem = null;
  $scope.searchText = null;
  $scope.uploadingInput = false;

  $scope.cancelAddInputFeature = function () {
    $mdDialog.cancel("cancel");
  };

  const d = new Date();
  const cyr = d.getFullYear();
  for (var y = 2000; y <= cyr; y++) {
    const nyr = {
      name: String(y),
    };
    $scope.dyear.unshift(nyr);
  }
  for (var dp = 1; dp <= 46; dp++) {
    const nyr = {
      name: String(dp),
    };
    dperiod.unshift(nyr);
  }

  $scope.loadFeature = function () {
    return $http({
      method: "GET",
      url: "/user/input/ZonaPotensi/getFeatureType",
    }).then(
      function querySuccess(response) {
        $scope.inpFeature = response.data;
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };
  $scope.loadInputFeatures = function () {
    return inptp.map(function (inp) {
      inp._lowername = inp.name.toLowerCase();
      return inp;
    });
  };

  $scope.checkPeriod = function () {
    return $http({
      method: "GET",
      url: "/user/input/ZonaPotensi/getCheckPeriod",
      params: {
        year: $scope.inputfeature.year,
        inname: $scope.inputfeature.name,
      },
    }).then(
      function querySuccess(response) {
        var result = dperiod.map(function (el) {
          var o = Object.assign({}, el);
          const found = response.data.some((el) => el.name === o.name);
          if (found) {
            o.status = true;
          } else {
            o.status = false;
          }
          return o;
        });
        console.log(result);
        $scope.dperiod = angular.copy(result);
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };

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

  $scope.inputChange = function () {
    var chid = $scope.selectedInputFeatures.map(function (el) {
      return el.idi;
    });
    const cntid = chid.length;
    chid = "{" + chid.join(",") + "}";
    $scope.newModel.InputFeatures = chid;
    $scope.getYearComb(chid, cntid);
    $scope.selectedYearsFeatures = [];
  };
  $scope.transformChip = function (chip) {
    if (angular.isObject(chip)) {
      return chip;
    }
  };
  $scope.queryFeaturesSearch = function (query) {
    var results = query ? inpfeature.filter(createFilterFor(query)) : [];
    return results;
  };

  $scope.addNewInputFeatureName = function (ev) {
    var confirm = $mdDialog.prompt().title("Feature Name").targetEvent(ev).required(true).multiple(true).ok("Add New Feature Name").cancel("Cancel");

    $mdDialog.show(confirm).then(
      function (result) {
        //const addin = {id: 9999, name:result, status: 'checking', toggle: false};
        //$scope.features.unshift(addin);
        $http({
          method: "GET",
          url: "/user/input/getNewFeature",
          params: {
            nof: result,
          },
        }).then(
          function querySuccess(response) {
            console.log("add feature success");
          },
          function queryError(response) {
            console.log("connection failed");
          }
        );
      },
      function () {
        console.log("cancelled");
      }
    );
  };
  var uploader = ($scope.uploader = new FileUploader({
    url: "input/getUploadFeature",
    method: "POST",
  }));
  $scope.addNewInput = function () {
    uploader.uploadAll();
  };
  $scope.itemSelected = function () {
    console.log("file selected");
  };
  uploader.onProgressItem = function (fileItem, progress) {
    $scope.progressper = progress;
    console.log($scope.progressper);
    $scope.uploadingInput = true;
  };
  uploader.onSuccessItem = function (fileItem, response, status, headers) {
    console.log("onSuccessItem", fileItem, response, status, headers);
    $scope.uploadingInput = false;
    $mdDialog.cancel("cancel");
  };
  uploader.onBeforeUploadItem = function (item) {
    item.formData = [{
      nof: $scope.inputfeature.name,
      fyear: $scope.inputfeature.year,
      fperiod: $scope.inputfeature.period,
    }, ];
    console.log(item.formData);
  };
}