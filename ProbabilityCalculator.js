class ProbabilityCalculator {
    static calcWinProbability(a, b) {
        let wins = 0,
            total = a.size() * b.size();
        for (const fa of a.faces) {
            for (const fb of b.faces) {
                if (fa > fb) wins++;
            }
        }
        return total === 0 ? 0 : wins / total;
    }
}

module.exports = ProbabilityCalculator;