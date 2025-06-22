import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/UserRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripewebhook } from './controllers/orderController.js';

const app = express();
const port = process.env.PORT || 4000;
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];

(async () => {
  await connectDB();
  await connectCloudinary();

  app.post('/stripe', express.raw({type: 'application/json'}), stripewebhook)

  // middleware configuration
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({
    origin: function(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));

  app.get('/', (req, res) => res.send("API is Working"));
  app.use('/api/user', userRouter);
  app.use('/api/seller', sellerRouter);
  app.use('/api/product', productRouter);
  app.use('/api/cart', cartRouter); // fixed leading slash
  app.use('/api/address', addressRouter);
  app.use('/api/order', orderRouter);

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})();