import mongoose from 'mongoose';

export const connectToDB=(URL:string)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(URL)
        .then(()=>{
            resolve('Connected to DB');
        })
        .catch((err)=>{
            reject(err);
        })
    })
}