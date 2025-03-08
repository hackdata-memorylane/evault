import mongoose from "mongoose";
import blockSchemaObject from "./blockSchemaObject.js";

const unminedQueueSchema = new mongoose.Schema(blockSchemaObject);

export default mongoose.model('UnminedQueue', unminedQueueSchema);
