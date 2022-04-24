require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors')
const cookieParser = require("cookie-parser");
const Connect = require("./db/connect");
const userRoute = require("./routes/user");
const noteRoute = require("./routes/note");

const corsOptions = {
    origin: ["https://easynotes-gorega.herokuapp.com","http://localhost:3000"],
    origin: true,
    credentials: true,
  };
  
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1",userRoute);
app.use("/api/v1",noteRoute);

app.use("/avaters",express.static("avaters"));
app.use(express.static(path.join(__dirname, "../avaters/build")));
app.use(express.static(path.join(__dirname, "/client/build")));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});


app.listen(process.env.PORT || 8000,async ()=>{
    try{
        await Connect();
        return console.log("connected successfuly")
    }catch(err){
        console.log("not connected !")
    }
})