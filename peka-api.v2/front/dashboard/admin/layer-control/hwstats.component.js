"use strict";

angular.module("layerControl").controller("hwStatsCtrl", ["$scope", "$http", "$interval", hwStatsCtrl]);

function hwStatsCtrl($scope, $http, $interval) {
  var hwst = "";
  $scope.bar3 = {};
  $scope.bar4 = {};
  $scope.pie2 = {};

  function loadHWSt(key, callback) {
    $http({
      method: "GET",
      url: "/admin/hw/getHWStats",
    }).then(
      function querySuccess(response) {
        $scope.hwst = angular.copy(response.data);
        // console.log($scope.hwst[0].tags);
        // console.log($scope.hwst[1].tags);
        callback(response);
      },
      function errorCallback(response) {
        throw new Error("connection failed");
      }
    );
  }

  function myCallbackFunction(response) {
    hwst = response.data;
    $scope.pie2.options = {
      color: ["rgba(39, 76, 80, 0.3)", "#274C50"],
      toolbox: {
        show: !0,
        feature: {
          restore: {
            show: !0,
            title: "refresh",
          },
        },
      },
      series: [{
        type: "pie",
        radius: ["60%", "85%"],
        itemStyle: {
          normal: {
            label: {
              show: !1,
            },
            labelLine: {
              show: !1,
            },
          },
          emphasis: {
            show: !0,
            label: {
              show: !0,
              formatter: "{d}% \n {b}",
              position: "center",
              textStyle: {
                fontSize: "20",
                fontFamily: "Poppins",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: 45,
              },
            },
          },
        },
        data: [{
            value: hwst[0].tags[0].val.replace("TB", ""),
            name: "Tersedia",
            label: {
              show: !0,
              formatter: "{c} ({d}%)",
              fontSize: 15,
            },
          },

          {
            value: hwst[0].tags[1].val.replace("TB", ""),
            name: "Penggunaan",
            label: {
              show: !0,
              formatter: "{c} ({d}%)",
              fontSize: 15,
            },
          },
        ],
      }, ],
    };

    $scope.bar3.options = {
      color: ["#274C50"],
      tooltip: {
        trigger: "axis",
      },
      toolbox: {
        show: true,
        feature: {
          restore: {
            show: true,
            title: "restore",
          },
        },
      },
      xAxis: [{
        type: "value",
        boundaryGap: [0, 0.1],
        min: 0,
        interval: 10,
        max: 100,
      }, ],
      yAxis: [{
        type: "category",
        data: ["RAM", "CPU", "GPU 2", "GPU 1"],
      }, ],
      series: [{
        name: "Penggunaan",
        type: "bar",
        data: [hwst[1].tags[5].val.replace("%", ""), hwst[1].tags[4].val.replace("%", ""), hwst[1].tags[3].val.replace("%", ""), hwst[1].tags[2].val.replace("%", "")],
      }, ],
    };

    $scope.bar4.options = {
      color: ["#274C50"],
      tooltip: {
        trigger: "axis",
      },
      toolbox: {
        show: true,
        feature: {
          restore: {
            show: true,
            title: "restore",
          },
        },
      },
      xAxis: [{
        type: "value",
        boundaryGap: [0, 0.01],
        min: 0,
        interval: 10,
        max: 100,
      }, ],
      yAxis: [{
        type: "category",
        data: ["RAM", "CPU", "GPU 7", "GPU 6", "GPU 5", "GPU 4", "GPU 3", "GPU 2", "GPU 1", "GPU 0"],
      }, ],
      series: [{
          name: "Utilization",
          type: "bar",
          data: [
            hwst[2].tags[16].val.replace("%", ""),
            hwst[2].tags[17].val.replace("%", ""),
            hwst[2].tags[12].val.replace("%", ""),
            hwst[2].tags[10].val.replace("%", ""),
            hwst[2].tags[8].val.replace("%", ""),
            hwst[2].tags[6].val.replace("%", ""),
            hwst[2].tags[4].val.replace("%", ""),
            hwst[2].tags[2].val.replace("%", ""),
            hwst[2].tags[0].val.replace("%", ""),
          ],
        },
        {
          name: "Memory",
          type: "bar",
          data: [
            hwst[2].tags[15].val.replace("%", ""),
            hwst[2].tags[13].val.replace("%", ""),
            hwst[2].tags[11].val.replace("%", ""),
            hwst[2].tags[9].val.replace("%", ""),
            hwst[2].tags[7].val.replace("%", ""),
            hwst[2].tags[5].val.replace("%", ""),
            hwst[2].tags[3].val.replace("%", ""),
          ],
        },
      ],
    };
    return hwst;
  }

  var reloadHW = undefined;
  $scope.logHWStats = function () {
    loadHWSt("MY_KEY", myCallbackFunction);
    reloadHW = $interval(function () {
      loadHWSt("MY_KEY", myCallbackFunction);
    }, 60000);
  };
  $scope.logHWStats();
}