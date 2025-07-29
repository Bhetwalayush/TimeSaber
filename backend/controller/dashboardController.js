const User = require('../model/Users');
const Cart = require('../model/cart');
const Item = require('../model/items');
const Order = require('../model/order');

exports.getStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const carts = await Cart.countDocuments();
    const items = await Item.countDocuments();
    const orders = await Order.countDocuments();

    const stats = {
      users,
      products: items,  // Using "products" to match your frontend
      carts,
      orders
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};