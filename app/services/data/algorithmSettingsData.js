optApp.factory("algorithmSettingsData", ["$FirebaseObject", "$firebase", function ($FirebaseObject, $firebase) {
	var ref = new Firebase("<<YOUR FIREBASE DB URL GOES HERE>>");
	var defaultSettings = {
        maxIterations: 1000,
        populationSize: 1000,
        survivalPercentage: 20,
        mutationPercentage: 20,
        newBloodPercentage: 10,                
    };
    
	return {
		loadDefaultSettings: function() {
			return this.copySettings(defaultSettings,{});
		},
		convertPercentages: function(settings) {
			var converted = this.copySettings(settings, {});
			converted.survivalPercentage /= 100;
			converted.mutationPercentage /= 100;
			converted.newBloodPercentage /= 100;
			return converted;
		},
		checkSettings: function(settings,replaceWithDefault) {
			var outputMsg = null;
			if (!settings.maxIterations || 
				settings.maxIterations <= 0 || settings.maxIterations > 10000) {
				if (replaceWithDefault) { settings.maxIterations = defaultSettings.maxIterations; }
				else outputMsg = "Max Iterations must be between 1 and 1000";					
			}
			if (!settings.populationSize || 
				settings.populationSize <= 0 || settings.populationSize > 5000) {
				if (replaceWithDefault) { settings.populationSize = defaultSettings.populationSize; }
				else outputMsg = "Population Size must be between 1 and 5000";			 
			}
			if (!settings.survivalPercentage || 
				settings.survivalPercentage < 1 || settings.survivalPercentage > 99) {
				if (replaceWithDefault) { settings.survivalPercentage = defaultSettings.survivalPercentage; }
				else outputMsg = "Survival Percentage must be between 1 and 99";			 
			}
			if (settings.mutationPercentage === undefined || 
				settings.mutationPercentage < 0 || settings.mutationPercentage > 100) {
				if (replaceWithDefault) { settings.mutationPercentage = defaultSettings.mutationPercentage; }
				else outputMsg = "Mutation Percentage must be between 0 and 100";			 
			}
			if (settings.newBloodPercentage === undefined || 
				settings.newBloodPercentage < 0 || settings.newBloodPercentage > 50) {
				if (replaceWithDefault) { settings.newBloodPercentage = defaultSettings.newBloodPercentage; }
				else outputMsg = "New Blood Percentage must be between 0 and 50";			 
			}
			return outputMsg;
		},
		copySettings: function(from, to) {			
            to.maxIterations = from.maxIterations;
            to.populationSize = from.populationSize;
            to.survivalPercentage = from.survivalPercentage;
            to.mutationPercentage = from.mutationPercentage;
            to.newBloodPercentage = from.newBloodPercentage;
            return to;
		},
		// For this one, we're going to try the three-way-binding
		// Was having problems with this when targetObj was a sub-object
		loadSettingsForGroup: function (groupName, targetObj, targetElementName) {
			var sync = $firebase(ref.child(groupName));
			var obj = sync.$asObject();
			return obj.$bindTo(targetObj, targetElementName);
		}
	};
}]);

