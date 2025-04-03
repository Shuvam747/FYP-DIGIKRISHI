import { User } from "../../model/user.model";
import { Request, Response } from "express";
import { AuthorizedRequest, ROLE } from "../../typings/base.type";
import {
  invalidInputError,
  resourceNotFound,
} from "../../middleware/errorHandler.middleware";
import { Token, TokenType } from "../../model/token.model";

import { generateOTP } from "../../utils/base.utils";
import { VerifyRequest } from "../../model/verifyRequest.model";
import { MailerService } from "../../utils/mailer.utils";

export class UserController {
  private sendMail: any;
  constructor(){
    this.sendMail = new MailerService().sendMail
  }
  async getUser(req: AuthorizedRequest, res: Response): Promise<void> {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new resourceNotFound("User not found");
    }
    res.status(200).json({ user });
  }
  async deleteUser(req: AuthorizedRequest, res: Response): Promise<void> {
    const userId = req.user.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new resourceNotFound("User not found");
    }
    res.status(200).json({ message: "User deleted successfully" });
  }
  async updateUser(req: AuthorizedRequest, res: Response): Promise<void> {
    const userId = req.user.id;
    const restrictedFields = ["password","email","phone","emailVerified","numberVerified"];
    const updateData = req.body;
    restrictedFields.forEach((field) => delete updateData[field]);
    const user = await User.findByIdAndUpdate(userId, req.body, {});
    if (!user) {
      throw new resourceNotFound("User not found");
    }
    res.status(200).json({ message: "User updated successfully" });
  }
  async changeEmail(req: AuthorizedRequest, res: Response): Promise<void> {
    const userId = req.user.id;
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new invalidInputError("Email already exists");
    const user = await User.findByIdAndUpdate(
      userId,
      { email, emailVerified: false },
      { new: true }
    );
    if (!user) {
      throw new resourceNotFound("User not found");
    }
    await user.save();
    const existingToken = await Token.findOne({ user: user._id, trash: false });
    if (existingToken) {
      existingToken.trash = true;
      await existingToken.save();
    }
    const token = new Token();
    token.token = generateOTP(5);
    token.user = user._id;
    token.expiresAt = new Date(Date.now() + 60000);
    await token.save();
    await this.sendMail(
      user.email,
      "Email Verification",
      "YOUR EMAIL VERIFICATION CODE IS: " + token.token
    );
    res.status(200).json({
      message: "Email updated successfully.Check your email for OTP.",
    });
  }
  async verifyEmail(req: AuthorizedRequest, res: Response): Promise<void> {
    const { token } = req.body;
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      throw new invalidInputError("User not found");
    }
    const tokenDoc = await Token.findOne({
      user: user._id,
      token,
      expiresAt: { $gt: new Date() },
      type: TokenType.EMAIL,
      trash: false,
    });
    if (!tokenDoc) {
      throw new invalidInputError("Invalid or expired token");
    }
    user.emailVerified = true;
    await user.save();
    res.status(200).json({ message: "Email verified successfully" });
  }
  async changeNumber(req: AuthorizedRequest, res: Response): Promise<void> {
    const userId = req.user.id;
    const { phone } = req.body;
    const existingUser = await User.findOne({ phone });
    if (existingUser)
      throw new invalidInputError("Phone number already exists");
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { phone } },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    const existingToken = await Token.findOne({
      user: user._id,
      trash: false,
      type: TokenType.PHONE,
    });
    if (existingToken) {
      existingToken.trash = true;
      await existingToken.save();
    }
    const token = new Token();
    token.token = generateOTP(5);
    token.user = user._id;
    token.expiresAt = new Date(Date.now() + 60000);
    token.type = TokenType.PHONE;
    await token.save();

    // CALL BITMORO OTP

    res.status(200).json({
      message: "Phone number updated successfully.Check your phone for OTP.",
      id: userId,
    });
  }
  async verifyNumber(req: AuthorizedRequest, res: Response): Promise<void> {
    const userId = req.user.id;
    const { token } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      throw new resourceNotFound("User not found");
    }
    const tokenDoc = await Token.findOne({
      id: userId,
      token,
      expiresAt: { $gt: new Date() },
      trash: false,
      type: TokenType.PHONE,
    });
    if (!tokenDoc) {
      throw new invalidInputError("Invalid or expired token");
    }
    user.numberVerified = true;
    await user.save();
    res.status(200).json({ message: "Phone number verified successfully" });
  }
  async resendVerification(
    req: AuthorizedRequest,
    res: Response
  ): Promise<void> {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      throw new resourceNotFound("User not found");
    }
    const existingToken = await Token.findOne({
      user: user._id,
      trash: false,
      type: TokenType.EMAIL,
    });
    if (existingToken) {
      existingToken.trash = true;
      await existingToken.save();
    }
    const token = new Token();
    token.token = generateOTP(5);
    token.user = user._id;
    token.expiresAt = new Date(Date.now() + 60000);
    await token.save();
    this.sendMail(
      user.email,
      "Verification Code",
      "YOUR VERIFICATION CODE IS: " + token.token
    );
    res.status(200).json({
      message: "Verification code sent to your email. Check your email",
    });
  }
  async resendPhoneVerification(
    req: AuthorizedRequest,
    res: Response
  ): Promise<void> {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      throw new resourceNotFound("User not found");
    }
    const existingToken = await Token.findOne({
      user: user._id,
      trash: false,
      type: TokenType.PHONE,
    });
    if (existingToken) {
      existingToken.trash = true;
      await existingToken.save();
    }
    const token = new Token();
    token.token = generateOTP(5);
    token.user = user._id;
    token.expiresAt = new Date(Date.now() + 60000);
    token.type = TokenType.PHONE;
    await token.save();
    // CALL BITMORO OTP
    res.status(200).json({
      message: "Verification code sent to your phone. Check your phone",
    });
  }
  async platformVerify(req: AuthorizedRequest, res: Response): Promise<void> {
    const userId = req.user.id;
    const role = req.body.role;

    console.log(userId)

    console.log(req.body);
    if (!role) throw new invalidInputError("Role not found");
    if(Object.values(ROLE).indexOf(req.body.role) === -1) {
      throw new invalidInputError("Invalid role");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new resourceNotFound("User not found");
    }
    if (!req.file) {
      throw new invalidInputError("File not found");
    }
    user.govtDocument = req.file.filename;
    const request = new VerifyRequest();
    request.user = user._id;
    request.role = role;
    request.govtDocument = req.file.filename;

    console.log(request)
    await Promise.all([user.save(), request.save()]);
    res.status(200).json({ message: "Verification request sent successfully" });
  }

  async changeProfile(req:AuthorizedRequest, res: Response): Promise<void> {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      throw new resourceNotFound("User not found");
    }
    if(!req.file){
      throw new invalidInputError("File not found");
    }
    if (req.file) {
      user.profilePicture = req.file.filename;
    }
    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  }
}
