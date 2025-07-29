const ProbabilityCalculator = require("./ProbabilityCalculator");

class TableRenderer {
    static render(diceList) {
        const n = diceList.length;
        const colWidth = 7;
        function cell(s) {
            s = s.toString();
            return s.padStart(colWidth, " ");
        }
        console.log(
            "\nProbabilities that Dice_i beats Dice_j (rows vs columns):\n"
        );
        let header = "Dice#".padStart(colWidth, " ") + "";
        for (let i = 1; i <= n; i++) {
            header += cell(i);
        }
        console.log(header);
        console.log("-".repeat(colWidth * (n + 1)));
        for (let i = 0; i < n; i++) {
            let row = cell(i + 1);
            for (let j = 0; j < n; j++) {
                if (i === j) row += cell("-");
                else {
                    const p = ProbabilityCalculator.calcWinProbability(
                        diceList[i],
                        diceList[j]
                    );
                    row += cell(p.toFixed(3));
                }
            }
            console.log(row);
        }
        console.log("");
    }
}

module.exports = TableRenderer;