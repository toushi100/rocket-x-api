import { Post, IPost } from "../models/post.model"
import { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.middleware'

export async function create(req: AuthenticatedRequest, res: Response) {
    const { title, body, published } = req.body;
    const currentUser = req.user
    const newPost: IPost = new Post({
        title, body, published, author: currentUser
    })
    try{
        const post = await newPost.save()
        res.json({
            message: "post created successfully",
            post : post 
        })
    }catch(error){
        console.error(error);
    res.status(500).json({ message: 'Internal server error' });
    }
}