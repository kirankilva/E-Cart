const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const productRoutes = require('./routes/product-routes');
const cartRoutes = require('./routes/cart-routes');
const cardRoutes = require('./routes/card-routes');
const userRoutes = require('./routes/user-routes');
const orderRoutes = require('./routes/order-routes');
const session = require('./utilities/user-session');
const errorHandler = require('./utilities/error-handling');

require('dotenv').config();
const app = express();

const port = process.env.PORT || 4000;
const DB_URL = 'mongodb://localhost:27017/BonstayCart';
const db = mongoose.connection;

app.use(session.userSession);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res)=>{
    res.redirect('/products');
});
app.use('/user', userRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);
app.use('/cards', cardRoutes);
app.all('*', (req, res) => {
    res.render('not-found');
});
app.use(errorHandler);

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});