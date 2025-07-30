const User = require('../model/Users');
const Cart = require('../model/cart');
const Item = require('../model/items');
const Order = require('../model/order');
const AuditLog = require('../model/auditLog');

exports.getStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const carts = await Cart.countDocuments();
    const items = await Item.countDocuments();
    const orders = await Order.countDocuments();
    
    // Get recent activity count (last 24 hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentActivity = await AuditLog.countDocuments({ timestamp: { $gte: yesterday } });

    const stats = {
      users,
      products: items,  // Using "products" to match your frontend
      carts,
      orders,
      recentActivity
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};