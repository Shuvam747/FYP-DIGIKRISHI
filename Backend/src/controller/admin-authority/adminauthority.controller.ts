import { Request, Response } from 'express';
import { User } from '../../model/user.model';
import Mail from 'nodemailer/lib/mailer';
import { MailerService } from '../../utils/mailer.utils';

export async function sendMailToEach(req:Request, res:Response)
{
    const allUser = await User.find();
    let emailList:any = [];
    allUser.forEach((user) => {
        emailList.push(user.email);
    });
    const mailOption:any=[]
    if(emailList.length === 0)
    {
        return res.status(200).json({message:"No email found"});
    }
    emailList.forEach((email:string) => {
        mailOption.push({
            from:process.env.MAIL || "krishidigi@gmail.com",
            to: email,
            subject:req.body.subject || "Hello",
            text:req.body.text || "Hello"
        })
    })
    new MailerService().sendBulkEmail(mailOption);
    return res.status(200).json({message:"Email sent to all users"});
}