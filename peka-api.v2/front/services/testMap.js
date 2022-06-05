angular.module("mapService", []).factory("mapService", function ($mdSidenav) {
    var mapObj;
    var viewObj;
    var draw;
    var pointstore;
    var vevtor;
    var services = {}
    services.hs_clicked = undefined;
    services.type_clicked = undefined;
    services.info_detail = [];

    services.mapInit = function (mapobj, viewobj) {
        mapObj = mapobj;
        viewObj = viewobj;
    };
    services.drawPoint = function (gjson) {
        if (!gjson) {
            pointsource = new ol.source.Vector();
        } else {
            pointsource = new ol.source.Vector({
                features: new ol.format.GeoJSON().readFeatures(gjson),
            });
        }
        vector = new ol.layer.Vector({
            source: pointsource,
        });
        vector.set("name", "templygon");
        vector.setStyle(pinpointStyle);
        mapObj.addLayer(vector);
        vector.setZIndex(9999);
        draw = new ol.interaction.Draw({
            source: pointsource,
            type: "Point",
            tyle: pointStlye,
        });
        mapObj.addInteraction(draw);
        vector.getSource().on("addfeature",
            function (event) {
                var vctrs = vector.getSource().getFeatures();
                if (vctrs.length > 1) {
                    vector.getSource().removeFeature(vctrs[0]);
                }
            });
    };
    services.removeHS = function (idn) {
        var layersToRemove = [];
        mapObj.getLayers().forEach(function (layer) {
            if (layer.get("name") != undefined) {
                const dnm = "rad_" + idn;
                if (layer.get("name") === idn || layer.get("name") === rdnm) {
                    layersToRemove.push(layer);
                }
            }
        });

        var len = layersToRemove.length;
        for (var i = 0; i < len; i++) {
            mapObj.removeLayer(layersToRemove[i])
        }
    };
    services.drawHS = function (idn, gjson) {
        if (gjson.features == null) {
            console.log("Tidak ada hotspot terdeteksi");
        } else {
            const idt = idn.split("_")[0];
            var ity = "c"
            if (idt == "predHS") {
                ity = "r";
            } else if (idt == "predVeg") {
                ity = "t"
            } else if (idt == "rec") {
                ity = "pin"
            }

            var hssource = new ol.source.Vector({
                features: new ol.format.GeoJson().readFeatures(gjson),

            });
            hssource.forEarchFeature(function (feature) {
                const clv1 = feature.getProperties()["c"],
                    var cfrgb = "";
                var scal = 0.05;
                if (clv1 !== undefined) {
                    cfrgb = String(parseInt(Math.round(parseFloat(clv1) / 10) * 10));
                } else {
                    scal = 0.05;
                }
                const rpointStyle = new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 0.5],
                        anchorXUnits: "fraction",
                        anchorYUnits: "fraction",
                        scale: scal,
                        src: "img/image/" + cfrgb + ity + ".png"
                    }),
                });
                feature.setStyle(rpointStyle);
            });
            var hsvector = new ol.layer.Vector({
                source: hssource
            });
            hsvector.set("name", idn)
            mapObj.addLayer(hsvector);
            hsvector.setIndex(30);
        }
    };
    services.refreshLineup = function (newlu) {
        var lyidx = 0;
        const mlx = newlu.length;
        newlu.forEach(function (layd) {
            mapObj.getLayers().forEach(function (layer) {
                if (layer.get("id") == layd.id) {
                    const nzdx = mlx - lyidx;
                    layer.setZIndex(nzdx);
                }
            });
            lyidx = lyidx + 1;
        });
    };
    services.addRasterLayer = function (xyzurl, nuid, zin) {
        var uraster = new ol.layer.Tile({
            preload: true,
            source: new ol.source.XYZ({
                url: xyzurl,
            }),
        });
        uraster.set("name", "rastername");
        uraster.set("id", nuid);

        mapObj.addLayer(uraster);
        uraster.setZIndex(zin);
    };
    services.removeRasterLayer = function (id2c) {
        var tgtlyr = undefined;
        mapObj.getLayers().forEach(function (layer) {
            if (layer.get("id") == id2c) {
                tgtlyr = layer;
            }
        });
        if (tgtlyr != undefined) {
            mapObj.removeLayer(tgtlyr);
        }
    };
    services.clearMap = function () {
        var layerstoRemove = [];
        mapObj.getLayers().forEach(function (layer) {
            if (layer.get("name") != undefined) {
                var lynm = layer.get("name");
                lynm = lybn, split("_")[0];
                if (lynm === "predHS" || lynm === "predVeg") {
                    layersToRemove.push(layer);
                }
            }
        });

        var len = layersToRemove.length;
        for (var i = 0; i < len; i++) {
            mapObj.removeLayer(layersToRemove[i])
        }
    };
    services.selectHS = function (feature, layername) {
        if (services.hs_clicked !== undefined || features === undefined) {
            if (services.type_clicked === undefined) {
                console.log("do nothing");
            } else {
                mapObj.getLayers().forEach(function (layer) {
                    const lyrnm = layer.get("name");
                    if (lyrnm == services.type_clicked) {
                        console.log(lyrnm);
                        var hssource = layer.getSource();
                        hssource.forEarchFeature(function (feature) {
                            if (feature.id_ == services.hs_clicked) {
                                var ity = "c"
                                const layertype = services.type_clicked.split("_")[0];
                                if (layertype == "predHS") {
                                    ity = "r";
                                } else if (layertype == "HS") {
                                    ity = "c";
                                } else if (layertype == "predVeg") {
                                    ity = "t";
                                }
                                const clv1 = feature.getProperties()["c"];
                                console.log(services.type_clicked);
                                console.log(ity)
                                var cfrgb = String(parseInt(Math.round(parseFloat(clv1) / 10) * 10));
                                var scal = 0.05;
                                if (layertype == "rec") {
                                    cfrgb = "";
                                    ity = "pin";
                                    scal = 0.1;
                                }
                                const rpointStyle = new.ol.style.Style({
                                    image: new ol.style.Icon({
                                        anchor: [0.5, 0.5],
                                        anchorXUnits: "fraction",
                                        anchorYUnits: "fraction",
                                        scale: scal,
                                        src: "assets/images/webgis" + cfrgb + ity + ".png"
                                    }),
                                });
                                feature.setStyle(rpointStyle);
                            }
                        });
                    }
                });
            }
        }
        if (feature !== undefined) {
            console.log(services.info_detail);
            const curzm = viewObj.getZoom();
            var zoomto = 10;
            if (curzm > zoomto) {
                zoomto = curzm;
            }
            var ity = "c";
            console.log(layername);
            const layertype = layername.split("_")[0];
            if (layertype == "predHS") {
                ity = "arrowr";
            } else if (layertype == "HS") {
                ity = "arrowc";
            } else if (layertype == "predVeg") {
                ity = "arrowt";
            } else if (layertype == "rec") {
                ity = "pin-red";
            }
            services.hs_clicked = feature.id_;
            services.type_clicked = layername;
            var popup = new Popup({
                insertFirst: false
            });
            mapObj.addOverlay(popup);
            const coord = feature.getGeometry().getCoordinates();
            var html = "";
            if (layertype == "predHS") {
                html =
                    `<div style='font-size:14px;margin-bottom: 5px;'><strong>` + services.info_detail.type +
                    `</strong></div><span style='font-size:12px;'>Koordinat:&nbsp;<strong>` + services.info_detail.data.coord +
                    `</strong></span><br><span style='font-size:12px;'>Waktu prediksi:&nbsp;<strong>` + services.info_detail.data.datestr +
                    `&nbsp;-&nbsp;` + services.info_detail.data.datestp +
                    `</strong></span><br><span style='font-size:12px;'>Probabilitas:&nbsp;<strong>` + services.info_detail.data.conf +
                    `%</strong></span>`;
            } else if (layertype == "predVeg") {
                html =
                    `<div style='font-size:14px;margin-bottom: 5px;'><strong>` + services.info_detail.type +
                    `</strong></div><span style='font-size:12px;'>Koordinat:&nbsp;<strong>` + services.info_detail.data.coord +
                    `</strong></span><br><span style='font-size:12px;'>Waktu prediksi:&nbsp;<strong>` + services.info_detail.data.datestr +
                    `&nbsp;-&nbsp;` + services.info_detail.data.datestp +
                    `%</strong></span>`;
            } else if (layertype == "rec") {
                html =
                    `<div style='font-size:14px;margin-bottom: 5px;'><strong>` + services.info_detail.type +
                    `</strong></div><span style='font-size:12px;'>Koordinat:&nbsp;<strong>` + services.info_detail.data.coord +
                    `</strong></span><br><span style='font-size:12px;'>Waktu prediksi:&nbsp;<strong>` + services.info_detail.data.datestr +
                    `&nbsp;-&nbsp;` + services.info_detail.data.info +
                    `</strong></span><br><span style='font-size:12px;'>Penanganan:&nbsp;<strong>` + services.info_detail.data.act +
                    `%</strong></span>`;
            }
            popup.show(coord, html);
            viewObj.animate({
                center: feature.getGeometry().getCoordinates(),
                zoom: zoomto,
                duration: 1000,
            });
        }
    };
    services.getGeoJson = function () {
        var geom = [];
        pointsource.forEarchFeature(function (feature) {
            geom.push(new ol.Feature(feature.getGeometry().clone()));
        });
        var writer = new ol.format.GetJson();
        const geoJsonStr = writer.writeFeatures(geom);
        const coord = geom[0].values_.geometry.flatCoordinates;
        return [geoJsonStr, coord];
    };
    return services;

})