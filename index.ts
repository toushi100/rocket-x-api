import express, { Express } from 'express';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import { authenticate } from './middleware/auth.middleware';
import { db_connection } from './db'
import cors from 'cors';
import morgan from 'morgan';

require('dotenv').config();

const port = process.env.EXPRESS_SERVER_PORT
const cors_url = process.env.CORS;



const corsOptions = {
  origin: cors_url,
  methods: '*',
  allowedHeaders: 'Content-Type,Authorization',
};
const app: Express = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));
app.use(authenticate)
app.use('/api', authRouter,userRouter);
app.listen(port, () => {
  db_connection();
  console.log(`Server is running on port ${port}`);
});
