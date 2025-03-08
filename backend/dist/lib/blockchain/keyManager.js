import { createSign, createVerify, generateKeyPairSync } from "crypto";
import { assignI, getEl } from "json-db-jdb";
export default class KeyManager {
    static generatePair() {
        const { publicKey, privateKey } = generateKeyPairSync("rsa", {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: "spki",
                format: "pem",
            },
            privateKeyEncoding: {
                type: "pkcs8",
                format: "pem",
            },
        });
        return { publicKey, privateKey };
    }
    static newPair() {
        var _a;
        const { publicKey, privateKey } = KeyManager.generatePair();
        const allPairs = JSON.parse((_a = getEl("keys", "keypairs")) === null || _a === void 0 ? void 0 : _a["pairs"]);
        allPairs.push({ publicKey, privateKey });
        assignI("keys", "keypairs", {
            pairs: JSON.stringify(allPairs),
        });
        return { publicKey, privateKey };
    }
    static signAndDestroyPair(block) {
        var _a, _b;
        const firstKeyPair = JSON.parse((_a = getEl("keys", "keypairs")) === null || _a === void 0 ? void 0 : _a["pairs"])[0];
        if (!firstKeyPair) {
            throw new Error("No key pairs found");
        }
        if (block.data.constructordata.pk !== firstKeyPair.publicKey) {
            return false;
        }
        const signer = createSign("rsa-sha256");
        signer.update(block.hash);
        block.signature = signer.sign(firstKeyPair.privateKey, "hex");
        const allPairs = JSON.parse((_b = getEl("keys", "keypairs")) === null || _b === void 0 ? void 0 : _b["pairs"]);
        allPairs.shift();
        assignI("keys", "keypairs", {
            pairs: JSON.stringify(allPairs),
        });
        return true;
    }
    static useAndCreateNewPair(block) {
        var _a;
        let lastPair = JSON.parse((_a = getEl("keys", "keypairs")) === null || _a === void 0 ? void 0 : _a["pairs"]).at(-1);
        if (!lastPair)
            lastPair = KeyManager.newPair();
        block.data.constructordata.pk = lastPair.publicKey;
        const newKeyPair = KeyManager.newPair();
        block.data.constructordata.nextPk = newKeyPair.publicKey;
    }
    static verifySignature(signature, publicKey, hash) {
        const verifier = createVerify("rsa-sha256");
        verifier.update(hash);
        return verifier.verify(publicKey, signature, "hex");
    }
}
