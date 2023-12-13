// const express = require('express');
// const app = express();
// const cors = require('cors');
// const port = 5005;
// const mongoose = require('mongoose');
// const authRoutes = require('./routes/authRoutes');
// const productRoutes = require('./routes/productRoutes');
// const fileUpload = require('express-fileupload')
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());
// app.use('/images', express.static('images'));

// mongoose.connect('mongodb+srv://mandipsth765:9863520755@cluster0.naibexm.mongodb.net/ExpenseTracker123').then((val) => {
//   app.listen(port, () => {
//     console.log('connected');
//   });
// }).catch((err) => {
//   console.log(err);
// });


// app.use(authRoutes);

// app.use(fileUpload({
//   limits: { fileSize: 15 * 1024 * 1024 },
//   abortOnLimit: true
// }));
// app.use(productRoutes);

// app.use((req, res) => {
//   return res.status(404).json("not found");
// })





const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes')
const path = require('path');
const app = express();
const port = 5005;
mongoose.connect('mongodb+srv://mandipsth765:9863520755@cluster0.naibexm.mongodb.net/salesdb').then((val) => {
  console.log('Connected to MongoDB')
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch((err) => {
  console.log(err);
});

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(cors());
app.use(productRoutes);

