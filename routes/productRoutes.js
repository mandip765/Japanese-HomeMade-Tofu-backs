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
const { MongoClient, ObjectId } = require('mongodb');
const mongoURI = 'mongodb+srv://mandipsth765:9863520755@cluster0.naibexm.mongodb.net';
const dbName = 'salesdb';
const client = new MongoClient(mongoURI);
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');






router.get('/', (req, res) => {
  return res.status(200).json('welcome jhmt api');
});

// Transaction Routes


router.post('/api/sales', async (req, res) => {
  try {
    const { product, quantitySold, totalAmount, timestamp } = req.body;

    const result = await client.db(dbName).collection('transactions').insertOne({
      product: {
        name: product.name,
        price: product.price,
        quantity: product.quantity || 1,
      },
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
    const { product, quantitySold, totalAmount, vat, unit, timestamp } = req.body;

    const result = await client.db(dbName).collection('expenses').insertOne({
      product,
      quantitySold,
      totalAmount,
      vat,
      unit,
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


// Product Routes
router.use(fileUpload());
// Endpoint to add a new product with image

router.post('/api/products', async (req, res) => {
  let client;
  try {
    client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Connect to MongoDB
    await client.connect();

    const database = client.db('salesdb');
    const collection = database.collection('products');

    const { name, price } = req.body;

    // Assuming you have an 'uploads' directory for storing images
    const imagePath = req.files.image.name;
    const image = req.files.image;

    // Use the MongoDB insertOne method to add a new product
    const result = await collection.insertOne({ name, price, imagePath });

    // Assuming you have an 'uploads' directory for storing images
    image.mv(path.join(__dirname, 'uploads', imagePath), (err) => {
      if (err) {
        console.error('Error saving image:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      console.log('Image saved successfully');
    });

    console.log('Insert result:', result);

    res.json(result);
  } catch (error) {
    console.error('Error inserting into database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Close the client connection after the operation
    if (client) {
      await client.close();
      console.log('MongoDB connection closed.');
    }
  }
});

router.get('/api/products', async (req, res) => {
  try {

    const products = await client.db(dbName).collection('products').find().toArray();

    const productsWithBase64 = products.map((product) => {
      if (!product.imagePath) {
        console.error('Error: imagePath is missing for product:', product);
        return product;
      }

      const filePath = path.join(__dirname, 'uploads', product.imagePath);
      const base64Image = fs.readFileSync(filePath, { encoding: 'base64' });
      return { ...product, base64Image };
    });

    // Use res.json here
    res.json(productsWithBase64);
  } catch (error) {
    console.error('Error fetching products:', error);
    // Use res.status here
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// // Update Product
router.put('/api/products/:id', async (req, res) => {
  let client;
  try {
    client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Connect to MongoDB
    await client.connect();

    const database = client.db(dbName);
    const collection = database.collection('products');

    const productId = req.params.id;
    const { name, price } = req.body;

    const result = await collection.updateOne(
      { _id: ObjectId(productId) },
      { $set: { name, price } }
    );


    res.status(200).json({ message: 'Product updated successfully', result });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Close the client connection after the operation
    if (client) {
      await client.close();
      console.log('MongoDB connection closed.');
    }
  }
});

// Add a new route for deleting a transaction by ID
router.delete('/api/transactions/:id', async (req, res) => {
  try {
    const transactionId = req.params.id;

    // Implement the logic to delete the transaction from the database
    const result = await client.db(dbName).collection('transactions').deleteOne({ _id: ObjectId(transactionId) });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Transaction deleted successfully' });
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new route for deleting an expense by ID
router.delete('/api/expenses/:id', async (req, res) => {
  try {
    const expenseId = req.params.id;

    // Implement the logic to delete the expense from the database
    const result = await client.db(dbName).collection('expenses').deleteOne({ _id: ObjectId(expenseId) });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Expense deleted successfully' });
    } else {
      res.status(404).json({ error: 'Expense not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
