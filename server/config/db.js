import dotenv from 'dotenv'
import mongoose from "mongoose"

dotenv.config()

const connectDB = async () => {
    try {
        if (!process.env.MONGO) {
            throw new Error('MONGO environment variable is not defined')
        }

        const conn = await mongoose.connect(process.env.MONGO, {
           
        })

        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}

export default connectDB