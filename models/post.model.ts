import mongoose, { Model, Schema, Document } from "mongoose";
import { User,IUser } from "./user.model";





export interface IPost extends Document {
  title: string;
  body: string;
  author: IUser;
  createdAt?: Date;
  published?: boolean;
  meta?: {
    votes: number;
    favs: number;
  }
}

const postSchema = new Schema
  <IPost>
  ({
    title: { type: String, required: true },
    body: { type: String, required: true },
    author: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
       },
    createdAt: { type: Date, required: true, default: Date.now },
    published: { type: Boolean, required: true, default: false },
    meta: {
      votes: {
        type: Number,
        default: 0
      },
      favs: {
        type: Number,
        default: 0
      }
    }
  })




export const Post: Model<IPost> = mongoose.model('Post', postSchema);