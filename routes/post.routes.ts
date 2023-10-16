import express from 'express'
import {create} from "../controllers/post.controller"
const postRouter = express.Router()

postRouter.post('/post/create',create)

export default postRouter