const mongoose = require("mongoose");
const Schema   = mongoose.Schema;



const pizzaBoxSchema = new Schema({
  store: String,
  imgsrc: String,
  pizzaname: String,
  toppings: [String],  
});

const PizzaBox = mongoose.model("PizzaBox", pizzaBoxSchema);


module.exports = PizzaBox;
