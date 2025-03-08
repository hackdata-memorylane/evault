import mongoose from "mongoose";
import blockSchemaObject from "./blockSchemaObject.js";

const chainSchema = new mongoose.Schema(blockSchemaObject);

export default mongoose.model('Chain', chainSchema);

