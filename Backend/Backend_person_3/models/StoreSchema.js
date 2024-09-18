const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema({
  owner_id: { type: Schema.Types.ObjectId, required: true, ref: 'arties' }, 
  owner_name: { type: String, required: true },
  list_of_store_arties: [{ type: Schema.Types.ObjectId, ref: 'arties' }]
}, { timestamps: true });

const Store = mongoose.model('Store', storeSchema, 'Stores'); 

module.exports = Store;
