// Worker accepts an optimization request and posts messages
// back reporting progress and solution improvements
onmessage = function (oEvent) {

    // import our sequencing library scripts
    importScripts(
        '../../sequencer/sequencer.js',
        '../../sequencer/geneticAlgorithm.js',
        '../../sequencer/decisionMaker.js');

    var sequencer = new sequencerLib.Sequencer();
    
    // Hook up some callbacks so we can post messages
    sequencer.onSolutionImproved = function (iter, sol) {
        postMessage({
            type: "improvement",
            solution: sol,
            iteration: iter
        });
    };
    sequencer.onProgressUpdated = function (iter, tot) {
        postMessage({
            type: "progress",
            completed: iter,
            total: tot
        });
    };
    
    // Kick off sequencing using the request passed in to us
    sequencer.sequence(oEvent.data);
};