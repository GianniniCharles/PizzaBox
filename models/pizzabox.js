const mongoose = require("mongoose");
const Schema   = mongoose.Schema;



const pizzaBoxSchema = new Schema({
  store: String,
  imgsrc: String,
  pizzaname: String,
  description: String,
  originlocation: String, 
  targetlocation: String,
  pizzaboxer: {type: Schema.Types.ObjectId, ref:'User'},
  purchased_by: {type: Schema.Types.ObjectId, ref: 'User'},
  timelimit: String,
  status: String,
  price: Number,

},
{timestamps: true}  
);

const PizzaBox = mongoose.model("PizzaBox", pizzaBoxSchema);


module.exports = PizzaBox;

