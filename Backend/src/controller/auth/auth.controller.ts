import { Request, Response } from "express";
import {
  invalidInputError,
  resourceNotFound,
} from "../../middleware/errorHandler.middleware";
import { User } from "../../model/user.model";
import {
  comparePassword,
  createJwt,
  encryptPassword,
  generateOTP,
} from "../../utils/base.utils";
import { Token, TokenType } from "../../model/token.model";
import { ROLE } from "../../typings/base.type";
import { MailerService } from "../../utils/mailer.utils";

export class AuthController {
  private sendEmail : any;
  constructor() {
    this.sendEmail = new MailerService().sendEmail
  }
  async login(req: Request, res: Response): Promise<void> {
    let { email, password } = req.body;
    email = email.toLowerCase();
    if (!email || !password) {
      throw new invalidInputError("Email and password are required");
    }
    console.log(email, password);
  
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new invalidInputError("User not found with this email");
    }
    // if (!user.emailVerified) throw new invalidInputError("Email not verified");

    const isPasswordCorrect = comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      throw new invalidInputError("Incorrect password");
    }
    const token = createJwt({
      id: user._id,
      role: user.role,
      verified: user.isVerified,
    });
    const expiryTime = 5 * 60 * 60 * 1000 + 50 * 60 * 1000;
    res.cookie("token", token, {
      maxAge: expiryTime,
    });
    res.status(200).json({ message: "User logged in successfully" });
  }

  static async register(req: Request, res: Response): Promise<void> {
    const { username, password, confirmPassword } = req.body;
    let { email } = req.body;
    email = email.toLowerCase();
    if (!username || !email) {
      throw new invalidInputError("Username and email are required");
    }
    if (!password || !confirmPassword) {
      throw new invalidInputError("Password and confirm password are required");
    }
    if (password.length < 6 || confirmPassword.length < 6)
      throw new invalidInputError(
        "Password must be at least 6 characters long"
      );

    if (password !== confirmPassword)
      throw new invalidInputError("Passwords do not match");

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new invalidInputError("User already exists with this email");
    }
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = encryptPassword(password);
    user.role = ROLE.GENERAL;
    await user.save();
    const existingToken = await Token.findOne({ user: user._id, trash: false });
    if (existingToken) {
      existingToken.trash = true;
      await existingToken.save();
    }
    // const token = new Token();
    // token.token = generateOTP(5);
    // token.user = user._id;
    // token.expiresAt = new Date(Date.now() + 60000);
    // await token.save();
    // sendEmail(
    //   user.email,
    //   "Email Verification",
    //   "YOUR EMAIL VERIFICATION CODE IS: " + token.token
    // );
    res.status(200).json({
      message: "User registered successfully.Check mail for verification",
    });
  }

  async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
  }

  async verifyEmail(req: Request, res: Response): Promise<void> {
    const { email, token } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new invalidInputError("User not found with this email");
    }
    const tokenDoc = await Token.findOne({
      user: user._id,
      token,
      expiresAt: { $gt: new Date() },
      trash: false,
    });
    if (!tokenDoc) {
      throw new invalidInputError("Invalid or expired token");
    }
    user.emailVerified = true;
    await user.save();
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new invalidInputError("User not found with this email");
    }
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
    this.sendEmail(
      user.email,
      "Password Reset",
      "YOUR PASSWORD RESET CODE IS: " + token.token
    );
    res.status(200).json({
      message: "Password reset code sent to your email. Check your email",
      userId: user._id,
    });
  }

  async verifyPasswordReset(req: Request, res: Response): Promise<void> {
    const { id, token } = req.body;
    const user = await User.findById(id);
    if (!user) {
      throw new invalidInputError("User not found with this id");
    }
    const tokenDoc = await Token.findOne({
      token,
      user: user._id,
      trash: false,
      expiresAt: { $gt: new Date() },
      type: TokenType.EMAIL,
    });
    if (!tokenDoc) {
      throw new invalidInputError("Invalid or expired token");
    }
    res.status(200).json({ message: "Token verified successfully" });
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const { id, password } = req.body;
    const user = await User.findById(id);
    if (!user) {
      throw new invalidInputError("User not found with this id");
    }
    const tokenDoc = await Token.findOne({});
    user.password = encryptPassword(password);
    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.body.user.id).select("+password");
    if (!user) {
      throw new invalidInputError("User not found with this id");
    }
    const isPasswordCorrect = comparePassword(oldPassword, user.password);
    if (!isPasswordCorrect) {
      throw new invalidInputError("Incorrect old password");
    }
    user.password = encryptPassword(newPassword);
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  }
  async resendVerification(req: Request, res: Response): Promise<void> {
    const userId = req.body.user.id;
    const user = await User.findById(userId);
    if (!user) {
      throw new resourceNotFound("User not found");
    }
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
    this.sendEmail(
      user.email,
      "Verification Code",
      "YOUR VERIFICATION CODE IS: " + token.token
    );
    res.status(200).json({
      message: "Verification code sent to your email. Check your email",
    });
  }
  static async firstAdmin(req: Request, res: Response): Promise<void> {
    let existingAdmin = await User.findOne({ role: ROLE.ADMIN });
    if (existingAdmin) {
      throw new invalidInputError("Admin already exists");
    }
    const { username, email, password, confirmPassword } = req.body;
    if (!username || !email) {
      throw new invalidInputError("Username and email are required");
    }
    if (!password || !confirmPassword) {
      throw new invalidInputError("Password and confirm password are required");
    }
    if (password.length < 6 || confirmPassword.length < 6)
      throw new invalidInputError(
        "Password must be at least 6 characters long"
      );

    if (password !== confirmPassword)
      throw new invalidInputError("Passwords do not match");

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new invalidInputError("User already exists with this email");
    }
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = encryptPassword(password);
    user.role = ROLE.ADMIN;
    user.isVerified = true;
    user.emailVerified = true;
    user.numberVerified = true;
    await user.save();
    res.status(200).json({ message: "Admin registered successfully" });
  }

  async adminLogin(req: Request, res: Response): Promise<void> {
    try {
      // Check if an admin already exists
      const existingAdmin = await User.findOne({ role: ROLE.ADMIN });
  
      // If no admin exists and email & password are provided, register the admin
      if (!existingAdmin && req.body.email && req.body.password) {
        const user = new User({
          username: "SUPER ADMIN",
          email: req.body.email,
          password: encryptPassword(req.body.password),
          role: ROLE.ADMIN,
          isVerified: true,
          emailVerified: true,
          numberVerified: true,
        });
  
        await user.save();
        res.status(200).json({ message: "Admin registered successfully" });
        return;
      }
  
      // Otherwise, perform login
      const { email, password } = req.body;
      if (!email || !password) {
        throw new invalidInputError("Email and password are required");
      }
  
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        throw new invalidInputError("User not found with this email");
      }
  
      // Corrected admin role check
      if (user.role !== ROLE.ADMIN) {
        throw new invalidInputError("User is not an admin");
      }
  
      const isPasswordCorrect = comparePassword(password, user.password);
      if (!isPasswordCorrect) {
        throw new invalidInputError("Incorrect password");
      }
  
      const token = createJwt({
        id: user._id,
        role: ROLE.ADMIN,
        verified: user.isVerified,
      });
  
      // Define the cookie expiry time (5 hours 50 minutes)
      const expiryTime = 5 * 60 * 60 * 1000 + 50 * 60 * 1000;
      res.cookie("token", token, {
        maxAge: expiryTime,
        httpOnly: true,
      });
  
      res.status(200).json({ message: "Admin logged in successfully", token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
  
}
