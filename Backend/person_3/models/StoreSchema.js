import mongoose from "mongoose";
const Schema = mongoose.Schema;

const storeSchema = new Schema({
  owner_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  owner_name: { type: String, required: true },
  store_name: { type: String, required: true },
  
  list_of_store_arties: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const Store = mongoose.model('Store', storeSchema, 'Stores'); 

export default Store
