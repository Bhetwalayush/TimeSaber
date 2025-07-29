const Wishlist = require('../model/wishlist');
const Item = require('../model/items');

// Add item to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId, userId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'User ID is required' });
    }

    // Check if item already exists in wishlist
    const existingItem = await Wishlist.findOne({ userId, productId });
    if (existingItem) {
      return res.status(400).json({ message: 'Item already in wishlist' });
    }

    // Create new wishlist item
    const wishlistItem = new Wishlist({ userId, productId });
    await wishlistItem.save();

    res.status(201).json({ message: 'Item added to wishlist', wishlistItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove item from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'User ID is required' });
    }

    const wishlistItem = await Wishlist.findOneAndDelete({ userId, productId });
    if (!wishlistItem) {
      return res.status(404).json({ message: 'Item not found in wishlist' });
    }

    res.status(200).json({ message: 'Item removed from wishlist' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's wishlist
// exports.getWishlist = async (req, res) => {
//   try {
//     const { userId } = req.query;

//     if (!userId) {
//       return res.status(401).json({ message: 'User ID is required' });
//     }

//     const wishlist = await Wishlist.find({ userId }).populate('productId');
//     res.status(200).json({
//       wishlist: wishlist.map(item => ({
//         productId: item.productId._id,
//         product: {
//           item_name: item.productId.item_name,
//           item_price: item.productId.item_price,
//           image: item.productId.image,
//         },
//       })),
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

exports.getWishlist = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(401).json({ message: 'User ID is required' });
    }

    const wishlist = await Wishlist.find({ userId }).populate('productId');
    res.status(200).json({
      wishlist: wishlist
        .filter(item => item.productId) // Filter out items with null productId
        .map(item => ({
          productId: item.productId._id,
          product: {
            item_name: item.productId.item_name,
            item_price: item.productId.item_price,
            image: item.productId.image,
          },
        })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};