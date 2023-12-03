const mongoose = require('mongoose');



const reviewSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },

}, { timestamps: true });


const productSchema = mongoose.Schema({
  product_name: {
    type: String,
    required: true
  },
  product_price: {
    type: Number,
    required: true
  },
  product_image: {
    type: String,
    required: true
  },

}, { timestamps: true });


const Product = mongoose.model('Product', productSchema);
module.exports = Product;