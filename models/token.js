const mongoose = require("mongoose");

const userTokenSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"user"
    },
    token:{
        type:String,
    },
    date:{
        type:Date,
        default:new Date()
    }
})

module.exports = mongoose.model("token",userTokenSchema);