const crypto = require("crypto");

class FairRandom {
    // Provable fair random number from 0 to n-1 with HMAC-SHA3-256
    constructor(n) {
        if (n < 1) throw new Error("Range n must be at least 1");
        this.n = n;
        this.key = crypto.randomBytes(32); // 256 bits

        // Generar número aleatorio uniforme seguro en [0, n)
        this.rc = crypto.randomInt(0, this.n);

        this.hmac = this.computeHmac();
    }

    computeHmac() {
        const msg = Buffer.from(this.rc.toString());
        return crypto.createHmac("sha3-256", this.key).update(msg).digest("hex");
    }

    getHmac() {
        return this.hmac;
    }

    getKey() {
        return this.key;
    }

    getRc() {
        return this.rc;
    }

    static verifyHmac(key, rc, hmacHex) {
        const msg = Buffer.from(rc.toString());
        const computed = crypto
            .createHmac("sha3-256", key)
            .update(msg)
            .digest("hex");
        return crypto.timingSafeEqual(Buffer.from(computed, "hex"), Buffer.from(hmacHex, "hex"));
    }

    combineWithUser(ru) {
        if (ru < 0 || ru >= this.n) throw new Error(`User number ${ru} out of range`);
        return (this.rc + ru) % this.n;
    }
}

module.exports = FairRandom;