class Dice {
    constructor(faces) {
        if (!faces.length) throw new Error("Dice must have at least one face");
        this.faces = faces;
    }
    size() {
        return this.faces.length;
    }
    roll(index) {
        if (index < 0 || index >= this.faces.length)
            throw new Error("Roll index out of bounds");
        return this.faces[index];
    }
    toString() {
        return `[${this.faces.join(",")}]`;
    }
}

module.exports = Dice;