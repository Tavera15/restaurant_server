const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        required: true,
        default: () => mongoose.Types.ObjectId
    },
    name: {
        type: String,
        required: true
    }
})

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;