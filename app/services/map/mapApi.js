optApp.factory('mapApi', function () {
    var map = {};

    map.init = function (hostEl, centerLat, centerLng, hideViewControl, hideZoomControl) {
        if (!centerLat || centerLat === 0 || !centerLng || centerLng === 0) {
            centerLat = 39.78; centerLng = -104.59; 
        }

        map.mqMap = new MQA.TileMap({
            elt: hostEl,
            zoom: 7,
            latLng: new MQA.LatLng(centerLat, centerLng)
        });

        if (!hideViewControl) {
            map.addViewControl();
        }

        if (!hideZoomControl) {
            map.addZoomControl();
        }

        map.mqMap.copyright.setClass("invisible");
        MQA.withModule('mousewheel', function () {
            map.mqMap.enableMouseWheelZoom();
        });
        MQA.withModule('shapes', function () { }); // load this so its ready later...
    };

    map.addViewControl = function () {
        for (var i = 0; i < map.mqMap.controls.length; i++) {
            if (map.mqMap.controls[i].id === 'viewoptions') {
                return;
            }
        }
        MQA.withModule('viewoptions', function () {
            map.mqMap.addControl(new MQA.ViewOptions(), new MQA.MapCornerPlacement(MQA.CORNER_TOPRIGHT, new MQA.Size(0, 0)));
        });
    };
    map.removeViewControl = function () {
        for (var i = 0; i < map.mqMap.controls.length; i++) {
            if (map.mqMap.controls[i].id === 'viewoptions') {
                map.mqMap.removeControl(map.mqMap.controls[i]);
                return;
            }
        }
    };
    map.addZoomControl = function () {
        for (var i = 0; i < map.mqMap.controls.length; i++) {
            if (map.mqMap.controls[i].id === 'largezoom') {
                return;
            }
        }
        MQA.withModule('largezoom', 'mousewheel', function () {
            map.mqMap.addControl(new MQA.LargeZoom(), new MQA.MapCornerPlacement(MQA.CORNER_TOPLEFT, new MQA.Size(0, 0)));
        });
    };
    map.removeZoomControl = function () {
        for (var i = 0; i < map.mqMap.controls.length; i++) {
            if (map.mqMap.controls[i].id === 'largezoom') {
                map.mqMap.removeControl(map.mqMap.controls[i]);
                return;
            }
        }
    };
    map.addTrafficControl = function () {
        for (var i = 0; i < map.mqMap.controls.length; i++) {
            if (map.mqMap.controls[i].id === 'traffictoggle') {
                return;
            }
        }
        MQA.withModule('traffictoggle', function () {
            var traffic = new MQA.TrafficToggle();
            map.mqMap.addControl(traffic);
        });
    };
    map.removeTrafficControl = function () {
        for (var i = 0; i < map.mqMap.controls.length; i++) {
            if (map.mqMap.controls[i].id === 'traffictoggle') {
                map.mqMap.removeControl(map.mqMap.controls[i]);
                return;
            }
        }
    };
    map.setCenterAndZoom = function (lat, lng, zoom) {
        this.mqMap.setCenter(new MQA.LatLng(lat, lng), zoom);
    };
    map.bestFit = function () {
        map.mqMap.bestFit(false, 1, 18);
    };
    map.setSize = function (width, height) {
        map.mqMap.setSize(new MQA.Size(width, height));
    };
    map.createPoint = function (lat, lon, title, content, shouldDeclutter, onClick) {
        var poi = new MQA.Poi({ lat: lat, lng: lon });
        poi.infoTitleHTML = title;
        poi.infoContentHTML = content;
        if (onClick) { MQA.EventManager.addListener(poi, "click", onClick); }
        poi.setDeclutterMode(shouldDeclutter);
        return poi;
    };
    map.createOverlay = function (latLngs, borderWidth, borderColor, colorAlpha) {
        var singleCoordArray = [];
        for (var idx = 0; idx < latLngs.length; idx++) {
            singleCoordArray.push(latLngs[idx].lat);
            singleCoordArray.push(latLngs[idx].lon);
        }
        var overlay = new MQA.LineOverlay();
        overlay.setShapePoints(singleCoordArray);
        overlay.borderWidth = borderWidth;
        overlay.color = borderColor;
        overlay.colorAlpha = colorAlpha;
        return overlay;
    };
    map.addShapes = function (shapeGroupName, shapes) {
        var shapeColl = new MQA.ShapeCollection();
        shapeColl.setName(shapeGroupName);
        for (var idx = 0; idx < shapes.length; idx++) {
            var s = shapes[idx];
            shapeColl.add(s);
        }
        map.mqMap.addShapeCollection(shapeColl);
    };
    map.addShape = function (shape) {
        map.mqMap.addShape(shape);
    };
    map.removeShapes = function (shapeGroupName) {
        map.mqMap.removeShapeCollection(shapeGroupName);
    };
    map.removeShape = function (shape) {
        map.mqMap.removeShape(shape);
    }
    return map;
});
