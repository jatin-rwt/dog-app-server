const mongoose = require('mongoose');
const Schema = mongoose.Schema();

const categorySchema = new Schema({
    name: "New Parent",
    name: "Nutrition & Diet",
    name: "Adoption & Rescue Stories",
    name: "Accessories & Toys",
    name: "Training & Behavior",
}
)


module.exports = mongoose.model("Category", categorySchema);