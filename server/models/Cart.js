const mongoose = require ('mongoose');
const CartSchema = new mongoose.Schema(
{
   userId:{
        type : mongoose.Schema.Types.Mixed,
        ref : "User",
        required : false,
   },
   items:[
    {
        productId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Product",
            required : true,
        },
        quantity : {
            type : Number,
            required : true,
            min : 1,
        },
    },
   ],
 
},
{
    timestamps : true,
}
);

module.exports = mongoose.model("Cart", CartSchema);
