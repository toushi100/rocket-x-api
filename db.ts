import mongoose from 'mongoose';
require('dotenv').config();
const mongodb_url :string= process.env.MONGODB_URL;
export function db_connection(){
    mongoose.connect(mongodb_url);
}