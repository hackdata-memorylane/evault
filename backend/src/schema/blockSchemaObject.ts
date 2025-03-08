export default {
    data: {
        autodata: {
            uid: String,
            timestamp: Number,
        },
        constructordata: {
            prevHash: String,
            parentUid: String,
            version: String,
            file: {
                name: String,
                size: Number,
                hash: String,
                description: String,
                userSignedHash: String,
            },
            pk: String,
            nextPk: String,
        },
        nonce: Number,
    },
    signature: String,
}
