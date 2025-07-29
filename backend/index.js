const express = require('express')
const connectDB = require("./config/db")
const UserRouter = require("./routes/userRoutes")
const ItemRouter = require("./routes/itemsRoutes")
const CartRouter= require("./routes/cartRoutes")
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require('./routes/dashboardRoutes');
const wishlistRoutes = require('./routes/wishlist');
const fs= require("fs")
const app = express();
const path = require('path');
const https=require("https");


connectDB();
app.use(express.json());


const cors = require('cors'); // Import the cors package
const corsOptions = {
    users: true,
    origin: ['https://localhost:5000','https://192.168.1.2:5000/'] // Whitelist the domains you want to allow
};
app.use(cors(corsOptions));


app.use("/api/users", UserRouter);
app.use("/api/items", ItemRouter)
app.use("/api/cart",CartRouter)
app.use("/api/order", orderRoutes);
app.use('/api/admin', dashboardRoutes);
app.use('/profile', express.static('profile'));
app.use('/uploads', express.static('uploads'));

app.use('/api/wishlist', wishlistRoutes);
const port = 3000;
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`)
// })

// HTTPS setup
// const port = 3000;
const dirname = __dirname;

try {
    const privateKey = fs.readFileSync(path.resolve(dirname, '.cert/key.pem'), 'utf8');
    const certificate = fs.readFileSync(path.resolve(dirname, '.cert/cert.pem'), 'utf8');
    const credentials = { key: privateKey, cert: certificate };

    https.createServer(credentials, app).listen(port, () => {
        console.log(`Server is running on https://localhost:${port}`);
    });
} catch (error) {
    console.error('Error loading certificates:', error);
    process.exit(1);
}

module.exports=app;