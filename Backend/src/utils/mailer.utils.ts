import nodemailer from 'nodemailer';
import dotenv from 'dotenv';


// Load environment variables
dotenv.config();
export class MailerService {
  private transporter: nodemailer.Transporter;
  constructor() {
    
    try {
      this.transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE || "gmail",
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_EMAIL,
        },
      });

      // this.transporter.verify((error) => {
      //   if (error) {
      //     throw new Error("Transporter verification failed: " + error.message);
      //   }
      // });
    } catch (error) {
      throw new Error("Error in mail connector: " + error.message);
    }
  }

  // Send an individual email
  async sendEmail(mailOption:any, isHtml = false) {
    try {
      const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: mailOption.to,
        subject: mailOption.subject,
        [isHtml ? "html" : "text"]: mailOption.text,
      };

      await this.transporter.sendMail(mailOptions);

    } catch (error) {
      throw new Error(`Error in sending email to ${mailOption.to}: ` + error.message);
    }
  }

  // Send a single email
  async sendMail(mailOption:any) {
    await this.sendEmail(mailOption);
  }

  // Send a single HTML email
  async sendHtmlMail(mailOption:any) {
    await this.sendEmail(mailOption, true);
  }

  // Send bulk email
  async sendBulkEmail(mailOptions:any, isHtml = false) {
     await Promise.allSettled(
      mailOptions.map((mailOption:any) => this.sendEmail(mailOption, isHtml))
    );
  }

  // Send bulk text email
  async sendBulkTextMail(mailOptions:any) {
    await this.sendBulkEmail(mailOptions);
  }

  // Send bulk HTML email
  async sendBulkHtmlMail(mailOptions:any) {
    await this.sendBulkEmail(mailOptions, true);
  }
}


