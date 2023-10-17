

import { sendEmail } from "../services/verifyEmail.service";
import jwt from 'jsonwebtoken';
import { User } from "../models/user.model";
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.middleware'

require('dotenv').config();
const saltRounds = parseInt(process.env.BCRYPT_SALTROUNDS)
const tokenLife = parseInt(process.env.TOKEN_LIFE)
const jwtSecretKey = process.env.JWT_SECRET_KEY;
export async function register(req: Request, res: Response) {
  const { email, fullName, organizationName } = req.body;

  const passwordToken = jwt.sign({ email: email, timestamp: Date.now() }, jwtSecretKey, {
    expiresIn: tokenLife
  });
  const newUser = new User({
    email,
    fullName,
    organizationName,
    token: passwordToken
  });

  try {
    const user = await newUser.save();
    res.json({
      message: 'User added successfully',
      user: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  if (!user.is_verified) {
    return res.status(401).json({ message: 'Email not verified' });
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  const accessToken = jwt.sign({ userId: user._id }, jwtSecretKey, {
    expiresIn: tokenLife
  });
  res.json({ accessToken });
};



export async function currentUser(req: AuthenticatedRequest, res: Response) {
  const user = req.user
  res.json({ user });
}


export async function deleteme(req: Request, res: Response) {
  const users = await User.deleteMany({});
  res.json({ message: 'User deleted successfully' });

}

export async function resendVerificationEmail(req: AuthenticatedRequest, res: Response) {
  const { email } = req.body
  const passwordToken = jwt.sign({ email: email, timestamp: Date.now() }, jwtSecretKey, {
    expiresIn: tokenLife
  });
  const user = await User.findOneAndUpdate({ email: email }, { token: passwordToken }, { new: true })
  if(!user){
    res.json({
      message: "User Does not Exist"
    })
  }
  const emailInfo = {
    email: user.email,
    subject: ' re send Verify Email',
    html: `<a href="http://localhost:3000/verify/${user.token}">Verify Email</a><br/> ${user.token}`,
    text: `http://localhost:3000/verify/${user.token}`
  }

  await sendEmail(emailInfo)
  return res.json({ message: 'Email sent successfully' })
}

export async function verifyEmail(req: Request, res: Response) {
  const { token, password } = req.body
  const decodedToken = jwt.verify(token, jwtSecretKey) as { email: string, timestamp: number, exp: number, iat: number }
  const user = await User.findOne({ email: decodedToken.email })
  if (!password) {
    return res.status(401).json({ message: 'Invalid password' })
  }
  if (!user) {
    return res.status(401).json({ message: 'Invalid token' })
  }
  if (user.token !== token) {
    return res.status(401).json({ message: 'Invalid token' })
  }
  if ((Date.now() / 1000) - decodedToken.timestamp > tokenLife) {
    return res.status(401).json({ message: 'Token expired' })
  }
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  user.is_verified = true
  user.token = null
  user.password = hashedPassword
  await user.save()
  res.json({ message: 'Email verified successfully' })
}

