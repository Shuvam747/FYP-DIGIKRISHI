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
        
        // Convert input to lowercase to match enum
        const status = verifyStatus.toLowerCase();
        
        if (!Object.values(REQUEST_STATUS).includes(status as REQUEST_STATUS)) {
            throw new resourceNotFound("Invalid status");
        }
    
        // Update the request status
        const request = await VerifyRequest.findByIdAndUpdate(
            requestId,
            { verifyStatus: status },
            { new: true }
        ).populate("user");
    
        if (!request) {
            throw new resourceNotFound("Request not found");
        }
    
        // Update the user's role and verification status if approved
        if (status === REQUEST_STATUS.APPROVED) {
            const user = await User.findById(request.user._id);
            if (!user) {
                throw new resourceNotFound("User not found");
            }
            
            user.role = request.role;
            user.isVerified = true;
            await user.save();
        }
    
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