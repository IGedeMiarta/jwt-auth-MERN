import express from 'express';
import dotenv from 'dotenv';
import cookieparser from 'cookie-parser';
import cors from 'cors';
import db from './config/Database.js'; 
import router from './routes/index.js';

// import Users from './models/UserModel.js';

dotenv.config();

const app = express();

try {
    await db.authenticate();
    console.log('DB Connected..');
    // await Users.sync();
} catch (error) {
    console.error('DB Connection Error: ', error);
}
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(cookieparser());
app.use(express.json());
app.use(router);
app.listen(5000,()=> console.log('Server started on port 5000'));