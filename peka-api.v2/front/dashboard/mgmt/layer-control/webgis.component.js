"use strict";

angular.module("layerControl").controller("webgisCtrl", ["$scope", "$http", "$mdSidenav", "$timeout", "mapService_webgis", "$mdDialog", "$mdToast", webgisCtrl]);

function webgisCtrl($scope, $http, $mdSidenav, $timeout, mapService_webgis, $mdDialog, $mdToast) {
  const ctime = new Date();
  const webdomain = "http://karhutla.ai-innovation.id/dashboard/mgmt/";
  $scope.toggle = {};
  var falarm1 = false;
  var falarm2 = false;
  var falarm3 = false;
  var falarm4 = false;
  var falarm5 = false;
  const pgad = 10;
  var pagn1 = 0;
  var pagn2 = 0;
  var pagn3 = 0;
  var pagn4 = 0;
  var pagn5 = 0;
  var modsel = 0;
  $scope.penanganan = {};
  $scope.toggle.list1 = true;
  $scope.predDateGroup = [];
  $scope.hsDateGroup = [];
  $scope.vegDateGroup = [];
  $scope.modisDateGroup = [];
  $scope.landsatDateGroup = [];
  $scope.miscDateGroup = [];
  $scope.hs = mapService_webgis.info_detail;

  // Start Statikstik peka api
  $scope.dataSets = {};
  $scope.line = "line";
  $scope.bar = "bar";
  $scope.index = 0;
  $scope.labels_periode = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];
  $scope.series_periode = ["Hotspot", "Prediksi", "Devegetasi"];

  //  Styling chart
  $scope.optionsPeriode = {
    legend: {
      display: true,
      position: "top",
      align: "start",
    },

    title: {
      display: true,
      text: "",
      fontColor: "rgba(255,0,0,0.8)",
      fontSize: 16,
      padding: 5,
    },
    scales: {
      xAxes: [{
        position: "bottom",
        gridLines: {
          display: false,
        },
        ticks: {
          fontColor: "#000",
          fontSize: 10,
          beginAtZero: true,
        },
      }, ],
      yAxes: [{
        position: "right",
        ticks: {
          fontColor: "#9FA2B4",
          fontSize: 12,
          beginAtZero: true,
        },
      }, ],
    },
  };

  $scope.dataOverridePeriode = [{
      label: ["Potensi Hotspot"],
      fill: true,
      lineTension: 0.2,
      borderColor: "rgba(162, 101, 224, 1)",
      backgroundColor: "rgba(162, 101, 224, 0.08)",
      radius: 3,
      pointStyle: "circle",
      pointBackgroundColor: "rgba(162, 101, 224, 1)",
      pointHoverBackgroundColor: "rgba(162, 101, 224, 1)",
      hitRadius: 3,
      hoverRadius: 4,
      overBorderWidth: 10,
    },
    {
      label: ["Hotspot Satelit"],
      fill: true,
      lineTension: 0.2,
      borderColor: "rgba(55, 81, 255, 1)",
      backgroundColor: "rgba(55, 81, 255, 0.08)",
      radius: 3,
      pointStyle: "circle",
      pointBackgroundColor: "rgba(55, 81, 255, 1)",
      pointHoverBackgroundColor: "rgba(55, 81, 255, 1)",
      hitRadius: 3,
      hoverRadius: 4,
      overBorderWidth: 20,
    },
    {
      label: ["Devegetasi"],
      fill: true,
      lineTension: 0.2,
      borderColor: "rgba(23, 182, 20, 1)",
      backgroundColor: "rgba(23, 182, 20, 0.08)",
      radius: 3,
      pointStyle: "circle",
      pointBackgroundColor: "rgba(23, 182, 20, 1)",
      pointHoverBackgroundColor: "rgba(23, 182, 20, 1)",
      hitRadius: 3,
      hoverRadius: 4,
      overBorderWidth: 10,
    },
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };

  // Calendar
  $scope.formats = ["yyyy"];
  $scope.format = $scope.formats[0];
  $scope.open = function ($event) {
    $scope.popup.opened = true;
  };
  $scope.popup = {
    opened: false,
  };

  var ynow = String(new Date().getFullYear());

  // generate datapoint keys periode, set value 0
  var nperiod = 46;
  var dperiodphs = [];
  var dperiodhs = [];
  var dperiodveg = [];
  $scope.statsVeg = [];
  $scope.statsPHS = [];
  $scope.statsHS = [];

  for (var i = 0; i < nperiod; i++) {
    var c = '0';
    dperiodphs.push(c);
    dperiodhs.push(c);
    dperiodveg.push(c);
  }

  $scope.phsOnYear = function () {
    dperiodphs = [];
    for (var i = 0; i < nperiod; i++) {
      var c = '0';
      dperiodphs.push(c);
    }
    $http({
      method: "GET",
      url: "/mgmt/webgis/selectYearPredHS_v2",
      params: {
        year: ynow,
      },
    }).then(
      function querySuccess(response) {
        var data = angular.copy(response.data)
        var lastEvent = [];
        console.log(data)
        data.forEach((item) => {
          dperiodphs[(item.periode) - 1] = (item.count);
          lastEvent[(item.periode) - 1] = (item.count)
        });
        $scope.statsPHS = Object.values(dperiodphs)
        console.log('PHS', $scope.statsPHS)
        lastEvent = Object.values(lastEvent)
        $scope.phssaatini = parseFloat(lastEvent.slice(-1)[0])
        $scope.phssebelumnya = parseFloat(lastEvent.slice(-2)[0])
        var total = ($scope.phssaatini / $scope.phssebelumnya) * 100
        $scope.phspersentase = total.toFixed(2)
        console.log($scope.phspersentase)
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };

  $scope.hsOnYear = function () {
    dperiodhs = [];
    for (var i = 0; i < nperiod; i++) {
      var c = '0';
      dperiodhs.push(c);
    }
    $http({
      method: "GET",
      url: "/mgmt/webgis/selectYearHS",
      params: {
        year: ynow,
      },
    }).then(
      function querySuccess(response) {
        var data = angular.copy(response.data)
        var lastEvent = []
        console.log(data)
        data.forEach((item) => {
          dperiodhs[(item.periode) - 1] = (item.count);
          lastEvent[(item.periode) - 1] = (item.count);
        });
        $scope.statsHS = Object.values(dperiodhs)
        console.log('HS', $scope.statsHS)
        lastEvent = Object.values(lastEvent)
        $scope.hssaatini = parseFloat(lastEvent.slice(-1)[0])
        $scope.hssebelumnya = parseFloat(lastEvent.slice(-2)[0])
        var total = ($scope.hssaatini / $scope.hssebelumnya) * 100
        $scope.hspersentase = total.toFixed(2)

        if ($scope.hssaatini > $scope.hsssebelumnya) {
          $scope.naik = true;
          $scope.turun = false;
        } else {
          $scope.turun = true;
          $scope.naik = false;
        }

      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };
  // $scope.hsOnYear();
  $scope.vegOnYear = function () {
    dperiodveg = [];
    for (var i = 0; i < nperiod; i++) {
      var c = '0';
      dperiodveg.push(c);
    }
    $http({
      method: "GET",
      url: "/mgmt/webgis/selectYearVeg",
      params: {
        year: ynow,
      },
    }).then(
      function querySuccess(response) {
        var data = angular.copy(response.data)
        var lastEvent = [];
        data.forEach((item) => {
          dperiodveg[(item.periode) - 1] = (item.count);
          lastEvent[(item.periode) - 1] = (item.count);
        });
        $scope.statsVeg = Object.values(dperiodveg)
        console.log('veg', $scope.statsVeg)
        lastEvent = Object.values(lastEvent)
        $scope.vegsaatini = parseFloat(lastEvent.slice(-1)[0])
        $scope.vegsebelumnya = parseFloat(lastEvent.slice(-2)[0])
        var total = ($scope.vegsaatini / $scope.vegsebelumnya) * 100
        $scope.vegpersentase = total.toFixed(2)

        if ($scope.vegsaatini > $scope.vegsebelumnya) {
          $scope.naik = true;
          $scope.turun = false;
        } else {
          $scope.turun = true;
          $scope.naik = false;

        }

      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };
  // end last data

  // update array selected year
  $scope.selectPHSOnYear = function (today2) {
    var dateMonth = today2.getFullYear();
    dperiodphs = [];

    for (var i = 0; i < nperiod; i++) {
      var c = '0';
      dperiodphs.push(c);
    }
    $http({
      method: "GET",
      url: "/mgmt/webgis/selectYearPredHS_v2",
      params: {
        year: dateMonth,
      },
    }).then(
      function querySuccess(response) {
        var data = angular.copy(response.data);
        data.forEach((item) => {
          dperiodphs[(item.periode)] = (item.count);
        });
        $scope.statsPHS = Object.values(dperiodphs);
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };

  $scope.selectHSOnYear = function (today2) {
    var dateMonth = today2.getFullYear();
    dperiodhs = [];
    for (var i = 0; i < nperiod; i++) {
      var c = '0';
      dperiodhs.push(c);
    }
    $http({
      method: "GET",
      url: "/mgmt/webgis/selectYearHS",
      params: {
        year: dateMonth,
      },
    }).then(
      function querySuccess(response) {
        var data = angular.copy(response.data);
        data.forEach((item) => {
          dperiodhs[(item.periode)] = (item.count);
        });
        $scope.statsHS = Object.values(dperiodhs);
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };

  $scope.selectVegOnYear = function (today2) {
    var dateMonth = today2.getFullYear();
    dperiodveg = [];
    for (var i = 0; i < nperiod; i++) {
      var c = '0';
      dperiodveg.push(c);
    }
    $http({
      method: "GET",
      url: "/mgmt/webgis/selectYearVeg",
      params: {
        year: dateMonth,
      },
    }).then(
      function querySuccess(response) {
        var data = angular.copy(response.data);
        data.forEach((item) => {
          dperiodveg[(item.periode)] = (item.count);
        });
        $scope.statsVeg = Object.values(dperiodveg);
        console.log($scope.statsVeg);
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };
  // end last array data

  $scope.dateRange = function () {
    $scope.today = new Date();
    $scope.today2 = new Date();
    $scope.minDate = new Date([2019]);
  };
  $scope.dateRange();

  $scope.dateOptions = {
    minMode: "year",
  };

  // webgis
  $scope.showData = function () {
    $scope.visibleData = $scope.visibleData ? false : true;
  };

  $scope.close = function () {
    $scope.visibleData = $scope.visibleData ? false : true;
  };

  $scope.closeDetail = function () {
    $mdSidenav("right").close();
  };

  $scope.bottomPred = function () {
    if (!falarm1) {
      //run the event that was passed through
      falarm1 = true;
      $timeout(function () {
        if (falarm1 == true) {
          pagn1 += pgad;
          $scope.refreshListPred(pagn1);
          console.log("Hit the end");
          falarm1 = false;
        }
      }, 500);
    }
  };
  $scope.refreshListPred = function (ofs) {
    $http({
      method: "GET",
      url: "/mgmt/webgis/getDatePred",
      params: {
        offnum: ofs,
        modid: modsel,
      },
    }).then(
      function querySuccess(response) {
        if (response.data.length > 0) {
          var temp = $scope.predDateGroup;
          temp = temp.concat(response.data);
          angular.copy(temp, $scope.predDateGroup);
        }
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };
  $scope.bottomHS = function () {
    if (!falarm2) {
      //run the event that was passed through
      falarm2 = true;
      $timeout(function () {
        if (falarm2 == true) {
          pagn2 += pgad;
          $scope.refreshListHS(pagn2);
          console.log("Hit the end");
          falarm2 = false;
        }
      }, 500);
    }
  };
  $scope.refreshListHS = function (ofs) {
    $http({
      method: "GET",
      url: "/mgmt/webgis/getDateHS",
      params: {
        offnum: ofs,
      },
    }).then(
      function querySuccess(response) {
        if (response.data.length > 0) {
          var temp = $scope.hsDateGroup;
          temp = temp.concat(response.data);
          angular.copy(temp, $scope.hsDateGroup);
        }
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };
  $scope.bottomVeg = function () {
    if (!falarm3) {
      //run the event that was passed through
      falarm3 = true;
      $timeout(function () {
        if (falarm3 == true) {
          pagn3 += pgad;
          $scope.refreshListVeg(pagn3);
          console.log("Hit the end");
          falarm3 = false;
        }
      }, 500);
    }
  };
  $scope.refreshListVeg = function (ofs) {
    $http({
      method: "GET",
      url: "/mgmt/webgis/getDateVeg",
      params: {
        offnum: ofs,
      },
    }).then(
      function querySuccess(response) {
        if (response.data.length > 0) {
          var temp = $scope.vegDateGroup;
          temp = temp.concat(response.data);
          angular.copy(temp, $scope.vegDateGroup);
        }
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };
  $scope.dateCompare = function (targ) {
    const tgtime = new Date(targ);
    if (tgtime >= ctime) {
      return true;
    } else {
      return false;
    }
  };
  $scope.chooseModel = function (ev) {
    $mdDialog
      .show({
        controller: "changemodeldialog",
        parent: angular.element(document.body),
        templateUrl: "dialog/changemodel/changemodel.template.html",
        targetEvent: ev,
      })
      .then(function (response) {
        mapService_webgis.clearMap();
        console.log(response);
        modsel = response;
        $scope.predDateGroup = [];
        $scope.refreshListPred(0);
      })
      .catch(function (responseIfRejected) {
        console.log("cancel");
      });
  };
  $scope.predItemCheck = function (tid_chk) {
    $scope.predDateGroup.filter(function (hsit) {
      if (hsit.tid == tid_chk) {
        if (hsit.check) {
          console.log(tid_chk);
          $http({
            method: "GET",
            url: "/mgmt/webgis/getPredHS",
            params: {
              timid: tid_chk,
              modid: modsel,
            },
          }).then(
            function querySuccess(response) {
              if (response.data.features.length > 0) {
                $scope.total_predHS = mapService_webgis.drawHS("predHS_" + tid_chk, response.data);
                $scope.total_predHS = response.data.features.length;
              }
            },
            function queryError(response) {
              console.log("connection failed");
            }
          );
        } else {
          console.log("close " + tid_chk);
          mapService_webgis.removeHS("predHS_" + tid_chk);
        }
      }
    });
  };
  $scope.hsItemCheck = function (tid_chk) {
    console.log(tid_chk);
    $scope.hsDateGroup.filter(function (hsit) {
      if (hsit.tid == tid_chk) {
        if (hsit.check) {
          console.log(tid_chk);
          $http({
            method: "GET",
            url: "/mgmt/webgis/getHS",
            params: {
              timid: tid_chk,
            },
          }).then(
            function querySuccess(response) {
              if (response.data.features.length > 0) {
                mapService_webgis.drawHS("HS_" + tid_chk, response.data);
              }
            },
            function queryError(response) {
              console.log("connection failed");
            }
          );
        } else {
          console.log("close " + tid_chk);
          mapService_webgis.removeHS("HS_" + tid_chk);
        }
      }
    });
  };

  $scope.vegItemCheck = function (tid_chk) {
    console.log(tid_chk);
    $scope.vegDateGroup.filter(function (hsit) {
      if (hsit.tid == tid_chk) {
        if (hsit.check) {
          console.log(tid_chk);
          $http({
            method: "GET",
            url: "/mgmt/webgis/getVeg",
            params: {
              timid: tid_chk,
            },
          }).then(
            function querySuccess(response) {
              if (response.data.features.length > 0) {
                console.log(response.data.features.length);
                mapService_webgis.drawHS("Veg_" + tid_chk, response.data);
              }
            },
            function queryError(response) {
              console.log("connection failed");
            }
          );
        } else {
          console.log("close " + tid_chk);
          mapService_webgis.removeHS("Veg_" + tid_chk);
        }
      }
    });
  };
  $scope.bottomModis = function () {
    if (!falarm4) {
      //run the event that was passed through
      falarm4 = true;
      $timeout(function () {
        if (falarm4 == true) {
          pagn4 += pgad;
          $scope.refreshListModis(pagn4);
          console.log("Hit the end");
          falarm4 = false;
        }
      }, 500);
    }
  };

  $scope.refreshListModis = function (ofs) {
    $http({
      method: "GET",
      url: "/mgmt/webgis/getDateModis",
      params: {
        offnum: ofs,
      },
    }).then(
      function querySuccess(response) {
        if (response.data.length > 0) {
          var temp = $scope.modisDateGroup;
          temp = temp.concat(response.data);
          angular.copy(temp, $scope.modisDateGroup);
        }
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };
  $scope.bottomLandsat = function () {
    if (!falarm5) {
      //run the event that was passed through
      falarm5 = true;
      $timeout(function () {
        if (falarm5 == true) {
          pagn5 += pgad;
          $scope.refreshListModis(pagn5);
          console.log("Hit the end");
          falarm5 = false;
        }
      }, 500);
    }
  };
  $scope.refreshListLandsat = function (ofs) {
    $http({
      method: "GET",
      url: "/mgmt/webgis/getDateLandsat",
      params: {
        offnum: ofs,
      },
    }).then(
      function querySuccess(response) {
        if (response.data.length > 0) {
          var temp = $scope.landsatDateGroup;
          temp = temp.concat(response.data);
          angular.copy(temp, $scope.landsatDateGroup);
        }
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };
  $scope.modisItemCheck = function (dur, inm) {
    $scope.modisDateGroup.filter(function (hsit) {
      if (hsit.ur == dur) {
        if (hsit.check) {
          const xurl = webdomain + dur + "/{z}/{x}/{-y}.png";
          console.log(xurl);
          mapService_webgis.addRasterLayer(xurl, inm, 10);
        } else {
          console.log("id to remove " + inm);
          mapService_webgis.removeRasterLayer(inm);
        }
      }
    });
  };
  $scope.landsatItemCheck = function (dur, inm) {
    $scope.landsatDateGroup.filter(function (hsit) {
      if (hsit.ur == dur) {
        if (hsit.check) {
          const xurl = webdomain + dur + "/{z}/{x}/{-y}.png";
          console.log(xurl);
          mapService_webgis.addRasterLayer(xurl, inm, 10);
        } else {
          console.log("id to remove " + inm);
          mapService_webgis.removeRasterLayer(inm);
        }
      }
    });
  };
  $scope.refreshListPred(0);
  $scope.refreshListHS(0);
  $scope.refreshListVeg(0);
  $scope.refreshListModis(0);
  $scope.refreshListLandsat(0);

  $timeout(function () {
    $scope.phsOnYear();
    $scope.hsOnYear();
    $scope.vegOnYear();
    console.log('reload')
  }, 500);

  // end webgis
}