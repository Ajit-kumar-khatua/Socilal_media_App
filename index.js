const express=require("express")
const { connection } = require("./config/db")
const { apiRouter } = require("./Routes/api.router")
require("dotenv").config()


const app=express()
app.use(express.json())

app.use("/api",apiRouter)

app.listen(process.env.port,async (req,res)=>{
    try {
        await connection
        console.log("connected To DB")
    } catch (error) {
        console.log(error)
    }
    console.log(`Server is running on port ${process.env.port}`)
})