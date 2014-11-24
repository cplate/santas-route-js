optApp.factory('locationData', ['distanceCalculator', function (distanceCalculator) {
    var startLocation = { name: "North Pole", lat: 85, lon: 0 };
    var usLocations = [
        { name: "Montgomery AL", lat: 32.30, lon: -86.40 },
        { name: "Phoenix AZ", lat: 33.43, lon: -112.02 },
        { name: "Little Rock AR", lat: 34.92, lon: -92.15 },
        { name: "Sacramento CA", lat: 38.52, lon: -121.50 },
        { name: "Denver CO", lat: 39.75, lon: -104.87 },
        { name: "Hartford CT", lat: 41.73, lon: -72.65 },
        { name: "Dover DE", lat: 39.13, lon: -75.47 },
        { name: "Washington DC", lat: 38.95, lon: -77.46 },
        { name: "Tallahassee FL", lat: 30.38, lon: -84.37 },
        { name: "Atlanta GA", lat: 33.65, lon: -84.42 },
        { name: "Boise ID", lat: 43.57, lon: -116.22 },
        { name: "Springfield IL", lat: 39.85, lon: -89.67 },
        { name: "Indianapolis IN", lat: 39.73, lon: -86.27 },
        { name: "Des Moines IA", lat: 41.88, lon: -91.70 },
        { name: "Topeka KS", lat: 39.07, lon: -95.62 },
        { name: "Frankfort KY", lat: 38.20, lon: -84.86 },
        { name: "Baton Rouge LA", lat: 30.53, lon: -91.15 },
        { name: "Augusta ME", lat: 44.32, lon: -69.80 },
        { name: "Annapolis MD", lat: 38.97, lon: -76.50 },
        { name: "Boston, MA", lat: 42.37, lon: -71.03 },
        { name: "Lansing MI", lat: 42.77, lon: -84.60 },
        { name: "St Paul MN", lat: 44.93, lon: -93.05 },
        { name: "Jackson MS", lat: 32.32, lon: -90.08 },
        { name: "Jefferson City MO", lat: 38.60, lon: -92.17 },
        { name: "Helena MT", lat: 46.60, lon: -112.00 },
        { name: "Lincoln NE", lat: 40.85, lon: -96.75 },
        { name: "Carson City NV", lat: 39.16, lon: -119.75 },
        { name: "Concord NH", lat: 43.20, lon: -71.50 },
        { name: "Trenton NJ", lat: 40.28, lon: -74.82 },
        { name: "Santa Fe NM", lat: 35.62, lon: -106.08 },
        { name: "Albany NY", lat: 42.75, lon: -73.80 },
        { name: "Raleigh NC", lat: 35.87, lon: -78.78 },
        { name: "Bismarck ND", lat: 46.77, lon: -100.75 },
        { name: "Columbus OH", lat: 40.00, lon: -82.88 },
        { name: "Oklahoma City OK", lat: 35.40, lon: -97.60 },
        { name: "Salem OR", lat: 44.92, lon: -123.00 },
        { name: "Harrisburg PA", lat: 40.22, lon: -76.85 },
        { name: "Providence RI", lat: 41.73, lon: -71.43 },
        { name: "Columbia SC", lat: 33.95, lon: -81.12 },
        { name: "Pierre SD", lat: 44.38, lon: -100.28 },
        { name: "Nashville TN", lat: 36.12, lon: -86.68 },
        { name: "Austin TX", lat: 30.30, lon: -97.70 },
        { name: "Salt Lake City UT", lat: 40.78, lon: -111.97 },
        { name: "Montpelier VT", lat: 44.20, lon: -72.57 },
        { name: "Richmond VA", lat: 37.50, lon: -77.33 },
        { name: "Olympia WA", lat: 46.97, lon: -122.90 },
        { name: "Charleston, WV", lat: 38.37, lon: -81.60 },
        { name: "Madison WI", lat: 43.13, lon: -89.33 },
        { name: "Cheyenne WY", lat: 41.15, lon: -104.82 }
    ];
    var worldLocations = [
        { name: "Tokyo, Japan", lat: 35.6895, lon: 139.6917 },
        { name: "Jakarta, Indonesia", lat: -6.2000, lon: 106.8000 },
        { name: "Seoul, South Korea", lat: 37.5665, lon: 126.9780 },
        { name: "Delhi, India", lat: 28.6100, lon: 77.2300 },
        { name: "Shanghai, China", lat: 31.2000, lon: 121.5000 },
        { name: "Manila, Phillipines", lat: 11.3333, lon: 123.0167 },
        { name: "Karachi, Pakistan", lat: 24.8600, lon: 67.0100 },
        { name: "New York, USA", lat: 40.6700, lon: -73.9400 },
        { name: "Sao Paulo, Brazil", lat: -23.5500, lon: -46.6333 },
        { name: "Mexico City, Mexico", lat: 19.4328, lon: -99.1333 },
        { name: "Cairo, Egypt", lat: 30.0500, lon: 31.2333 },
        { name: "Moscow, Russia", lat: 55.7500, lon: 37.6167 },
        { name: "Dhaka, Bangladesh", lat: 23.7000, lon: 90.3750 },
        { name: "Buenos Aires, Argentina", lat: -34.6033, lon: -58.3817 },
        { name: "Istanbul, Turkey", lat: 41.0136, lon: 28.9550 },
        { name: "Lagos, Nigeria", lat: 6.4531, lon: 3.3958 },
        { name: "Paris, France", lat: 48.8567, lon: 2.3508 },
        { name: "Lima, Peru", lat: -12.0433, lon: -77.0283 },
        { name: "Kinshasa, Congo", lat: -4.3250, lon: 15.3222 },
        { name: "Bogota, Colombia", lat: 4.5981, lon: -74.0758 },
        { name: "London, United Kingdom", lat: 51.5072, lon: -0.1275 },
        { name: "Taipei, Taiwan", lat: 22.9500, lon: 120.2000 },
        { name: "Ho Chi Minh City, Vietnam", lat: 10.7500, lon: 106.6667 },
        { name: "Johannesburg, South Africa", lat: -26.2044, lon: 28.0456 },
        { name: "Tehran, Iran", lat: 35.6961, lon: 51.4231 },
        { name: "Essen, Germany", lat: 51.4508, lon: 7.0131 },
        { name: "Bangkok, Thailand", lat: 13.7500, lon: 100.4667 },
        { name: "Hong Kong, Hong Kong", lat: 22.2783, lon: 114.1589 },
        { name: "Baghdad, Iraq", lat: 33.3250, lon: 44.4220 },
        { name: "Toronto, Canada", lat: 43.7000, lon: -79.4000 },
        { name: "Kuala Lumpur, Malaysia", lat: 3.1357, lon: 101.6880 },
        { name: "Santiago, Chile", lat: -33.4500, lon: -70.6667 },
        { name: "Madrid, Spain", lat: 40.4000, lon: -3.6833 },
        { name: "Milan, Italy", lat: 45.4667, lon: 9.1833 },
        { name: "Luanda, Angola", lat: -8.8383, lon: 13.2344 },
        { name: "Singapore, Singapore", lat: 1.3000, lon: 103.8000 },
        { name: "Riyadh, Saudi Arabia", lat: 24.6333, lon: 46.7167 },
        { name: "Khartoum, Sudan", lat: 15.6333, lon: 32.5333 },
        { name: "Yangoon, Myanmar", lat: 16.8000, lon: 96.1500 },
        { name: "Abidjan, Cote d'Ivoire", lat: 5.3167, lon: -4.0333 },
        { name: "Accra, Ghana", lat: 5.5500, lon: -0.2000 },
        { name: "Sydney, Australia", lat: -33.8600, lon: 151.2111 },
        { name: "Athens, Greece", lat: 37.9667, lon: 23.7167 },
        { name: "Tel Aviv, Israel", lat: 32.0833, lon: 34.8000 },
        { name: "Lisbon, Portugal", lat: 38.7138, lon: -9.1394 },
        { name: "Katowice, Poland", lat: 50.2667, lon: 19.0167 },
        { name: "Tashkent, Uzbekistan", lat: 41.2667, lon: 69.2167 },
        { name: "Baku, Azerbaijan", lat: 40.3953, lon: 49.8822 },
        { name: "Budapest, Hungary", lat: 47.4719, lon: 19.0503 },
        { name: "Beirut, Lebanon", lat: 33.8869, lon: 35.5131 },
    ];
    var usLocDistMatrix = [];
    var worldLocDistMatrix = []
    var getMatrix = function(startLoc, locs) {
        var matrix = [];
        var locsWithStart = locs.slice(0);
        locsWithStart.unshift(startLoc);
        for (var oIdx = 0; oIdx < locsWithStart.length; oIdx++) {
            var distsFromOrigLoc = [];
            for (var dIdx = 0; dIdx < locsWithStart.length; dIdx++) {
                distsFromOrigLoc.push(distanceCalculator.distanceBetween(
                    locsWithStart[oIdx].lat, locsWithStart[oIdx].lon, 
                    locsWithStart[dIdx].lat, locsWithStart[dIdx].lon));
            }
            matrix.push(distsFromOrigLoc);
        }
        return matrix;
    };
    return {
        startLocation: startLocation,
        usLocations: usLocations,
        worldLocations: worldLocations,
        getUsLocDistMatrix: function () {
            if (usLocDistMatrix.length > 0) {
                return usLocDistMatrix;
            }
            usLocDistMatrix = getMatrix(startLocation, usLocations);
            return usLocDistMatrix;
        },
        getWorldLocDistMatrix: function () {
            if (worldLocDistMatrix.length > 0) {
                return worldLocDistMatrix;
            }
            worldLocDistMatrix = getMatrix(startLocation, worldLocations);
            return worldLocDistMatrix;
        }
    };
}]);