optApp.factory('router', function () {
    var worker = null;
    return {
        route: function (request, onSolutionImproved, onProgressUpdated) {
            // NOTE: Could do some stuff here to run the algorithm here directly instead
            // if web workers aren't supported by the browser.....

            // Set up our worker
            worker = new Worker("app/services/routing/routingWorker.js");
            // Respond to messages from the worker, forwarding on to our callbacks
            worker.onmessage = function (oEvent) {
                if (oEvent.data.type == 'progress') {
                    onProgressUpdated(oEvent.data.completed, oEvent.data.total);
                } else if (oEvent.data.type == 'improvement') {
                    onSolutionImproved(oEvent.data.iteration, oEvent.data.solution);
                };                
            };
            // Give worker the request to start it up.  Chrome seemed unhappy
            // when serializing an object to the worker that wasn't purely data
            worker.postMessage(request);
        },
        cancel: function() {
            worker.terminate();
        }
    };
});