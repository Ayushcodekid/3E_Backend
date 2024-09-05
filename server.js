const express = require('express')
const app = express();
const cors = require('cors');
const mongoose= require('mongoose');
const authRoutes=  require("./routes/AuthRoutes")
const projectRoutes = require("./routes/ProjectRoutes");

require('dotenv').config();

const PORT = process.env.PORT || 9000;

app.use(cors({
  origin: 'https://3eapp-rbac.dwcx460bjugbd.amplifyapp.com/',
  credentials: true, // If you need to allow cookies/auth headers
}));

app.use(express.json());


app.use("/api", authRoutes)
app.use("/api", projectRoutes)



mongoose.connect(process.env.DB_URL).then((result)=>{
    console.log("DB connected successfully");
})
.catch(err=>{
    console.log(err);
})


app.listen(PORT,()=>{
    console.log(`Server started at ${PORT} `)
})
