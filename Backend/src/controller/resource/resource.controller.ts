import { Request, Response } from "express";
import { AuthorizedRequest, RESOURCE_TYPE } from "../../typings/base.type";
import { invalidInputError } from "../../middleware/errorHandler.middleware";
import { Resource } from "../../model/resource.model";
import { User } from "../../model/user.model";
import { Comment } from "../../model/comment.model";
import { Bookmark } from "../../model/bookmark.model";

interface FileFields {
    [fieldname: string]: Express.Multer.File[];
}
export class ResourceController {
    async getResources(req: Request, res: Response): Promise<void> {
        try {
            const resources = await Resource.find();
            res.status(200).json(resources);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getResource(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.id) {
                throw new invalidInputError("Resource ID is required");
            }
            const resource = await Resource.findById(req.params.id)
            .populate({ path: 'comment', strictPopulate: false })
            .populate("uploadedBy");
            if (!resource) {
                throw new invalidInputError("Resource not found");
            }
            res.status(200).json(resource);
        } catch (error) {      
            res.status(500).json({ message: error.message });
        }
    }

    async myResources(req: AuthorizedRequest, res: Response): Promise<void> {
        try {
            const resources = await Resource.find()
            .populate({ path: 'comment', strictPopulate: false })
          
            res.status(200).json(resources);
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error.message });
        }
    }

    async createResource(req: AuthorizedRequest, res: Response): Promise<void> {
        let { title, description, category, resourceType, url, language } = req.body;
        let photos: string[] = [];
        let filee: string[] = [];
        if (!title || !category || !resourceType) {
            res.status(400).json({ message: "Title, category, and resourceType are required" });
            return;
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const files = req.files as FileFields;

        if (files?.photo) {
            files['photo'].forEach(file => {
                photos.push(file.path);
            });
        }

        if (files?.file) {
            files['file'].forEach(file => {
                filee.push(file.path);
            });
        }

        const newResource = new Resource({
            title,
            description,
            category,
            resourceType,
            uploadedBy: user.id,
            photos,
            url,
            file: filee,
            language,
        });

        await newResource.save();
        res.status(201).json({ message: "Resource created successfully", resource: newResource });
    }
    
    async updateResource(req: AuthorizedRequest, res: Response): Promise<void> {
        try {
            if (!req.params.id) {
                throw new invalidInputError("Resource ID is required");
            }

            const resource = await Resource.findOne({ _id: req.params.id, uploadedBy: req.user.id });
            if (!resource) {
                throw new invalidInputError("Resource not found");
            }

            const { title, description, category, resourceType, url,language } = req.body;
            const files = req.files as FileFields;
            const photos: string[] = [];
            const filee: string[] = [];

            if (files['photo']) {
                files['photo'].forEach(file => {
                    photos.push(file.path);
                });
            }
    
            if (files['file']) {
                files['file'].forEach(file => {
                    filee.push(file.path);
                });
            }
            resource.title = title || resource.title;
            resource.description = description || resource.description;
            resource.category = category || resource.category;
            resource.resourceType = resourceType || resource.resourceType;
            resource.url = url || resource.url;
            resource.language = language || resource.language;
            resource.photo = photos.length > 0 ? photos : resource.photo;
            resource.file = filee.length > 0 ? filee : resource.file;

            await resource.save();

            res.status(200).json({ message: "Resource updated successfully", resource });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteResource(req: AuthorizedRequest, res: Response): Promise<void> {
        try {
            if (!req.params.id) {
                throw new invalidInputError("Resource ID is required");
            }
            const resource = await Resource.findOneAndDelete({ _id: req.params.id, uploadedBy: req.user.id });
            if (!resource) {
                throw new invalidInputError("Resource not found");
            }
            res.status(200).json({ message: "Resource deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getByCategory(req: Request, res: Response): Promise<void> {
            if (!req.params.type) {
                throw new invalidInputError("Category is required");
            }
            
            const type = req.params.type as RESOURCE_TYPE;
            if (Object.values(RESOURCE_TYPE).indexOf(type) === -1) {
                 res.status(400).json({ message: "Invalid category type" });
            }
            const resources = await Resource.find({ category: req.params.type });
            res.status(200).json(resources);
       
    }

    async bookmarkResource(req: AuthorizedRequest, res: Response): Promise<void> {
        const { id } = req.body;
        if (!id) {
            throw new invalidInputError("Resource ID is required");
        }

        const resource = await Resource.findById(id);
        if (!resource) {
            throw new invalidInputError("Resource not found");
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            throw new invalidInputError("User not found");
        }
        const bookmark = new Bookmark();
        bookmark.resource = id;
        bookmark.user = user.id;
        await bookmark.save();
        res.status(200).json({ message: "Resource bookmarked successfully" });
    }

    async deleteBookmark(req: AuthorizedRequest, res: Response): Promise<void> {
        const { id } = req.body;
        if (!id) {
            throw new invalidInputError("Resource ID is required");
        }

        const bookmark = await Bookmark.findOneAndDelete({ resource: id, user: req.user.id });
        if (!bookmark) {
            throw new invalidInputError("Bookmark not found");
        }
        res.status(200).json({ message: "Bookmark deleted successfully" });
    }

    async getBookmarks(req: AuthorizedRequest, res: Response): Promise<void> {
        const bookmarks = await Bookmark.find({ user: req.user.id }).populate("resource");
        res.status(200).json(bookmarks);
    }

    async voteResource(req: AuthorizedRequest, res: Response): Promise<void> {
            const { id, vote } = req.body;
            if (!id || !vote) {
                throw new invalidInputError("Resource ID and vote are required");
            }

            const resource = await Resource.findById(id);
            if (!resource) {
                throw new invalidInputError("Resource not found");
            }

            if (vote === "up") {
                resource.votes += 1;
            } else if (vote === "down") {
                resource.votes -= 1;
            }

            await resource.save();
            res.status(200).json({ message: "Vote added successfully" });
    }

    async downloadResource(req: Request, res: Response): Promise<void> {
        if (!req.params.id) {
            throw new invalidInputError("Resource ID is required");
        }

        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            throw new invalidInputError("Resource not found");
        }

        res.download(resource.file[0]);
    }

    async addComment(req: AuthorizedRequest, res: Response): Promise<void> {
        const {id, text} = req.body;
        if(!id || !text) 
            throw new invalidInputError("Resource ID and comment text are required");
        const resource = await Resource.findById(id);
        if(!resource) 
            throw new invalidInputError("Resource not found");
        const user = await User.findById(req.user.id);
        const comment = new Comment();
        comment.text = text;
        comment.user = user._id;
        comment.resource = id;
        await comment.save();
        res.status(200).json({ message: "Comment added successfully"});
    }

    async getComments(req: Request, res: Response): Promise<void> {
        if(!req.params.id) 
            throw new invalidInputError("Resource ID is required");
        const comments = await Comment.find({ resource: req.params.id});
        res.status(200).json(comments);
    }

    async editComment(req: AuthorizedRequest, res: Response): Promise<void> {
        const {id, text} = req.body;
        if(!id || !text) 
            throw new invalidInputError("Comment ID and text are required");
        const comment = await Comment.findOne({ _id: id, user: req.user.id });
        if(!comment) 
            throw new invalidInputError("Comment not found");
        comment.text = text;
        await comment.save();
        res.status(200).json({ message: "Comment updated successfully"});
    }

    async deleteComment(req: AuthorizedRequest, res: Response): Promise<void> {
        if(!req.params.id) 
            throw new invalidInputError("Comment ID is required");
        const comment = await Comment.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if(!comment) 
            throw new invalidInputError("Comment not found");
        res.status(200).json({ message: "Comment deleted successfully"});
    }

    async voteComment(req: AuthorizedRequest, res: Response): Promise<void> {
        const {id, vote} = req.body;
        if(!id || !vote) 
            throw new invalidInputError("Comment ID and vote are required");
        const comment = await Comment.findById(id);
        if(!comment) 
            throw new invalidInputError("Comment not found");
        if(vote === "up")
            comment.votes += 1;
        else if(vote === "down")
            comment.votes -= 1;
        await comment.save();
        res.status(200).json({ message: "Vote added successfully"});
    }
  
}
