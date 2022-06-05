angular.module("mapService_webgis", [])
    // $mdSidenav
    .factory('mapService_webgis', function ($mdSidenav) {
        var mapObj;
        var viewObj;
        var draw;
        var pointsource;
        //var hssource;
        var vector;
        var services = {};
        services.hs_clicked = undefined;
        services.type_clicked = undefined;
        services.info_detail = [];
        const pinpointStyle = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 250],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                scale: 0.1,
                src: 'assets/images/webgis/pin-yellow.png'
            })
        });
        const hsRad = new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(0, 10, 180, 0.1)'
            }),
            stroke: new ol.style.Stroke({
                width: 1,
                color: 'rgba(0, 10, 180, 0.6)'
            })
        });
        services.mapInit = function (mapobj, viewobj) {
            mapObj = mapobj;
            viewObj = viewobj;
        }
        services.drawPoint = function (gjson) {
            if (!gjson) {
                pointsource = new ol.source.Vector();
            } else {
                pointsource = new ol.source.Vector({
                    features: (new ol.format.GeoJSON()).readFeatures(gjson)
                });
            }
            vector = new ol.layer.Vector({
                source: pointsource
            });
            vector.set('name', 'tempolygon');
            vector.setStyle(pinpointStyle);
            mapObj.addLayer(vector);
            vector.setZIndex(9999);
            draw = new ol.interaction.Draw({
                source: pointsource,
                type: "Point",
                style: pinpointStyle
            });
            mapObj.addInteraction(draw);
            vector.getSource().on('addfeature', function (event) {
                var vctrs = vector.getSource().getFeatures();
                if (vctrs.length > 1) {
                    console.log('remove point');
                    vector.getSource().removeFeature(vctrs[0]);
                }
            });
        }
        services.removeHS = function (idn) {
            var layersToRemove = [];
            mapObj.getLayers().forEach(function (layer) {
                if (layer.get('name') != undefined) {
                    const rdnm = 'rad_' + idn;
                    if (layer.get('name') === idn || layer.get('name') === rdnm) {
                        layersToRemove.push(layer);
                    }
                }
            });

            var len = layersToRemove.length;
            for (var i = 0; i < len; i++) {
                mapObj.removeLayer(layersToRemove[i]);
            }
        }
        services.drawHS = function (idn, gjson) {
            if (gjson.features == null) {
                console.log("No Hotspot Found!");
            } else {
                const idt = idn.split('_')[0];
                var ity = 'c';
                if (idt == 'predHS') {
                    ity = 'r';
                } else if (idt == 'HS') {
                    ity = 'c';
                } else if (idt == 'Veg') {
                    ity = 't';
                } else if (idt == 'rec') {
                    ity = 'pin';
                }
                var hssource = new ol.source.Vector({
                    features: (new ol.format.GeoJSON()).readFeatures(gjson)
                });
                console.log(gjson.features.length);
                hssource.forEachFeature(function (feature) {
                    const clvl = feature.getProperties()['c'];
                    var cfrgb = '';
                    var scal = 0.05;
                    if (clvl !== undefined) {
                        cfrgb = String(parseInt(Math.round(parseFloat(clvl) / 10) * 10));
                    } else {
                        scal = 0.1;
                    }
                    const rpointStyle = new ol.style.Style({
                        image: new ol.style.Icon({
                            anchor: [0.5, 0.5],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            scale: scal,
                            src: 'assets/images/webgis/' + cfrgb + ity + '.png'
                        })
                    });
                    feature.setStyle(rpointStyle);
                });
                var hsvector = new ol.layer.Vector({
                    source: hssource
                });
                hsvector.set('name', idn);
                mapObj.addLayer(hsvector);
                hsvector.setZIndex(30);
            }
        }
        services.refreshLineup = function (newlu) {
            var lyidx = 0;
            const mlx = newlu.length;
            newlu.forEach(function (layd) {
                mapObj.getLayers().forEach(function (layer) {
                    if (layer.get('id') == layd.id) {
                        const nzdx = mlx - lyidx;
                        layer.setZIndex(nzdx);
                    }
                });
                lyidx = lyidx + 1;
            });
        }
        services.addRasterLayer = function (xyzurl, nuid, zin) {
            var uraster = new ol.layer.Tile({
                preload: true,
                source: new ol.source.XYZ({
                    url: xyzurl
                })
            });
            uraster.set('name', 'rastername');
            uraster.set('id', nuid);
            //mapObj.getLayers().insertAt(mapObj.getLayers().getArray().length-2, uraster);
            mapObj.addLayer(uraster);
            uraster.setZIndex(zin);
        }
        services.removeRasterLayer = function (id2c) {
            var tgtlyr = undefined;
            mapObj.getLayers().forEach(function (layer) {
                if (layer.get('id') == id2c) {
                    tgtlyr = layer;
                }
            });
            if (tgtlyr != undefined) {
                mapObj.removeLayer(tgtlyr);
            }
        }
        services.changeLayerSource = function (xyzurl, nuid) {
            console.log(nuid);
            var usource = new ol.source.XYZ({
                url: xyzurl
            })
            mapObj.getLayers().forEach(function (layer) {
                if (layer.get('id') == nuid) {
                    console.log(layer.get('id'));
                    layer.setSource(usource);
                }
            });
        }
        services.clearMap = function () {
            var layersToRemove = [];
            mapObj.getLayers().forEach(function (layer) {
                if (layer.get('name') != undefined) {
                    var lynm = layer.get('name');
                    lynm = lynm.split('_')[0];
                    if (lynm === 'predHS') {
                        layersToRemove.push(layer);
                    }
                }
            });

            var len = layersToRemove.length;
            for (var i = 0; i < len; i++) {
                mapObj.removeLayer(layersToRemove[i]);
            }
        }
        services.selectHS = function (feature, layername) {
            if (services.hs_clicked !== undefined || feature === undefined) {
                if (services.type_clicked === undefined) {
                    console.log('do nothing');
                } else {
                    mapObj.getLayers().forEach(function (layer) {
                        const lyrnm = layer.get('name');
                        if (lyrnm == services.type_clicked) {
                            console.log(lyrnm);
                            var hssource = layer.getSource();
                            hssource.forEachFeature(function (feature) {
                                if (feature.id_ == services.hs_clicked) {
                                    var ity = 'c';
                                    const layertype = services.type_clicked.split('_')[0];
                                    if (layertype == 'predHS') {
                                        ity = 'r';
                                    } else if (layertype == 'HS') {
                                        ity = 'c';
                                    } else if (layertype == 'Veg') {
                                        ity = 't';
                                    }
                                    const clvl = feature.getProperties()['c'];
                                    console.log(services.type_clicked);
                                    console.log(ity);
                                    var cfrgb = String(parseInt(Math.round(parseFloat(clvl) / 10) * 10));
                                    var scal = 0.05;
                                    if (layertype == 'rec') {
                                        cfrgb = '';
                                        ity = 'pin';
                                        scal = 0.1;
                                    }
                                    const rpointStyle = new ol.style.Style({
                                        image: new ol.style.Icon({
                                            anchor: [0.5, 0.5],
                                            anchorXUnits: 'fraction',
                                            anchorYUnits: 'fraction',
                                            scale: scal,
                                            src: 'assets/images/webgis/' + cfrgb + ity + '.png'
                                        })
                                    });
                                    feature.setStyle(rpointStyle);
                                }
                            });
                        }
                    });
                    $mdSidenav('right').close();
                    // $scope.closeDetail = function () {
                    //     $scope.visibleData = $scope.visibleData ? false : true;
                    // }

                }
            }
            if (feature !== undefined) {
                console.log(services.info_detail);
                const curzm = viewObj.getZoom();
                var zoomto = 10;
                if (curzm > zoomto) {
                    zoomto = curzm;
                }
                var ity = 'c';
                console.log(layername);
                const layertype = layername.split('_')[0];
                if (layertype == 'predHS') {
                    ity = 'arrowr';
                } else if (layertype == 'HS') {
                    ity = 'arrowc';
                } else if (layertype == 'Veg') {
                    ity = 'arrowt';
                } else if (layertype == 'rec') {
                    ity = 'pin-red';
                }
                services.hs_clicked = feature.id_;
                services.type_clicked = layername;
                const redpinStyle = new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 1],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        scale: 0.17,
                        src: 'assets/images/webgis/' + ity + '.png'
                    })
                });
                feature.setStyle(redpinStyle);
                viewObj.animate({
                    center: feature.getGeometry().getCoordinates(),
                    zoom: zoomto,
                    duration: 1000
                });
                $mdSidenav('right').open();
                // $scope.showDetail = function () {
                //     $scope.visibleData = $scope.visibleData ? false : true;
                // }
            }
        }
        services.getGeoJson = function () {
            var geom = [];
            pointsource.forEachFeature(function (feature) {
                geom.push(new ol.Feature(feature.getGeometry().clone()));
            });
            var writer = new ol.format.GeoJSON();
            const geoJsonStr = writer.writeFeatures(geom);
            const coord = geom[0].values_.geometry.flatCoordinates;
            return [geoJsonStr, coord];
        }
        services.interactionFinished = function () {
            mapObj.removeInteraction(draw);
            mapObj.getLayers().forEach(function (layer) {
                if (layer.get('name') != undefined && layer.get('name') === 'tempolygon') {
                    mapObj.removeLayer(layer);
                }
            });
        }
        return services;
    })
    .directive('ngMap', ['mapService_webgis', '$http', function (mapService_webgis, $http) {
        return {
            restrict: 'A',
            replace: true,
            link: function ($scope) {
                var view = new ol.View({
                    projection: 'EPSG:4326',
                    center: [119, -1.0],
                    zoom: 5.0,
                })
                var map = new ol.Map({
                    target: 'map',
                    controls: ol.control.defaults({
                        attribution: false
                    }),
                    layers: [
                        /*new ol.layer.Tile({
                            source: new ol.source.OSM()
                        }),*/
                        // new ol.layer.Tile({
                        //     zIndex: 5,
                        //     source: new ol.source.XYZ({
                        //         url: 'https://{1-4}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
                        //     })
                        // }),
                        new ol.layer.Tile({
                            // zIndex: 1,
                            source: new ol.source.XYZ({
                                url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                                maxZoom: 23,
                            }),
                        }),
                        new ol.layer.Tile({
                            opacity: 0.5,
                            zIndex: 15,
                            visible: true,
                            source: new ol.source.OSM({
                                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}.jpg',
                            })
                        })
                        // new ol.layer.Tile({
                        //     source: new ol.source.BingMaps({
                        //         name: 'basemap',
                        //         id: 99999,
                        //         key: 'ApxKj5A4BjgMqT3O0s8xDQ8-KBoe51FaaiX4er38T5gyKVcJRjJJgaKRZhor7o_F',
                        //         imagerySet: 'AerialWithLabelsOnDemand'
                        //     })
                        // })
                    ],
                    view: view
                });
                var source = new ol.source.Vector({});
                var vectorIDN = new ol.layer.Vector({
                    source: source,
                });

                //   style polygon
                const fillStyle = new ol.style.Fill({
                    color: [255, 0, 0, 0],
                });

                const strokeStyle = new ol.style.Stroke({
                    color: [255, 80, 60, 1.0],
                    width: 2,
                });
                //   add polygon
                const IndonesiaPolygon = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        url: "/services/indonesia.geojson",
                        format: new ol.format.GeoJSON(),
                    }),
                    visible: true,
                    title: "Indonesia",
                    style: new ol.style.Style({
                        fill: fillStyle,
                        stroke: strokeStyle,
                    }),
                });
                map.addLayer(IndonesiaPolygon);
                map.addLayer(vectorIDN);
                vectorIDN.setZIndex(30);
                map.on("click", function (e) {
                    var wclk = 0;
                    map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
                        const lyrnm = layer.get('name');
                        const lyrty = lyrnm.split('_')[0];
                        console.log(lyrnm);
                        if (lyrty == 'predHS' || lyrty == 'HS' || lyrty == 'Veg' || lyrty == 'rec') {
                            $http({
                                method: "GET",
                                url: "/user/webgis/getInfoDetail",
                                params: {
                                    fid: feature.id_,
                                    type: lyrty
                                }
                            }).then(function querySuccess(response) {
                                response.data.typeid = lyrty;
                                if (lyrty == 'predHS') {
                                    response.data.type = 'Prediksi Hotspot';
                                } else if (lyrty == 'HS') {
                                    response.data.type = 'Hotspot';
                                } else if (lyrty == 'Veg') {
                                    response.data.type = 'Devegetasi';
                                } else if (lyrty == 'rec') {
                                    response.data.type = 'Rekomendasi';
                                }
                                angular.copy(response.data, mapService_webgis.info_detail);
                                mapService_webgis.selectHS(feature, lyrnm);
                            }, function queryError(response) {
                                console.log('connection failed');
                            });
                            wclk = 1;
                        }
                    });
                    if (wclk == 0) {
                        mapService_webgis.selectHS(undefined, undefined);
                        mapService_webgis.hs_clicked = undefined;
                        mapService_webgis.type_clicked = undefined;
                    }
                });
                $('#map').data('map', map);
                mapService_webgis.mapInit(map, view);
            }
        };
    }]);