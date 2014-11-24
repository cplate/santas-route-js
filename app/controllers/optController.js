'use strict';

// ideally this would be factored out a bit better to keep so much logic out of controller
optApp.controller('optController', ['$scope', '$location', 'router', 'locationData', 'bestRoutesData', 'algorithmSettingsData', 'mapApi', 
    function optController($scope, $location, router, locationData, bestRoutesData, algorithmSettingsData, mapApi) {
        $scope.mapper = mapApi; // need ref for directive
        $scope.locationData = locationData; // need ref for binding
        $scope.settingsGroupName = null;
        $scope.algSettings = algorithmSettingsData.loadDefaultSettings();
        $scope.algMessage = null;                        
        $scope.currentRun = {
            iteration: null,
            solution: null,
            bestIteration: null,
            totalIterations: null,
            reset: function () {
                this.iteration = null,
                this.solution = null,
                this.bestIteration = null,
                this.totalIterations = null
            }
        };
        $scope.startRouting = function () {
            $scope.currentRun.reset();
            $scope.algMessage = algorithmSettingsData.checkSettings($scope.algSettings);
            if ($scope.algMessage)
                return;

            $scope.isRouting = true;
            var optRequest = {
                locationData: {
                    locations: $scope.selectedLocations,
                    distances: $scope.selectedLocations === locationData.usLocations 
                        ? locationData.getUsLocDistMatrix() : locationData.getWorldLocDistMatrix()
                },                      
                parms: algorithmSettingsData.convertPercentages($scope.algSettings),
            };
            var onSolutionImproved = function (iter, sol) {
                $scope.currentRun.bestIteration = iter;
                $scope.currentRun.solution = sol;
                $scope.mapRoute($scope.currentRun.solution.sequence);
                $scope.$apply(); // callback not via angular flow, so need to apply chgs
            };            
            var onProgressUpdated = function (iter, tot) {
                $scope.currentRun.iteration = iter;
                $scope.currentRun.totalIterations = tot;
                if (iter == tot) {
                    $scope.isRouting = false;
                    $scope.checkForNewBestRoute();
                }
                $scope.$apply(); // callback not via angular flow, so need to apply chgs
            };
            router.route(optRequest, onSolutionImproved, onProgressUpdated);            
        };
        $scope.stopRouting = function () {
            router.cancel();
            $scope.isRouting = false;   
            $scope.checkForNewBestRoute();         
        };
        $scope.mapRoute = function (sequence) {
            mapApi.removeShapes('route');
            if (sequence) {
                var routeLocs = [locationData.startLocation];
                angular.forEach(sequence, function (v, k) {
                    routeLocs.push($scope.selectedLocations[v]);
                });
                var overlay = mapApi.createOverlay(routeLocs, 5, '#9900ff', 0.4);
                mapApi.addShapes('route', [overlay]);
            }
        }
        $scope.mapLocations = function (locationList) {
            mapApi.removeShapes('points');
            var mapPoints = [mapApi.createPoint(locationData.startLocation.lat, locationData.startLocation.lon, locationData.startLocation.name, locationData.startLocation.name)];
            for (var i = 0; i < locationList.length; i++) {
                var loc = locationList[i];
                mapPoints.push(mapApi.createPoint(loc.lat, loc.lon, loc.name, loc.name, false, null));
            }
            mapApi.addShapes('points', mapPoints);
            if ($scope.selectedLocations === locationData.usLocations) {
                mapApi.setCenterAndZoom(39.07, -95.62, 4);
            } else {
                mapApi.setCenterAndZoom(15, 0, 2);
            }
        };
        $scope.selectedLocationsChanged = function () {
            $scope.currentRun.reset();
            $scope.mapLocations($scope.selectedLocations);
            $scope.mapRoute(null);
            $scope.setBestRouteForSelectedLocations();
        };
        $scope.setBestRouteForSelectedLocations = function () {
            if (!$scope.bestRoutes) {
                $scope.bestRoutes = {
                    usLocations: { solution: {}, settings: {} },
                    worldLocations: { solution: {}, settings: {} }
                };
            }
            if ($scope.selectedLocations === locationData.usLocations) {
                $scope.bestRoute =  $scope.bestRoutes.usLocations;
            }
            else {
                $scope.bestRoute = $scope.bestRoutes.worldLocations;
            }
        };
        $scope.checkForNewBestRoute = function () {
            if (!$scope.bestRoute.solution.score || ($scope.bestRoute.solution.score > $scope.currentRun.solution.score)) {
                // Found better route, update attributes and save to data store
                $scope.bestRoute.solution.score = $scope.currentRun.solution.score;
                $scope.bestRoute.solution.sequence = $scope.currentRun.solution.sequence;
                algorithmSettingsData.copySettings($scope.algSettings,$scope.bestRoute.settings);
                bestRoutesData.saveBestRoutes($scope.bestRoutes);
            }
        };
        $scope.loadBestRoute = function () {
            if ($scope.bestRoute && $scope.bestRoute.solution) {
                $scope.currentRun.solution = {
                    sequence: $scope.bestRoute.solution.sequence,
                    score: $scope.bestRoute.solution.score
                };
                $scope.currentRun.iteration = $scope.bestRoute.settings.maxIterations;
                $scope.currentRun.totalIterations = $scope.bestRoute.settings.maxIterations;
                $scope.currentRun.bestIteration = $scope.bestRoute.settings.maxIterations;
                algorithmSettingsData.copySettings($scope.bestRoute.settings,$scope.algSettings);
                $scope.mapRoute($scope.currentRun.solution.sequence);
            }
        };
        $scope.loadSettings = function () {
            // Using 3-way binding for this, so parms are a bit messy so we hide that
            // keep that fire-base specific stuff out of our controller
            algorithmSettingsData.loadSettingsForGroup($scope.settingsGroupName,$scope,"algSettings")
                .then(function(settings) {
                    // Load defaults if the settings dont exist yet
                    algorithmSettingsData.checkSettings($scope.algSettings, true);
                });
        };

        $scope.$watch('selectedLocations', function () { $scope.selectedLocationsChanged(); }, true);

        // Start out with US
        $scope.selectedLocations = locationData.usLocations;
        
        // Load best routes. This isnt populated right away, so when its loaded do a bit more setup
        bestRoutesData.getBestRoutes().then(function (routes) {
            $scope.bestRoutes = routes;            
            $scope.setBestRouteForSelectedLocations();
        });
    }
]);
