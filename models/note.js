const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
    content:String,
    color:String,
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
},{timestamps:true})

module.exports = mongoose.model("note",notesSchema);