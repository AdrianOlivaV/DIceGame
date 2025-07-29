const DiceParser = require("./DiceParser");
const Game = require("./Game");

async function main() {
    const args = process.argv.slice(2);
    const diceList = DiceParser.parse(args);
    const game = new Game(diceList);
    await game.start();
}

main().catch((e) => {
    console.error("Unexpected error:", e);
    process.exit(1);
});