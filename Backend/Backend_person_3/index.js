const express = require("express")
require('./db/conn')
const artiest_rout = require('./routes/Artiest_routes')
const app = express()
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.use(artiest_rout)

app.listen(4000,()=>{
    console.log("server started")
})