"use strict";

angular
  .module("layerControl")
  .directive("chart", function () {
    return {
      restrict: "E",
      scope: {},
      template: "<div id='chartdiv'></div>",
      replace: true,
      link: function ($scope) {
        var chart = am4core.create("chartdiv", am4charts.XYChart);

        chart.paddingRight = 20;
        chart.marginLeft = -30;
        chart.paddingTop = 70;

        var data = [];
        var visits = 10;
        for (var i = 1; i < 366; i++) {
          visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
          data.push({
            date: new Date(2021, 0, i),
            name: "name" + i,
            value: visits,
          });
        }
        chart.data = data;

        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.renderer.minWidth = 35;
        // categoryAxis.renderer.grid.template.disabled = true;

        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = "date";
        series.dataFields.valueY = "value";

        series.tooltipText = "{valueY.value}";
        chart.cursor = new am4charts.XYCursor();

        var scrollbarX = new am4charts.XYChartScrollbar();
        scrollbarX.series.push(series);
        chart.scrollbarX = scrollbarX;

        $scope.$on("$destroy", function () {
          chart.dispose();
        });
      },
    };
  })
  .component("layerControl", {
    templateUrl: "layer-control/layer-control.template.html",
    controller: function layercontrolController($scope, $http, $mdSidenav, mapService, $interval) {
      const webdomain = "http://karhutla.ai-innovation.id/";
      var phsar = [];
      var hsar = [];
      var devar = [];
      var recar = [];
      $scope.toggle = {};
      $scope.toggle.list1 = false;
      $scope.visibleLokasi = false;
      $scope.visibleInfoBahaya = false;
      $scope.visibleModeVC = false;
      $scope.visibleModeData = false;
      $scope.visibleGrafik = false;
      $scope.visibleFooterData = false;
      $scope.visibleFooterUp = true;
      $scope.visibleChartPeriode = true;
      $scope.visibleChartPrediksi = false;
      $scope.hs = mapService.info_detail;
      $scope.modisDateGroup = [];
      $scope.landsatDateGroup = [];
      $scope.hsDateGroup = [];
      $scope.predDateGroup = [];
      $scope.vegDateGroup = [];
      var modsel = 0;
      $scope.statsPHS = [];
      $scope.statsHS = [];
      $scope.statsVeg = [];

      $scope.line = "line";
      $scope.bar = "bar";
      $scope.index = 0;
      $scope.labels_periode = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      $scope.series_periode = ["Hotspot", "Prediksi", "Devegetasi"];
      $scope.thisyear = new Date().getFullYear();

      // Calendar
      $scope.formats = ["yyyy"];
      $scope.format = $scope.formats[0];
      $scope.open = function ($event) {
        $scope.popup.opened = true;
      };
      $scope.popup = {
        opened: false,
      };

      // generate datapoint keys periode, set value 0
      var nperiod = 12;
      var dMonthPHS = [];
      var dMonthHS = [];
      var dMonthVeg = [];

      for (var i = 0; i < nperiod; i++) {
        var c = "0";
        dMonthPHS.push(c);
        dMonthHS.push(c);
        dMonthVeg.push(c);
      }

      $scope.phsOnYear = function () {
        var now = new Date().getFullYear();
        dMonthPHS = [];
        for (var i = 0; i < nperiod; i++) {
          var c = "0";
          dMonthPHS.push(c);
        }
        $http({
          method: "GET",
          url: "/public/onYearPredHS",
          params: {
            year: now,
          },
        }).then(
          function querySuccess(response) {
            var data = angular.copy(response.data);
            var lastEvent = [];
            data.forEach((item) => {
              dMonthPHS[item.month] = item.count;
              lastEvent[item.month] = item.count;
            });
            $scope.statsPHS = Object.values(dMonthPHS);
            // console.log("PHS", $scope.statsPHS);
            var phssaatini = parseFloat(lastEvent.slice(-1)[0]);
            $scope.phssaatini = phssaatini.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            var phssebelumnya = parseFloat(lastEvent.slice(-2)[0]);
            $scope.phssebelumnya = phssebelumnya.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            var total = (phssaatini / phssebelumnya) * 100;
            $scope.phspersentase = total.toFixed(2);

            if (phssebelumnya > phssaatini) {
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

      $scope.hsOnYear = function () {
        var now = new Date().getFullYear();
        dMonthHS = [];
        for (var i = 0; i < nperiod; i++) {
          var c = "0";
          dMonthHS.push(c);
        }
        $http({
          method: "GET",
          url: "/public/onYearHS",
          params: {
            year: now,
          },
        }).then(
          function querySuccess(response) {
            var data = angular.copy(response.data);
            var lastEvent = [];
            data.forEach((item) => {
              dMonthHS[item.month - 1] = item.count;
              lastEvent[item.month - 1] = item.count;
            });
            $scope.statsHS = Object.values(dMonthHS);
            // console.log("HS", $scope.statsHS);
            var hssaatini = parseFloat(lastEvent.slice(-1)[0]);
            $scope.hssaatini = hssaatini.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            var hssebelumnya = parseFloat(lastEvent.slice(-2)[0]);
            $scope.hssebelumnya = hssebelumnya.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            var total = (hssaatini / hssebelumnya) * 100;
            $scope.hspersentase = total.toFixed(2);

            if (hssaatini > hssebelumnya) {
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
      $scope.vegOnYear = function () {
        var now = new Date().getFullYear();
        dMonthVeg = [];
        for (var i = 0; i < nperiod; i++) {
          var c = "0";
          dMonthVeg.push(c);
        }
        $http({
          method: "GET",
          url: "/public/onYearVeg",
          params: {
            year: now,
          },
        }).then(
          function querySuccess(response) {
            var data = angular.copy(response.data);
            var lastEvent = [];
            data.forEach((item) => {
              dMonthVeg[item.month - 1] = item.count;
              lastEvent[item.month - 1] = item.count;
            });
            $scope.statsVeg = Object.values(dMonthVeg);
            // console.log("Veg", $scope.statsVeg);
            var vegsaatini = parseFloat(lastEvent.slice(-1)[0]);
            $scope.vegsaatini = vegsaatini.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            var vegsebelumnya = parseFloat(lastEvent.slice(-2)[0]);
            $scope.vegsebelumnya = vegsebelumnya.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            var total = (vegsaatini / vegsebelumnya) * 100;
            $scope.vegpersentase = total.toFixed(2);

            if (vegsaatini > vegsebelumnya) {
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

      $scope.selectPHSOnYear = function (today2) {
        let dateMonth = today2.getFullYear();
        dMonthPHS = [];
        for (var i = 0; i < nperiod; i++) {
          var c = "0";
          dMonthPHS.push(c);
        }
        $http({
          method: "GET",
          url: "/public/onYearPredHS",
          params: {
            year: dateMonth,
          },
        }).then(
          function querySuccess(response) {
            var data = angular.copy(response.data);
            data.forEach((item) => {
              dMonthPHS[item.month] = item.count;
            });
            $scope.statsPHS = Object.values(dMonthPHS);
          },
          function queryError(response) {
            console.log("connection failed");
          }
        );
      };
      $scope.selectVegOnYear = function (today2) {
        let dateMonth = today2.getFullYear();
        dMonthVeg = [];
        for (var i = 0; i < nperiod; i++) {
          var c = "0";
          dMonthVeg.push(c);
        }
        $http({
          method: "GET",
          url: "/public/onYearVeg",
          params: {
            year: dateMonth,
          },
        }).then(
          function querySuccess(response) {
            var data = angular.copy(response.data);
            data.forEach((item) => {
              dMonthVeg[item.month - 1] = item.count;
            });
            $scope.statsVeg = Object.values(dMonthVeg);
          },
          function queryError(response) {
            console.log("connection failed");
          }
        );
      };
      $scope.selectHSOnYear = function (today2) {
        let dateMonth = today2.getFullYear();
        dMonthHS = [];
        for (var i = 0; i < nperiod; i++) {
          var c = "0";
          dMonthHS.push(c);
        }
        $http({
          method: "GET",
          url: "/public/onYearHS",
          params: {
            year: dateMonth,
          },
        }).then(function querySuccess(response) {
          var data = angular.copy(response.data);
          data.forEach((item) => {
            dMonthHS[item.month] = item.count;
          });
          $scope.statsHS = Object.values(dMonthHS);
        });
      };

      $scope.dateRange = function () {
        $scope.today = new Date();
        $scope.today2 = new Date();
        $scope.minDate = new Date([2011]);
      };
      $scope.dateRange();

      $scope.dateOptions = {
        minMode: "year",
      };
      // end calendar

      $scope.getPredHSonYear = function (today) {
        let year = today.getFullYear();
        $http({
          method: "GET",
          url: "/public/getPredHSonYear",
          params: {
            offnum: ofs,
            modid: modsel,
            periode: year,
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

      $scope.refreshListPred = function (ofs) {
        $http({
          method: "GET",
          url: "/public/getDatePred",
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

      $scope.predItemCheck = function (tid_chk) {
        $scope.predDateGroup.filter(function (hsit) {
          if (hsit.tid == tid_chk) {
            if (hsit.check) {
              console.log(tid_chk);
              $http({
                method: "GET",
                url: "/public/getPredHS",
              }).then(
                function querySuccess(response) {
                  if (response.data.features && response.data.features.length > 0) {
                    mapService.drawHS("predHS_" + tid_chk, response.data);
                  } else {
                    console.log("Tidak ada potensi hotspot")
                  }
                },
                function queryError(response) {
                  console.log("connection failed");
                }
              );
            } else {
              console.log("close " + tid_chk);
              mapService.removeHS("predHS_" + tid_chk);
            }
          }
        });
      };

      $scope.lastPredHS = function () {
        $http({
          method: "GET",
          url: "/public/getPredHS",
        }).then(
          function querySuccess(response) {
            if (response.data.features && response.data.features.length === 0) {
              console.log("No Prediction");
            }
            if (response.data.features) {
              const nphsar = response.data.features;
              const toadd = nphsar.filter(({
                id: id1
              }) => !phsar.some(({
                id: id2
              }) => id2 === id1));
              const todel = phsar.filter(({
                id: id1
              }) => !nphsar.some(({
                id: id2
              }) => id2 === id1));
              phsar = nphsar;
              var pid;
              var ngjson = {};
              ngjson.type = "FeatureCollection";
              ngjson.features = [];
              toadd.map(function (el) {
                ngjson.features.push(el);
                pid = el.properties.pid;
              });
              if (pid) {
                mapService.drawHS("predHS_" + pid, ngjson);
              }
              var dpid;
              todel.map(function (el) {
                dpid = el.properties.pid;
              });
              if (dpid) {
                mapService.removeHS("predHS_" + dpid);
              }
            }
          },
          function queryError(response) {
            console.log("connection failed");
          }
        );
      };
      $scope.refreshListPred(0);
      $scope.lastPredHS();
      //End prediksi hotspot

      // Hotspot satelit
      $scope.refreshListHS = function (ofs) {
        $http({
          method: "GET",
          url: "/public/getDateHS",
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
      $scope.hsItemCheck = function (tid_chk) {
        $scope.hsDateGroup.filter(function (hsit) {
          if (hsit.tid == tid_chk) {
            if (hsit.check) {
              console.log(tid_chk);
              $http({
                method: "GET",
                url: "/public/getHS",
              }).then(
                function querySuccess(response) {
                  if (response.data.features && response.data.features.length === 0) {
                    console.log("No Hotspot Found");
                  }
                  if (response.data.features.length > 0) {
                    mapService.drawHS("HS_" + tid_chk, response.data);
                  }
                },
                function queryError(response) {
                  console.log("connection failed");
                }
              );
            } else {
              console.log("close " + tid_chk);
              mapService.removeHS("HS_" + tid_chk);
            }
          }
        });
      };
      $scope.hsStart = function () {
        $http({
          method: "GET",
          url: "/public/getHS",
        }).then(
          function querySuccess(response) {
            if (response.data.features && response.data.features.length === 0) {
              console.log("No Hotspot Found");
            }
            if (response.data.features) {
              const nhsar = response.data.features;
              const toadd = nhsar.filter(({
                id: id1
              }) => !hsar.some(({
                id: id2
              }) => id2 === id1));
              const todel = hsar.filter(({
                id: id1
              }) => !nhsar.some(({
                id: id2
              }) => id2 === id1));
              hsar = nhsar;
              var pid;
              var ngjson = {};
              ngjson.type = "FeatureCollection";
              ngjson.features = [];
              toadd.map(function (el) {
                ngjson.features.push(el);
                pid = el.properties.pid;
              });
              if (pid) {
                mapService.drawHS("HS_" + pid, ngjson);
              }
              var dpid;
              todel.map(function (el) {
                dpid = el.properties.pid;
              });
              if (dpid) {
                mapService.removeHS("HS_" + dpid);
              }
            }
          },
          function queryError(response) {
            console.log("connection failed");
          }
        );
      };
      $scope.hsStart();
      $scope.refreshListHS(0);
      // End hotspot satelit

      //Devegetasi
      $scope.refreshListVeg = function (ofs) {
        $http({
          method: "GET",
          url: "/public/getDateVeg",
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

      // zona potensi
      $http({
        method: "GET",
        url: "/public/getKabupaten",
      }).then(
        function querySuccess(response) {
          if (response.data.features && response.data.features.length > 0) {
            console.log(response.data.features.length);
            mapService.drawKabupaten("testKab_", response.data);
          } else {
            console.log("Zona Potensi Not Found");
          }
        },
        function queryError(response) {
          console.log("connection failed");
        }
      );
      // end zona potensi

      $scope.vegItemCheck = function (tid_chk) {
        $scope.vegDateGroup.filter(function (hsit) {
          if (hsit.tid == tid_chk) {
            if (hsit.check) {
              console.log(tid_chk);
              $http({
                method: "GET",
                url: "/public/getVeg",
              }).then(
                function querySuccess(response) {
                  if (response.data.features && response.data.features.length > 0) {
                    console.log(response.data.features.length);
                    mapService.drawHS("predVeg_" + tid_chk, response.data);
                  } else {
                    console.log("No Devegtasi Found");
                  }
                },
                function queryError(response) {
                  console.log("connection failed");
                }
              );
            } else {
              console.log("close " + tid_chk);
              mapService.removeHS("predVeg_" + tid_chk);
            }
          }
        });
      };

      $scope.startVegItemCheck = function () {
        $http({
          method: "GET",
          url: "/public/getVeg",
        }).then(
          function querySuccess(response) {
            if (response.data.features && response.data.features.length > 0) {
              mapService.drawHS("predVeg_", response.data);
            } else {
              ("No Devegetasi Found");
            }
            if (response.data.features) {
              const ndevar = response.data.features;
              const toadd = ndevar.filter(({
                id: id1
              }) => !devar.some(({
                id: id2
              }) => id2 === id1));
              const todel = devar.filter(({
                id: id1
              }) => !ndevar.some(({
                id: id2
              }) => id2 === id1));
              devar = ndevar;
              var pid;
              var ngjson = {};
              ngjson.type = "FeatureCollection";
              ngjson.features = [];
              toadd.map(function (el) {
                ngjson.features.push(el);
                pid = el.properties.pid;
              });
              if (pid) {
                mapService.drawHS("predVeg_" + pid, ngjson);
              }
              var dpid;
              todel.map(function (el) {
                dpid = el.properties.pid;
              });
              if (dpid) {
                mapService.removeHS("predVeg_" + dpid);
              }
            }
          },
          function queryError(response) {
            console.log("connection failed");
          }
        );
      };
      // $scope.startVegItemCheck();
      $scope.refreshListVeg(0);
      // End Devegetasi

      //chart periode
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
          padding: -5,
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
              fontSize: 10,
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
          hoverRadius: 5,
          overBorderWidth: 20,
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
          hoverRadius: 5,
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
          hoverRadius: 5,
          overBorderWidth: 20,
        },
      ];

      $scope.onClick = function (points, evt) {
        console.log(points, evt);
      };
      // End statistik peka api

      $scope.refreshListModis = function (ofs) {
        $http({
          method: "GET",
          url: "/public/getDateModis",
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

      $scope.modisItemCheck = function (dur, inm) {
        $scope.modisDateGroup.filter(function (hsit) {
          if (hsit.ur == dur) {
            if (hsit.check) {
              const xurl = webdomain + dur + "/{z}/{x}/{-y}.png";
              console.log(xurl);
              mapService.addRasterLayer(xurl, inm, 10);
            } else {
              console.log("id to remove " + inm);
              mapService.removeRasterLayer(inm);
            }
          }
        });
      };

      $scope.refreshListLandsat = function (ofs) {
        $http({
          method: "GET",
          url: "/public/getDateLandsat",
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

      $scope.landsatItemCheck = function (dur, inm) {
        $scope.landsatDateGroup.filter(function (hsit) {
          if (hsit.ur == dur) {
            if (hsit.check) {
              const xurl = webdomain + dur + "/{z}/{x}/{-y}.png";
              console.log(xurl);
              mapService.addRasterLayer(xurl, inm, 10);
            } else {
              console.log("id to remove " + inm);
              mapService.removeRasterLayer(inm);
            }
          }
        });
      };

      $scope.refreshListModis(0);
      $scope.refreshListLandsat(0);

      $scope.recItemCheck = function () {
        $http({
          method: "GET",
          url: "/public/getRec",
        }).then(
          function querySuccess(response) {
            if (response.data.features) {
              const nrecar = response.data.features;
              const toadd = nrecar.filter(({
                id: id1
              }) => !recar.some(({
                id: id2
              }) => id2 === id1));
              const todel = recar.filter(({
                id: id1
              }) => !nrecar.some(({
                id: id2
              }) => id2 === id1));
              recar = nrecar;
              toadd.map(function (el) {
                var ngjson = {};
                ngjson.type = "FeatureCollection";
                ngjson.features = [];
                ngjson.features.push(el);
                mapService.drawHS("rec_" + el.id, ngjson);
              });
              todel.map(function (el) {
                mapService.removeHS("rec_" + el.id);
              });
            }
          },
          function queryError(response) {
            console.log("connection failed");
          }
        );
      };

      $scope.hideAll = function () {
        $scope.toggle.list2 = false;
        $scope.toggle.list3 = false;
        $scope.toggle.list4 = false;
        $scope.toggle.list5 = false;
        $scope.visibleLokasi = false;
        $scope.visibleInfoBahaya = false;
        $scope.visibleModeVC = false;
        $scope.visibleModeData = false;
        $scope.visibleGrafik = false;
      };

      $scope.showLokasi = function () {
        $scope.visibleLokasi = $scope.visibleLokasi ? false : true;
        $scope.toggle.list1 = false;
        $scope.toggle.list2 = false;
        $scope.toggle.list3 = false;
        $scope.toggle.list5 = false;
        $scope.visibleInfoBahaya = false;
        $scope.visibleModeVC = false;
        $scope.visibleModeData = false;
        $scope.visibleGrafik = false;
      };
      $scope.showInfoBahaya = function () {
        $scope.visibleInfoBahaya = $scope.visibleInfoBahaya ? false : true;
        $scope.visibleLokasi = false;
        $scope.visibleModeVC = false;
        $scope.visibleModeData = false;
        $scope.visibleGrafik = false;
      };
      $scope.hideInfoBahaya = function () {
        $scope.visibleInfoBahaya = false;
      };
      $scope.showModeVC = function () {
        $scope.visibleModeVC = $scope.visibleModeVC ? false : true;
        $scope.toggle.list1 = true;
        $scope.toggle.list3 = false;
        $scope.toggle.list4 = false;
        $scope.toggle.list5 = false;
        $scope.visibleLokasi = false;
        $scope.visibleInfoBahaya = false;
        $scope.visibleModeData = false;
        $scope.visibleGrafik = false;
      };
      $scope.hideModePeta = function () {
        $scope.visibleModeVC = false;
      };
      $scope.showModeData = function () {
        $scope.visibleModeData = $scope.visibleModeData ? false : true;
        $scope.toggle.list1 = true;
        $scope.toggle.list2 = false;
        $scope.toggle.list4 = false;
        $scope.toggle.list5 = false;
        $scope.visibleLokasi = false;
        $scope.visibleInfoBahaya = false;
        $scope.visibleModeVC = false;
        $scope.visibleGrafik = false;
      };
      $scope.hideModeData = function () {
        $scope.visibleModeData = false;
      };
      $scope.showGrafik = function () {
        $scope.visibleGrafik = $scope.visibleGrafik ? false : true;
        $scope.toggle.list1 = false;
        $scope.toggle.list2 = false;
        $scope.toggle.list3 = false;
        $scope.toggle.list4 = false;
        $scope.visibleLokasi = false;
        $scope.visibleInfoBahaya = false;
        $scope.visibleModeVC = false;
        $scope.visibleModeData = false;
      };
      $scope.showFooterData = function () {
        $scope.visibleFooterData = $scope.visibleFooterData ? false : true;
        $scope.visibleFooterUp = false;
      };
      $scope.hideFooterData = function () {
        $scope.visibleFooterData = false;
        $scope.visibleFooterUp = true;
      };

      // show chart
      $scope.category = "periode";
      $scope.showChartPeriode = function (id) {
        $scope.category = id;
        $scope.visibleChartPrediksi = false;
        $scope.visibleChartPeriode = true;
      };
      $scope.showChartPrediksi = function (id) {
        $scope.category = id;
        $scope.visibleChartPrediksi = $scope.visibleChartPrediksi ? false : true;
        $scope.visibleChartPeriode = false;
        $scope.visibleChartPrediksi = true;
      };
      $scope.showChartZonaPotensi = function (id) {
        $scope.category = id;
        $scope.visibleChartPeriode = false;
        $scope.visibleChartPrediksi = true;
      };

      $scope.phsOnYear();
      $scope.hsOnYear();
      $scope.vegOnYear();

      $interval(function () {
        $scope.recItemCheck();
      }, 1000 * 300);
    },
  });