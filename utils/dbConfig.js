const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Mongo connected successfully at : ${conn.connection.host}`)
    } catch (error) {
        console.log(`Mongo connection not possible : ${error}`)
        process.exit(1)
    }
}

module.exports = connectDb