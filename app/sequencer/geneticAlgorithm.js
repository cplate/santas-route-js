var sequencerLib = sequencerLib || {};

sequencerLib.GeneticAlgorithm = function () {

    var alg = {};
    
    // Define customizable methods per problem instance
    alg.generateCandidates = function(numToGenerate) {}; // func to generate candidates, return array
    alg.scoreCandidate = function(candidate) {}; // func attaches a score attribute to candidate, returns nothing
    alg.naturalSelector = function (candidates, numToKeep) { }; // func reduces candidate list by some means and returns reduced list
    alg.crossoverCandidates = function (candidate1, candidate2) { }; // func generates new candidate from these 2 and returns it
    alg.mutateCandidate = function (candidate) { }; // func mutates candidate and returns it

    alg.getBestCandidate = function(initialCandidate, parms, onSolutionImproved, onProgressUpdated) {
        // Build initial pool
        var candidates = alg.generateCandidates(parms.populationSize - 1);
        candidates.push(initialCandidate ? initialCandidate : alg.generateCandidates(1)[0]);
        // Find best initial solution
        candidates = alg.evaluateCandidates(candidates);
        var bestSolution = candidates[0];
        onSolutionImproved(0, bestSolution);

        // Iterate to attempt to improve solution
        for (var i = 0; i < parms.maxIterations; i++)
        {
            if ((i+1) % 5 == 0)
                onProgressUpdated(i+1, parms.maxIterations);

            // Do natural selection to trim down the population to the "best"
            candidates = alg.naturalSelector(
                candidates, Math.floor(parms.survivalPercentage * candidates.length));            
            // If desired, add some new candidates to introduce some diversity into the population
            if (parms.newBloodPercentage > 0.001)
            {
                var newBlood = alg.generateCandidates(
                    Math.floor(parms.newBloodPercentage * parms.populationSize));
                for (var nb = 0; nb < newBlood.length; nb++) {
                    candidates.push(newBlood[nb]);
                }
            }
            // Do crossover to generate more candidates based on the current pool
            var crossoverResult = alg.generateCandidatesViaCrossover(
                candidates, parms.populationSize - candidates.length);
            for (var cr = 0; cr < crossoverResult.length; cr++) {
                //console.log("Crossover " + crossoverResult[cr].sequence);
                candidates.push(crossoverResult[cr]);
            }
            // Do mutation to tweak some candidates to inject some new ones that 
            // might not be obtained via crossover
            alg.mutateCandidates(candidates, parms.mutationPercentage);

            // Evaluate the population as it stands
            candidates = alg.evaluateCandidates(candidates);

            // See how we've done
            if (candidates[0].score < bestSolution.score)
            {
                bestSolution = candidates[0];
                onSolutionImproved(i+1, bestSolution);
            }
        }

        onProgressUpdated(parms.maxIterations, parms.maxIterations);

        return bestSolution;
    };

    alg.generateCandidatesViaCrossover = function(candidatePool, numToGenerate) {        
        var children = [];
        var numPotentialParents = candidatePool.length;
        for (var i = 0; i < numToGenerate; i++)
        {
            // Find two parents to crossover, ensuring they are different
            var parent1Idx = sequencerLib.decisionMaker.decideIntBetween(0, numPotentialParents - 1);
            var parent2Idx = parent1Idx;
            while (parent2Idx == parent1Idx)
            {
                parent2Idx = sequencerLib.decisionMaker.decideIntBetween(0, numPotentialParents - 1);
            }
            children.push(alg.crossoverCandidates(candidatePool[parent1Idx], candidatePool[parent2Idx]));
        }
        return children;
    };

    alg.mutateCandidates = function (candidatePool, mutationPercentage) {
        var first = candidatePool[0];
        var rest = candidatePool.slice(1);
        // never mutate first so we dont lose best solution
        var results = [first];
        for (var r = 0; r < rest.length; r++) {
            if (sequencerLib.decisionMaker.decideBool(mutationPercentage))
            {
                results.push(alg.mutateCandidate(rest[r]));
            }
            else
            {
                results.push(rest[r]);
            }
        }
        return results;
    };

    alg.evaluateCandidates = function(candidatePool) {
        // Generate score for each
        for (var c = 0; c < candidatePool.length; c++) {
            alg.scoreCandidate(candidatePool[c]);
        }
        
        // Determine best solution via sort of score
        return candidatePool.sort(function (a, b) { return a.score - b.score; });
    };

    return alg;
};
