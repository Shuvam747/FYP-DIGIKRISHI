import { invalidInputError, resourceNotFound } from "../../middleware/errorHandler.middleware";
import { User } from "../../model/user.model";
import { Request, Response } from "express";
import { VerifyRequest } from "../../model/verifyRequest.model";
import { REQUEST_STATUS } from "../../typings/base.type";
export class AdminUserController {
    async getUsers(req: Request, res: Response): Promise<void> {
        const users = await User.find();
        res.status(200).json({ users });
    }
    async getUser(req: Request, res: Response): Promise<void> {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
        throw new resourceNotFound("User not found");
        }
        res.status(200).json({ user });
    }
    async updateUser(req: Request, res: Response): Promise<void> {
        const userId = req.params.id;
        const updateData = req.body;
        const restrictedFields = ["password"];
        restrictedFields.forEach((field) => delete updateData[field]);
        const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
        );
        if (!updatedUser) {
        throw new resourceNotFound("User not found");
        }
        res.status(200).json({ message: "User updated successfully" });
    }
    async deleteUser(req: Request, res: Response): Promise<void> {
        const userId = req.params.id;
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
        throw new resourceNotFound("User not found");
        }
        res.status(200).json({ message: "User deleted successfully" });
    }
    async verifyRequests(req: Request, res: Response): Promise<void> {
        const requests = await VerifyRequest.find().populate("user");
        res.status(200).json({ requests });
    }
    async verifyRequest(req: Request, res: Response): Promise<void> {
        const requestId = req.params.id;
        const request = await VerifyRequest.findById(requestId).populate("user");
        if (!request) {
        throw new resourceNotFound("Request not found");
        }
        res.status(200).json({ request });
    }
    async updateVerifyRequest(req: Request, res: Response): Promise<void> {
        const requestId = req.params.id;
        const { verifyStatus } = req.body;
        if(!Object.values(REQUEST_STATUS).includes(verifyStatus)){
            throw new resourceNotFound("Invalid status");
        }
        const request = await VerifyRequest.findByIdAndUpdate(requestId,{ verifyStatus },{ new: true });
        if (!request) {
        throw new resourceNotFound("Request not found");
        }
        const user = await User.findById(request.user);
        if (!user) {
        throw new resourceNotFound("User not found");
        }
        user.role = request.role;
        user.isVerified = request.verifyStatus === REQUEST_STATUS.APPROVED;
        await user.save();
        res.status(200).json({ message: "Request updated successfully" });
    }

    async declineRequest(req: Request, res: Response): Promise<void> {
        const requestId = req.params.id;
        if(!requestId){
            throw new invalidInputError("Invalid requestId");
        }
        const request = await VerifyRequest.findById(requestId);
        if (!request) {
        throw new resourceNotFound("Request not found");
        }
        request.verifyStatus = REQUEST_STATUS.REJECTED;
        await request.save();
        res.status(200).json({ message: "Request declined successfully" });
    }
}