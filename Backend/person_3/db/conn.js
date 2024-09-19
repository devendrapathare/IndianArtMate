import mongoose from "mongoose";


mongoose.connect("mongodb://127.0.0.1:27017/Indian_ArtMate",{
    useNewUrlParser: true,
    useUnifiedTopology: true

}).then(()=>{
    console.log("connected to mongo")
}).catch(e=>{
    console.log(e)
})