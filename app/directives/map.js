optApp.directive('map', ['$window', function ($window) {
    return {
        restrict: 'A',
        replace: false,
        scope: {
            centerLat: "@",
            centerLng: "@",
            hideViewControl: "@",
            hideZoomControl: "@",
            map: "=mapapi",
            maxWidth: "@",
            screenWidthPercentage: "@",
            widthHeightRatio: "@",
            minWidth: "@",
        },
        link: function (scope, element, attrs) {

            var hostEl = element[0];

            scope.map.init(hostEl, scope.centerLat, scope.centerLng, 
                scope.hideViewControl, scope.hideZoomControl);

            // Set up some stuff to detect resize and have our map redraw
            var window = angular.element($window);

            window.bind("resize", function (e) {
                checkResizeNeeded();
            })

            function checkResizeNeeded() {
                var curWidth = window[0].innerWidth;
                var mapWidth = curWidth * (scope.screenWidthPercentage || 0.9);
                if ((!scope.maxWidth || (mapWidth < scope.maxWidth)) && 
                    (!scope.minWidth || (mapWidth > scope.minWidth))) {
                        setMapSize(mapWidth, mapWidth * (scope.widthHeightRatio || 0.6));
                        scope.map.setSize(hostEl.style.width, hostEl.style.height);
                }
            }

            function setMapSize(w,h) {
                hostEl.style.width = w + "px";
                hostEl.style.height = h + "px";
            }

            checkResizeNeeded();
        }
    };
}]);