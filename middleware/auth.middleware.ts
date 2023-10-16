
import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { NextFunction, Request, Response } from 'express';
import { User } from "../models/user.model";
import type { IUser } from "../models/user.model";
import jwt from 'jsonwebtoken';
const jwtSecretKey = process.env.JWT_SECRET_KEY;


export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const excludedEndpoits = ['/api/auth/register', '/api/auth/login','/api/auth/delete-me','/api/auth/resend-verification-email','/api/auth/verify-email']
  if (excludedEndpoits.includes(req.path)) return next()
  passport.use(new
    BearerStrategy(
      async function (token, done) {
        if (!token) {
          return res.status(401).json({ message: 'Authentication required' });
        }
        try {
          const decodedToken = jwt.verify(token, jwtSecretKey);
          const user = await User.findById(decodedToken.userId);
          req.user = user;
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
          next();
        } catch (error) {
          res.status(401).json({ message: 'Invalid token' });
        }
   
      }
    ));
  passport.authenticate('bearer', { session: false })(req, res, next);
}


