// Import required modules
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

// Load environment variables from.env file
require('dotenv').config();

// Initialize Express app
const app = express();

// Set port number
const port = process.env.PORT || 4000;

// Define MongoDB connection URL
const DB_URL = 'mongodb://localhost:27017/BonstayCart';

// Initialize MongoDB connection
const db = mongoose.connection;

app.use(session.userSession);  // Use user session middleware
app.set('view engine', 'ejs');  // Set view engine to EJS
app.use(express.static(path.join(__dirname, 'assets')));  // Serve static files from 'assets' directory
app.use(bodyParser.json());  // Parse JSON request bodies
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded request bodies

// Redirect root URL to '/products' URL
app.get('/', (req, res)=>{
    res.redirect('/products');
});

// Routers
app.use('/user', userRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);
app.use('/cards', cardRoutes);

// Handle 404 errors
app.all('*', (req, res) => {
    res.render('not-found');
});

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Handle MongoDB connection errors
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Start server on specified port
db.once('open', function () {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});