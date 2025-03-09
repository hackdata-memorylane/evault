import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
    uid: String,
    name: String,
    password: String,
    openRecords: [{
        userId: String,
        recordIds: [String]
    }]
});

export default mongoose.model('Hospital', hospitalSchema);
