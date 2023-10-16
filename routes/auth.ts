import { register,login,currentUser ,deleteme,resendVerificationEmail, verifyEmail} from '../controllers/auth'
import express from 'express'

const authRouter = express.Router()

authRouter.post('/auth/register',register)
authRouter.post('/auth/login',login)
authRouter.get('/auth/current-user',currentUser)
authRouter.delete('/auth/delete-me',deleteme)
authRouter.post('/auth/resend-verification-email',resendVerificationEmail)
authRouter.post('/auth/verify-email',verifyEmail)

export default authRouter

