import express,{ Application } from 'express';
import { config } from 'dotenv';
import { errorHandler } from './middlewares/errorHandler';

config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database
import { connectDB } from './config/database';

connectDB();

// Routes
import userRoutes from './routes/user.routes';
app.use('/api/v1/auth', userRoutes);

// Error Handler
app.use(errorHandler);

export default app;