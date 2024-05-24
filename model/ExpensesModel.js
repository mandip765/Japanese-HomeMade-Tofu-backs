const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantitySold: Number,
  totalAmount: Number,
  vat: Number, // Added vat field
  unit: String, // Added unit field
  timestamp: Date,
});

const ExpensesModel = mongoose.model('Expense', expenseSchema);

module.exports = ExpensesModel;
