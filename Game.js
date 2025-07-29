
const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("process");

const FairRandom = require("./FairRandom");
const TableRenderer = require("./TableRenderer");

class Game {
    constructor(diceList) {
        this.diceList = diceList;
        this.rl = readline.createInterface({ input, output });
    }

    async start() {
        console.log("Welcome to the generalized non-transitive dice game!");
        console.log(`Loaded ${this.diceList.length} dice.\n`);

        while (true) {
            console.log("Main menu:");
            console.log("  1) Roll dice (play a round)");
            console.log("  2) Show probabilities table (help)");
            console.log("  0) Exit");
            const choice = await this.rl.question("Select option: ");
            if (choice === "0") {
                console.log("Exiting. Goodbye!");
                this.rl.close();
                break;
            } else if (choice === "1") {
                await this.playRound();
            } else if (choice === "2") {
                TableRenderer.render(this.diceList);
            } else {
                console.log("Invalid option. Please choose 0, 1, or 2.\n");
            }
        }
    }

    async playRound() {
        console.log(
            "\nFirst, we decide who goes first by provable fair coin toss (0 or 1)."
        );
        const first = await this.fairCoinToss();
        const userFirst = first === 0;
        console.log(userFirst ? "You go first!" : "Computer goes first.");

        let userDice, computerDice;

        if (userFirst) {
            userDice = await this.userSelectDice("your");
            if (!userDice) {
                console.log("Cancelled dice selection. Returning to menu.\n");
                return;
            }
            computerDice = await this.computerSelectDice(userDice);
        } else {
            computerDice = await this.computerSelectDice();
            userDice = await this.userSelectDice("your");
            if (!userDice) {
                console.log("Cancelled dice selection. Returning to menu.\n");
                return;
            }
        }

        console.log("\nRolling dice...");
        const userRoll = await this.rollWithProof(userDice, "You");
        const computerRoll = await this.rollWithProof(computerDice, "Computer");

        console.log(`\nYour roll result: ${userRoll}`);
        console.log(`Computer's roll result: ${computerRoll}`);

        if (userRoll > computerRoll) console.log("You win this round!\n");
        else if (userRoll < computerRoll) console.log("Computer wins this round!\n");
        else console.log("It's a tie!\n");
    }

    async fairCoinToss() {
        const n = 2;
        const fr = new FairRandom(n);
        console.log(`Computer HMAC: ${fr.getHmac()}`);
        let ru;
        while (true) {
            const answer = await this.rl.question("Enter your number (0 or 1): ");
            if (answer !== "0" && answer !== "1") {
                console.log("Please enter 0 or 1.");
                continue;
            }
            ru = parseInt(answer);
            break;
        }
        const res = fr.combineWithUser(ru);
        console.log(`Computer secret key (hex): ${fr.getKey().toString("hex")}`);
        console.log(`Computer secret number: ${fr.getRc()}`);

        if (
            !FairRandom.verifyHmac(fr.getKey(), fr.getRc(), fr.getHmac())
        )
            console.log("WARNING: HMAC verification failed! Computer might cheat.");
        else console.log("HMAC verified. Coin toss is fair.");

        return res;
    }

    async userSelectDice(who) {
        while (true) {
            console.log(`\nSelect ${who} dice:`);
            for (let i = 0; i < this.diceList.length; i++) {
                console.log(`  ${i + 1}) ${this.diceList[i].toString()}`);
            }
            console.log("  0) Cancel");
            console.log("  h) Help (show probabilities table)");
            const choice = await this.rl.question("Your choice: ");
            if (choice === "0") return null;
            if (choice.toLowerCase() === "h") {
                TableRenderer.render(this.diceList);
                continue;
            }
            const idx = Number(choice);
            if (!Number.isInteger(idx) || idx < 1 || idx > this.diceList.length) {
                console.log("Invalid choice, try again.");
                continue;
            }
            return this.diceList[idx - 1];
        }
    }

    async computerSelectDice(exclude) {
        const indices = this.diceList
            .map((_, i) => i)
            .filter((i) => !exclude || i !== this.diceList.indexOf(exclude));
        if (indices.length === 0) {
            // Only excluded dice available, select it
            return exclude;
        }
        const fr = new FairRandom(indices.length);
        console.log(`\nComputer is selecting dice fairly...`);
        console.log(`Computer HMAC: ${fr.getHmac()}`);

        let ru;
        while (true) {
            const answer = await this.rl.question(
                `Enter your number (0 to ${indices.length - 1}): `
            );
            const val = Number(answer);
            if (!Number.isInteger(val) || val < 0 || val >= indices.length) {
                console.log(`Enter an integer from 0 to ${indices.length - 1}`);
                continue;
            }
            ru = val;
            break;
        }

        const idx = fr.combineWithUser(ru);

        console.log(`Computer secret key (hex): ${fr.getKey().toString("hex")}`);
        console.log(`Computer secret number: ${fr.getRc()}`);

        if (
            !FairRandom.verifyHmac(fr.getKey(), fr.getRc(), fr.getHmac())
        )
            console.log("WARNING: HMAC verification failed! Computer might cheat.");
        else console.log("HMAC verified. Dice selection is fair.");

        const selectedDice = this.diceList[indices[idx]];
        console.log(
            `Computer selected dice #${indices[idx] + 1}: ${selectedDice.toString()}`
        );
        return selectedDice;
    }

    async rollWithProof(dice, who) {
        console.log(`\n${who} rolling dice ${dice.toString()}`);
        const fr = new FairRandom(dice.size());
        console.log(`${who} computer HMAC: ${fr.getHmac()}`);

        let ru;
        while (true) {
            const answer = await this.rl.question(
                `${who}, enter your number (0 to ${dice.size() - 1}): `
            );
            const val = Number(answer);
            if (!Number.isInteger(val) || val < 0 || val >= dice.size()) {
                console.log(`Enter a valid integer from 0 to ${dice.size() - 1}`);
                continue;
            }
            ru = val;
            break;
        }
        const idx = fr.combineWithUser(ru);
        console.log(`${who} computer secret key (hex): ${fr.getKey().toString("hex")}`);
        console.log(`${who} computer secret number: ${fr.getRc()}`);

        if (
            !FairRandom.verifyHmac(fr.getKey(), fr.getRc(), fr.getHmac())
        )
            console.log("WARNING: HMAC verification failed! Computer might cheat.");
        else console.log("HMAC verified. Roll is fair.");

        const face = dice.roll(idx);
        console.log(`${who} rolled face index ${idx}, value: ${face}`);
        return face;
    }
}

module.exports = Game;