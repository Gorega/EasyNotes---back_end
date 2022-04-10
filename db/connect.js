const mongoose = require("mongoose");

function Connect(){
    return mongoose.connect(process.env.CONNECTION_STRING_DB)
}

module.exports = Connect;