export default {
    data: {
        autodata: {
            uid: String,
            timestamp: Number,
        },
        constructordata: {
            prevHash: String,
            pk: String,
            nextPk: String,
            medicalRecord: {
                patient: {
                    id: String,
                    name: String,
                    age: Number,
                },
                doctor: {
                    name: String,
                },
                hospital: {
                    name: String,
                    id: String,
                },
                record: {
                    name: String,
                    size: Number,
                    hash: String,
                },
                medicalDetails: String
            },
        },
        nonce: Number,
    },
    signature: String,
}
