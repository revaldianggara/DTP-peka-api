(function () {
    'use strict';

    angular.module('app')
        .config(['$routeProvider', function ($routeProvider) {
            var routes, setRoutes;

            // 'layer-control/dashboard', 
            routes = [
                'layer-control/datainput/potensi-hotspot', 'layer-control/datainput/zona-potensi', 'layer-control/modelml/potensi-hotspot', 'layer-control/modelml/zona-potensi', 'layer-control/webgis', 'layer-control/bantuan'
            ]

            setRoutes = function (route) {
                var config, url;
                url = '/' + route;
                config = {
                    templateUrl: route + '.html'
                };
                $routeProvider.when(url, config);
                return $routeProvider;
            };

            routes.forEach(function (route) {
                return setRoutes(route);
            });

            $routeProvider
                .when('/', {
                    redirectTo: 'layer-control/datainput/potensi-hotspot'
                })
                .when('/layer-control', {
                    templateUrl: 'layer-control/datainput/potensi-hotspot.html'
                })
                .when('/404', {
                    templateUrl: 'layer-control/404.html'
                })
                .otherwise({
                    redirectTo: '/404'
                });

        }]);

})();