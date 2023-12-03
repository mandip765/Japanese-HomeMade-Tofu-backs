// const express = require('express');
// const router = express.Router();
// const { MongoClient } = require('mongodb');
// const mongoURI = 'mongodb+srv://mandipsth765:9863520755@cluster0.naibexm.mongodb.net';
// const dbName = 'salesdb';
// const client = new MongoClient(mongoURI);

// // Endpoint to fetch all products
// router.get('/api/products', async (req, res) => {
//   try {
//     const database = client.db(dbName);
//     const collection = database.collection('products');

//     const products = await collection.find().toArray();
//     res.status(200).json(products);
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


// // Endpoint to fetch all expenses
// router.get('/api/expenses', async (req, res) => {
//   try {
//     const database = client.db(dbName);
//     const collection = database.collection('expenses');

//     const expenses = await collection.find().toArray();
//     res.status(200).json(expenses);
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


// // Endpoint to create a new expense
// router.post('/api/expenses', async (req, res) => {
//   try {
//     const { product, quantitySold, totalAmount, timestamp } = req.body;

//     const database = client.db(dbName);
//     const collection = database.collection('expenses');

//     const expense = {
//       product,
//       quantitySold,
//       totalAmount,
//       timestamp,
//     };

//     const result = await collection.insertOne(expense);

//     res.status(201).json({ message: 'Expense created successfully', expenseId: result.insertedId });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const mongoURI = 'mongodb+srv://mandipsth765:9863520755@cluster0.naibexm.mongodb.net';
const dbName = 'salesdb';
const client = new MongoClient(mongoURI);





// Transaction Routes

router.post('/api/sales', async (req, res) => {
  try {
    const { product, quantitySold, totalAmount, timestamp } = req.body;

    const result = await client.db(dbName).collection('transactions').insertOne({
      product,
      quantitySold,
      totalAmount,
      timestamp,
    });

    res.status(201).json({ message: 'Transaction completed successfully', transactionId: result.insertedId });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await client.db(dbName).collection('transactions').find().toArray();
    res.status(200).json(transactions);
    // console.log('incomedata', transactions);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/api/transactions/total', async (req, res) => {
  try {
    const totalTransactions = await client.db(dbName).collection('transactions').aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]).toArray();
    res.status(200).json(totalTransactions[0]?.total || 0);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Expenses Routes

router.post('/api/expenses', async (req, res) => {
  try {
    const { product, quantitySold, totalAmount, timestamp } = req.body;

    const result = await client.db(dbName).collection('expenses').insertOne({
      product,
      quantitySold,
      totalAmount,
      timestamp,
    });
    res.status(201).json({ message: 'Expense created successfully', expenseId: result.insertedId });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await client.db(dbName).collection('expenses').find().toArray();
    // console.log('expenseData', expenses
    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/api/expenses/total', async (req, res) => {
  try {
    const totalExpenses = await client.db(dbName).collection('expenses').aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]).toArray();
    res.status(200).json(totalExpenses[0]?.total || 0);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;
