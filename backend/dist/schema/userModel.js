import mongoose from "mongoose";
import { v4 } from "uuid";
const userSchema = new mongoose.Schema({
    uid: {
        type: String,
        default: v4
    },
    username: String,
    password: String,
    keypair: {
        publicKey: String,
        privateKey: String
    },
    session: {
        id: String,
        expires: Number,
    }
});
export default mongoose.model('User', userSchema);
