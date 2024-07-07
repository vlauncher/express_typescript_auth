import express,{ Application } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// DataBase Connection
import { connectDB } from "./config/db";
connectDB();

// Routes
import users from "./routes/users";
app.use("/auth", users);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});