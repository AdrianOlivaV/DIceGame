# DiceGame
# Generalized Non-Transitive Dice Game (Provably Fair)

This project implements a mathematical model of a non-transitive dice game, where dice can have arbitrary configurations (not hardcoded). It's designed to be **fair and transparent**, proving that the computer does not cheat by using a "provably fair" random generation protocol based on HMAC with SHA3-256 and secret keys.

---

## Key Features

- Supports any number (≥3) of dice, each with arbitrary face values (passed as arguments).
- Console-based game with menu for selecting dice, rolling, and displaying help.
- Fair and verifiable coin toss to decide who starts the game.
- Each die roll and computer die selection uses a provably fair joint random number generation protocol.
- Displays a table of winning probabilities between every pair of dice.
- Modular code organized into separate classes for parsing, randomness, probability, and gameplay.
- Uses only native Node.js libraries (no external dependencies).

---

## Requirements

- Node.js version 16 or higher (required for `readline/promises` and SHA3 support in `crypto`).
- Terminal / command line interface.

---

## Installation and Execution

1. Clone or download this repository.
2. Place the `.js` files (Dice.js, DiceParser.js, FairRandom.js, ProbabilityCalculator.js, TableRenderer.js, Game.js, index.js) in the same folder.
3. Open a terminal and navigate to that folder.
4. Run the game using:

Each (diceN) is a comma-separated list of integers representing the faces of the die. Example:
```bash
node index.js <dice1> <dice2> <dice3> [...]
node index.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3
