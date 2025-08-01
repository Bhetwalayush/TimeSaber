const Item = require('../model/items')

const findAll = async (req, res) => {
    try {
        const item = await Item.find();
        res.status(200).json(item);
    }
    catch (e) {
        res.json(e)
    }
}

const add = async (req, res) => {
    try {
        const { item_name, description, item_price, item_quantity, item_type, sub_item_type } = req.body;
        if (!req.file) {
            return res.status(400).json({ error: "Image file is required" });
        }
        const item = new Item({
            item_name,
            item_price,
            item_quantity,
            item_type,
            description,
            sub_item_type,
            image: req.file.originalname
        });

        await item.save();
        res.status(201).json(item)
    }
    catch (e) {
        console.error("Error saving item:", e);
        res.status(500).json({ error: "Internal Server Error", details: e.message });
    }
}

const findById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        res.status(200).json(item);
    }
    catch (e) {
        res.json(e)
    }
}

const deleteById = async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        res.status(200).json("data deleted");
    }
    catch (e) {
        res.json(e)
    }
}

const updateById = async (req, res) => {
    try {
        const { item_name, description, item_price, item_quantity, item_type, sub_item_type } = req.body;
        const updateData = {
            item_name,
            description,
            item_price,
            item_quantity,
            item_type,
            sub_item_type,
        };
        if (req.file) {
            updateData.image = req.file.originalname;
        }
        const item = await Item.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(201).json(item);
    }
    catch (e) {
        console.error("Error updating item:", e);
        res.status(500).json({ error: "Internal Server Error", details: e.message });
    }
}

const searchItems = async (req, res) => {
    try {
      const { query } = req.query;
      const items = await Item.find({
        $or: [
          { item_name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { item_type: { $regex: query, $options: 'i' } },
          { sub_item_type: { $regex: query, $options: 'i' } },
        ],
      });
      res.status(200).json(items);
    } catch (e) {
      res.status(500).json({ error: "Error searching items", details: e.message });
    }
}

module.exports = {
    findAll,
    add,
    findById,
    deleteById,
    updateById,
    searchItems
}