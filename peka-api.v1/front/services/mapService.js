angular.module("mapService", [])
.factory('mapService', function($mdSidenav) {
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
            src: 'img/image/pin-yellow.png'
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
        }
        else {
            pointsource = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(gjson)
            });
        }
        vector = new ol.layer.Vector({source: pointsource});
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
        vector.getSource().on('addfeature', function(event){
            var vctrs = vector.getSource().getFeatures();
            if(vctrs.length>1){
                console.log('remove point');
                vector.getSource().removeFeature(vctrs[0]);
            }
        });
    }
    services.removeHS = function (idn) {
        var layersToRemove = [];
        mapObj.getLayers().forEach(function (layer) {
            if (layer.get('name') != undefined) {
                const rdnm = 'rad_'+idn;
                if (layer.get('name') === idn || layer.get('name') === rdnm) {
                    layersToRemove.push(layer);
                }
            }
        });

        var len = layersToRemove.length;
        for(var i = 0; i < len; i++) {
            mapObj.removeLayer(layersToRemove[i]);
        }
    }
    services.drawHS = function (idn, gjson) {
        if (gjson.features == null) {
            console.log("No Hotspot Found!");
        }
        else {
            const idt = idn.split('_')[0];
            var ity = 'c';
            if (idt == 'predHS') {
                ity = 'r';
            }
            else if (idt == 'HS') {
                ity = 'c';
            }
            else if (idt == 'predVeg') {
                ity = 't';
            }
            else if (idt == 'rec') {
                ity = 'eq2';
            }
            var hssource = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(gjson)
            });
            hssource.forEachFeature(function(feature){
                const clvl = feature.getProperties()['c'];
                var cfrgb = '';
                var scal = 0.05;
                if (clvl!==undefined) {
                    cfrgb = String(parseInt(Math.round(parseFloat(clvl)/10)*10));
                }
                else {
                    scal = 0.05;
                }
                const rpointStyle = new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 0.5],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        scale: scal,
                        src: 'img/image/'+cfrgb+ity+'.png'
                    })
                });
                feature.setStyle(rpointStyle);
            });
            var hsvector = new ol.layer.Vector({source: hssource});
            hsvector.set('name', idn);
            mapObj.addLayer(hsvector);
            hsvector.setZIndex(30);
        }
    }
    services.clearMap = function() {
        var layersToRemove = [];
        mapObj.getLayers().forEach(function (layer) {
            if (layer.get('name') != undefined) {
                var lynm = layer.get('name');
                lynm = lynm.split('_')[0];
                if (lynm === 'predHS' || lynm === 'predVeg') {
                    layersToRemove.push(layer);
                }
            }
        });

        var len = layersToRemove.length;
        for(var i = 0; i < len; i++) {
            mapObj.removeLayer(layersToRemove[i]);
        }
    }
    services.selectHS = function (feature, layername) {
        if (services.hs_clicked !== undefined || feature === undefined) {
            if (services.type_clicked === undefined) {
                console.log('do nothing');
            }
            else {
                mapObj.getLayers().forEach(function(layer){
                    const lyrnm = layer.get('name');
                    if (lyrnm == services.type_clicked) {
                        var hssource = layer.getSource();
                        hssource.forEachFeature(function(feature){
                            if (feature.id_ == services.hs_clicked) {
                                var ity = 'c';
                                const layertype = services.type_clicked.split('_')[0];
                            }
                        });
                    }
                });
            }
        }
        if (feature !== undefined) {
            const curzm = viewObj.getZoom();
            var zoomto = 10;
            if (curzm > zoomto) {
                zoomto = curzm;
            }
            services.hs_clicked = feature.id_;
            const layertype = layername.split('_')[0];
            services.type_clicked = layername; 
            var popup = new Popup({insertFirst: false});
            mapObj.addOverlay(popup);
            const coord = feature.getGeometry().getCoordinates();
            var html = '';
            if (layertype == 'predHS') {
                html = `<div style='font-size:14px;margin-bottom: 5px;'><strong>`+services.info_detail.type+`</strong></div>
                            <span style='font-size:12px;'>Koordinat:&nbsp;<strong>`+services.info_detail.data.coord+`</strong></span><br>
                            <span style='font-size:12px;'>Waktu prediksi:&nbsp;<strong>`+services.info_detail.data.datestr+`&nbsp;-&nbsp;`+services.info_detail.data.datestp+`</strong></span><br>
                            <span style='font-size:12px;'>Probabilitas:&nbsp;<strong>`+services.info_detail.data.conf+`</strong></span>`;
            }
            else if (layertype == 'predVeg') {
                html = `<div style='font-size:14px;margin-bottom: 5px;'><strong>`+services.info_detail.type+`</strong></div>
                        <span style='font-size:12px;'>Koordinat:&nbsp;<strong>`+services.info_detail.data.coord+`</strong></span><br>
                        <span style='font-size:12px;'>Waktu prediksi:&nbsp;<strong>`+services.info_detail.data.datestr+`&nbsp;-&nbsp;`+services.info_detail.data.datestp+`</strong></span>`;
            }
            else if (layertype == 'rec') {
                html = `<div style='font-size:14px;margin-bottom: 5px;'><strong>`+services.info_detail.type+`</strong></div>
                        <span style='font-size:12px;'>Koordinat:&nbsp;<strong>`+services.info_detail.data.coord+`</strong></span><br>
                        <span style='font-size:12px;'>Waktu rekomendasi:&nbsp;<strong>`+services.info_detail.data.datestr+`</strong></span><br>
                        <span style='font-size:12px;'>Informasi:&nbsp;<strong>`+services.info_detail.data.info+`</strong></span><br>
                        <span style='font-size:12px;'>Penanganan:&nbsp;<strong>`+services.info_detail.data.act+`</strong></span>`;
            }
            popup.show(coord, html);
            //feature.setStyle(redpinStyle);
            viewObj.animate({
                center: feature.getGeometry().getCoordinates(),
                zoom: zoomto,
                duration: 1000
            });
        }
    }
    services.getGeoJson = function() {
        var geom = [];
        pointsource.forEachFeature( function(feature) { geom.push(new ol.Feature(feature.getGeometry().clone())); } );
        var writer = new ol.format.GeoJSON();
        const geoJsonStr = writer.writeFeatures(geom);
        const coord = geom[0].values_.geometry.flatCoordinates;
        return [geoJsonStr, coord];
    }
    return services;
})
.directive('ngMap', ['mapService', '$http', function (mapService, $http) {
    return {
        restrict: 'A',
        replace: true,
        link: function ($scope) {
            var view = new ol.View({
                projection: 'EPSG:4326',
                center: [119, -1.5],
                zoom: 5
            })
            var map = new ol.Map({
                target: 'map',
                controls : ol.control.defaults({
                    attribution : false
                }),
                layers: [
                    /*new ol.layer.Tile({
                        source: new ol.source.OSM()
                    }),*/
                    new ol.layer.Tile({
                        zIndex: 5,
                        source: new ol.source.XYZ({
                            url: 'https://{1-4}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
                        })
                    }),
                    new ol.layer.Tile({
                        opacity: 0.5,
                        zIndex: 15,
                        visible: true,
                        source: new ol.source.OSM({
                            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}.jpg',
                        })
                    })
                ],
                view: view
            });
            map.on("click", function(e) {
                var wclk = 0;
                map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
                    const lyrnm = layer.get('name');
                    const lyrty = lyrnm.split('_')[0];
                    if (lyrty == 'predHS' || lyrty == 'predVeg' || lyrty == 'rec') {
                        $http({
                            method : "GET",
                            url : "/getInfoDetail",
                            params : {fid: feature.id_, type: lyrty}
                        }).then(function querySuccess(response) {
                            var temp = {}
                            response.data.typeid = lyrty;
                            if (lyrty == 'predHS') {
                                temp.type = 'Potensi Hotspot';
                                temp.data = response.data;
                            }
                            else if (lyrty == 'predVeg') {
                                temp.type = 'Potensi Devegetasi';
                                temp.data = response.data;
                            }
                            else if (lyrty == 'rec') {
                                temp.type = 'Rekomendasi Penanganan';
                                temp.data = response.data;
                            }
                            angular.copy(temp, mapService.info_detail);
                            mapService.selectHS(feature, lyrnm);
                        }, function queryError(response) {
                            console.log('connection failed');
                        });
                        wclk = 1;
                    }
                    
                });
                if (wclk == 0) {
                    mapService.selectHS(undefined, undefined);
                    mapService.hs_clicked = undefined;
                    mapService.type_clicked = undefined;
                }
            });
            $('#map').data('map', map);
            mapService.mapInit(map, view);
        }
    };
}]);
