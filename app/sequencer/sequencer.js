var sequencerLib = sequencerLib || {};

sequencerLib.Sequencer = function() {

    var ga = new sequencerLib.GeneticAlgorithm();

    // Hook up our overrides of the ga operations

    // func to generate candidates
    // each candidate is just a sequence of location indicies
    ga.generateCandidates = function (numToGenerate) {
        var candidateList = [];
        for (var c = 0; c < numToGenerate; c++) {
            var candidate = {
                sequence: []
            };
            var availIndices = [];
            for (var l = 0; l < locationData.locations.length; l++) {
                availIndices.push(l);
            }
            for (var l = 0; l < locationData.locations.length; l++) {
                var idx = Math.floor(Math.random() * availIndices.length);
                candidate.sequence.push(availIndices[idx]);
                availIndices.splice(idx, 1);
            }
            candidateList.push(candidate);
        }
        return candidateList;
    };

    // func attaches a score attribute to candidate
    ga.scoreCandidate = function (candidate) {
        // Note that the distance matrix includes distances from the start location as well,
        // so we need to offset the route location sequence indicies by 1
        var dist = locationData.distances[0][candidate.sequence[0]+1];
        for (var idx = 0; idx < candidate.sequence.length - 1; idx++)
        {
            dist += locationData.distances[candidate.sequence[idx]+1][candidate.sequence[idx + 1]+1];
        }
        candidate.score = dist;
    };

    // func reduces candidate list by some means
    ga.naturalSelector = function (candidates, numToKeep) {
        // Just keep X distinct top scorers
        var survivors = [];
        var prevSurvivor = null;
        for (var i = 0; i < candidates.length; i++) {
            if (!prevSurvivor) {
                survivors.push(candidates[i]);
                prevSurvivor = candidates[i];
            }
            else {
                for (var seqIdx = 0; seqIdx < prevSurvivor.sequence.length; seqIdx++) {
                    // See if this candidate has same sequence as previous one
                    if (candidates[i].sequence[seqIdx] != prevSurvivor.sequence[seqIdx]) {
                        survivors.push(candidates[i]);
                        prevSurvivor = candidates[i];
                        break;
                    }
                }
            }
            if (survivors.length == numToKeep) {
                break;
            }
        }
        return survivors;
    };

    // func generates new candidate from these 2
    ga.crossoverCandidates = function (parent1, parent2) {
        // Build a new route by taking a subseqence of parent one and inserting
        // it in the same position in parent2
        var subseqStartIdx = sequencerLib.decisionMaker.decideIntBetween(
            0, parent1.sequence.length - 2);
        var subseqEndIdx = sequencerLib.decisionMaker.decideIntBetween(
            subseqStartIdx + 1, parent1.sequence.length - 1);
        var parent1SubSequence = parent1.sequence.slice(subseqStartIdx, subseqEndIdx + 1);

        // Start building the new sequence by walking down parent2 and adding locations
        // that arent in the targeted subsequence of parent1
        var newSequence = [];
        var parent2Idx = 0; 
        while (newSequence.length < subseqStartIdx)
        {
            var locIdx = parent2.sequence[parent2Idx];
            if (parent1SubSequence.indexOf(locIdx) == -1)
            {
                newSequence.push(locIdx);
            }
            parent2Idx++;
        }      
        // Add the subsequence
        for (var s = 0; s < parent1SubSequence.length; s++)
            newSequence.push(parent1SubSequence[s]);

        // Add the remaining locations in parent2
        while (parent2Idx < parent2.sequence.length)
        {
            var locIdx = parent2.sequence[parent2Idx];
            if (parent1SubSequence.indexOf(locIdx) == -1)
            {
                newSequence.push(locIdx);
            }
            parent2Idx++;
        }
        return {sequence: newSequence};
    };

    // func mutates candidate
    ga.mutateCandidate = function (candidate) {
        // Simply pick two locations and swap them
        var loc1Idx = sequencerLib.decisionMaker.decideIntBetween(0, candidate.sequence.length - 1);
        var loc2Idx = loc1Idx;
        while (loc2Idx == loc1Idx)
        {
            loc2Idx = sequencerLib.decisionMaker.decideIntBetween(0, candidate.sequence.length - 1);
        }

        var tmp = candidate.sequence[loc1Idx];
        candidate.sequence[loc1Idx] = candidate.sequence[loc2Idx];
        candidate.sequence[loc2Idx] = tmp;

        return candidate;
    };

    var locationData = null;
    
    return {
        // Overrideable callbacks for communicating updates        
        onSolutionImproved: function (iter, sol) {
            console.log("iter " + iter + " new score " + sol.score);
        },
        onProgressUpdated: function (iter, tot) {
            console.log("completed " + iter + " of " + tot + " iterations");
        },
        sequence: function (rqt) {
            locationData = rqt.locationData;            
            return ga.getBestCandidate(rqt.currentSeq, rqt.parms,
                this.onSolutionImproved, this.onProgressUpdated);
        }
    };
};
