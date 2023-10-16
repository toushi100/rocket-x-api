import { update } from "../controllers/user"
import express from 'express'

const userRouter = express.Router()

userRouter.put('/user/update',update)

export default userRouter
