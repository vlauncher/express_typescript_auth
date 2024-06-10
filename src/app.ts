import express,{ Application } from 'express';
import { config } from 'dotenv';
import swaggerUI from 'swagger-ui-express'
import * as swaggerDocument from '../swagger.json'; 

// dotenv config
config();

const app:Application = express()

app.use(express.json());
app.use(express.urlencoded({ extended:false }));

// Serve Swagger UI documentation
app.use('/api', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Routes setup
import usersRoutes from './routes/users';
app.use('/',usersRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server Running on Port : ${PORT}`);
});
