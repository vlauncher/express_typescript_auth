import express,{ Application } from 'express';
import { config } from 'dotenv';

// dotenv config
config();

const app:Application = express()

app.use(express.json());
app.use(express.urlencoded({ extended:false }));

// Routes setup
import usersRoutes from './routes/users';
app.use('/',usersRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server Running on Port : ${PORT}`);
});
