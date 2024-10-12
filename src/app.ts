import express,{ Application } from "express";
import dotenv from "dotenv";
import swaggerUi, { serve } from 'swagger-ui-express';
import swaggerJsdoc from '../swagger.json';

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc));


// DataBase Connection
import { connectDB } from "./config/db";
connectDB();

// Routes
import users from "./routes/users";
app.use("/api/v1/auth", users);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});