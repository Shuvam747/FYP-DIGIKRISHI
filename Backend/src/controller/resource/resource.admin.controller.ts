import { invalidInputError } from "../../middleware/errorHandler.middleware";
import { Comment } from "../../model/comment.model";
import { Resource } from "../../model/resource.model";
import { AuthorizedRequest } from "../../typings/base.type";
import { ResourceController } from "./resource.controller";
import { Request,Response } from "express";
export class ResourceAdminController extends ResourceController {
    constructor() {
        super();
    }
    async deleteResourceAdmin(req: AuthorizedRequest, res: Response): Promise<void> {
            if (!req.params.id) {
                throw new invalidInputError("Resource ID is required");
            }

            const resource = await Resource.findOneAndDelete({ _id: req.params.id });
            if (!resource) {
                throw new invalidInputError("Resource not found");
            }

            res.status(200).json({ message: "Resource deleted successfully" });
    }

    async deleteCommentAdmin(req: AuthorizedRequest, res: Response): Promise<void> {
        if (!req.params.id) {
            throw new invalidInputError("Comment ID is required");
        }

        const comment = await Comment.findOneAndDelete({ _id: req.params.id });
        if (!comment) {
            throw new invalidInputError("Comment not found");
        }

        res.status(200).json({ message: "Comment deleted successfully" });
    }
}




