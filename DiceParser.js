const Dice = require("./Dice");

class DiceParser {
    static parse(args) {
        if (args.length < 3) {
            this.errorAndExit(
                "At least 3 dice required, each with 6 comma-separated integers.\n" +
                "Example:\n  node index.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3"
            );
        }
        const diceList = [];
        for (let i = 0; i < args.length; i++) {
            const facesStr = args[i];
            const parts = facesStr.split(",");
            if (parts.length < 1)
                this.errorAndExit(`Dice #${i + 1} has no faces`);
            const faces = parts.map((p) => {
                const v = Number(p);
                if (!Number.isInteger(v)) {
                    this.errorAndExit(
                        `Dice #${i + 1} contains non-integer values: '${facesStr}'`
                    );
                }
                return v;
            });
            diceList.push(new Dice(faces));
        }
        return diceList;
    }
    static errorAndExit(msg) {
        console.error("Input error:", msg);
        process.exit(1);
    }
}

module.exports = DiceParser;