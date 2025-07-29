const crypto = require("crypto");

class FairRandom {
    // Provable fair random number from 0 to n-1 with HMAC-SHA3-256
    constructor(n) {
        if (n < 1) throw new Error("Range n must be at least 1");
        this.n = n;
        this.key = crypto.randomBytes(32); // 256 bits
        this.rc = this.genUniform();
        this.hmac = this.computeHmac();
    }
    computeHmac() {
        const msg = Buffer.from(this.rc.toString());
        return crypto.createHmac("sha3-256", this.key).update(msg).digest("hex");
    }
    genUniform() {
        // Uniform in [0,n) with rejection sampling
        const bits = Math.ceil(Math.log2(this.n));
        if (bits === 0) return 0;
        while (true) {
            const bytes = Math.ceil(bits / 8);
            let rand = 0;
            for (let i = 0; i < bytes; i++) {
                rand = (rand << 8) + crypto.randomBytes(1)[0];
            }
            rand = rand & ((1 << bits) - 1);
            if (rand < this.n) return rand;
        }
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
