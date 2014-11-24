optApp.factory("bestRoutesData", ["$FirebaseObject", "$firebase", function ($FirebaseObject, $firebase) {
    var ref = new Firebase("<<YOUR FIREBASE DB URL GOES HERE>>");
    var sync = $firebase(ref);
    return {
        // Return a promise that will return an object that is syncronized with our firebase
        getBestRoutes: function () {            
            var x = sync.$asObject();
            return x.$loaded();
        },
        // Save changes, the parm here should be the obj returned by getBestRoutes()
        saveBestRoutes: function (bestRoutes) {
            bestRoutes.$save();
        }
    };
}]);