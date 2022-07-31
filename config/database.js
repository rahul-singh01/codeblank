require('dotenv').config()

const mongoose = require('mongoose')

function db(){
    try{
        mongoose.connect(process.env.mongo_url , {
        useNewUrlParser : true , 
        useUnifiedTopology: true 
        })

        const connection = mongoose.connection

        connection.once('open' , ()=>{
            console.log('Database Connected')
        })
    }catch(err){
        console.log("database connection failed")
    }
    
}

module.exports = db