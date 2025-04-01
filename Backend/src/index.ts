import express, { Application } from 'express';
import * as dotenv from 'dotenv';
import { connectToDB } from './config/db.config';
import { authRouter, } from './route/auth.route';
import { userRouter } from './route/user.route';
import { productRouter } from './route/product.route';
import { orderRouter } from './route/order.route';
import { resourceRouter } from './route/resourse.route';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler.middleware';
import cors from 'cors';
import { validate } from './middleware/validate.middleware';
import path from 'path';
import { validateAdmin } from './middleware/adminvalidate.middleware';
dotenv.config();
const app: Application = express();
const port = process.env.PORT || 4000;

app.listen(port,(err) => {
    if(!err)
    {
        console.log(`Server is running on port ${port}`);
        connectToDB(process.env.DB_URL).then((res)=>{
            console.log(res);
        }).catch((err)=>{
            console.log(err);
        })
    } 
})
app.use(cors({credentials: true, origin: true}));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.get('/uploads/:fileName', (req, res) => {
    const { fileName } = req.params;
    const filePath = path.join(__dirname, '../uploads', fileName);
    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).send('File not found');
      }
    });
  });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/validate",validate)
app.get("/validate-admin",validateAdmin)

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/resource",resourceRouter)
app.use(errorHandler)