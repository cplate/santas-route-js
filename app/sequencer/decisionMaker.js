var sequencerLib = sequencerLib || {};

sequencerLib.decisionMaker = {
    decideBool: function(truePercentage) {    
        if (truePercentage <= 0.00001) return false;
        return Math.random() <= truePercentage;            
    },
    decideIntBetween: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
};