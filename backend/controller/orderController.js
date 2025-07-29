const Order = require("../model/order");
const Cart = require("../model/cart");
const User = require("../model/Users");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "e48c461823ec94fd9b9f49996e0edb7bfa85ee66a8e86a3de9ce12cf0e657ac1"; // Use the same SECRET_KEY as creadController.js

const findAll = async (req, res) => {
    try {
        const items = await Order.find().populate("items.itemId");
        if (!items || items.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }
        res.status(200).json(items);
    } catch (e) {
        res.status(500).json({
            message: "Error fetching orders",
            error: e.message,
        });
    }
};

const findByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await Order.find({ userId }).populate("items.itemId");
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user" });
        }
        res.status(200).json(orders);
    } catch (e) {
        res.status(500).json({
            message: "Error fetching user orders",
            error: e.message,
        });
    }
};

const saveOrder = async (req, res) => {
    try {
        const { userId, address, phone_no, items, total_amount } = req.body;

        if (!userId || !address || !phone_no || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "All fields are required, and items must be a non-empty array" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const order = new Order({
            userId,
            address,
            phone_no,
            items,
            total_amount,
            status: "Pending",
        });

        await order.save();

        // Remove ordered items from the cart
        const cart = await Cart.findOne({ userId });
        if (cart) {
            const itemIdsToRemove = items.map(item => item.itemId);
            await Cart.findByIdAndUpdate(
                cart._id,
                { $pull: { items: { itemId: { $in: itemIdsToRemove } } } },
                { new: true }
            );
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "vitalflow33@gmail.com",
                pass: "zogh jnnd cmux ohjt"
            }
        });

        const mailOptions = {
            from: '"VitalFlow MedLink" <vitalflow33@gmail.com>',
            to: user.email,
            subject: "YOUR ORDER IS Created Successfully",
            html: `
                <h1>WE HAVE GOT YOUR ORDER</h1>
                <p>WE WILL CALL YOU WHEN AND DELIVER TO YOUR LOCATION.</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);

        res.status(201).json(order);
    } catch (error) {
        console.error("Error saving order:", error);
        res.status(500).json({ error: "Failed to save order" });
    }
};

const deleteById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const user = req.user; // Provided by authorization middleware
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Allow admins to delete any order, users only their own
        if (user.role !== "admin" && order.userId.toString() !== user.userId) {
            return res.status(403).json({ message: "Unauthorized to cancel this order" });
        }

        await Order.findByIdAndDelete(orderId);
        res.status(200).json({ message: "Order canceled successfully" });
    } catch (e) {
        console.error("Error canceling order:", e);
        res.status(500).json({ message: "Error canceling order", error: e.message });
    }
};

module.exports = { saveOrder, findAll, findByUserId, deleteById };