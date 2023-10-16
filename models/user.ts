import mongoose, { Model, Schema, Document } from "mongoose";
import {sendEmail} from "../services/verifyEmail";
import bcrypt from 'bcrypt';
import { send } from "process";
require('dotenv').config();
const saltRounds = parseInt(process.env.SALTROUNDS)
export interface IUser extends Document {
  email: string;
  fullName: string;
  organizationName: string;
  is_verified?: boolean;
  password?: string;
  token?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema
  <IUser>
  ({
    email: {
      required: true,
      index: true,
      unique: true,
      type: String
    },
    fullName: String,
    password: {
      required: false,
      type: String,
    },
    organizationName: {
      required: true,
      type: String
    },
    is_verified:{
      required:true,
      type:Boolean,
      default:false
    },
    token:{
      type:String,
      required:false,
      default:''
    }
  });

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};
userSchema.post('save', async function (doc, next) {
  const emailInfo = {
    email: doc.email,
    subject: 'Verify Email',
    html: `<a href="http://localhost:3000/verify/${doc.token}">Verify Email</a>`,
    text:`http://localhost:3000/verify/${doc.token}`
  }
  
 await sendEmail(emailInfo)
  console.log('email sent')
  
}
)
export const User: Model<IUser> = mongoose.model('User', userSchema);