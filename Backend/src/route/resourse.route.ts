import { Router } from "express";
import { ResourceController } from "../controller/resource/resource.controller";
import { expertGuard, loginGuard } from "../middleware/login.middleware";
import { ResourceAdminController } from "../controller/resource/resource.admin.controller";
import { upload } from "../utils/multer.utils";
import { asyncHandler } from "../middleware/asyncHandler.middleware";

export const resourceRouter = Router();

const resourceController = new ResourceController();

resourceRouter.get("/",asyncHandler(resourceController.getResources));
resourceRouter.get("/:id",asyncHandler(resourceController.getResource));
resourceRouter.get("/search/my-resource",loginGuard,asyncHandler(resourceController.myResources));
resourceRouter.post("/", loginGuard, upload.fields([
    { name: 'image', maxCount: 1 }, 
    { name: 'file', maxCount: 1 }   
]), resourceController.createResource);
resourceRouter.put("/:id",loginGuard,upload.fields([
    { name: 'image', maxCount: 1 }, 
    { name: 'file', maxCount: 1 }   
]),resourceController.updateResource);
resourceRouter.delete("/:id",loginGuard,resourceController.deleteResource);
resourceRouter.put("/vote/:id",loginGuard,resourceController.voteResource);
resourceRouter.get("/category/:type",resourceController.getByCategory);
resourceRouter.put("/bookmark/:id",loginGuard,resourceController.bookmarkResource);
resourceRouter.delete("/bookmark",loginGuard,resourceController.deleteBookmark);
resourceRouter.get("/bookmark",loginGuard,resourceController.getBookmarks);
resourceRouter.get("download/:id",resourceController.downloadResource);
// COMMENT ON RESOURCE
resourceRouter.post("/comment/:id",loginGuard,resourceController.addComment);
resourceRouter.put("/comment/:id",loginGuard,resourceController.editComment);
resourceRouter.delete("/comment/:id",loginGuard,resourceController.deleteComment);
resourceRouter.put("/comment/vote/:id",loginGuard,resourceController.voteComment);
resourceRouter.get("/comment/:id",resourceController.getComments);

// ADMIN
const adminResourceController = new ResourceAdminController();
resourceRouter.delete("/admin/:id",expertGuard,adminResourceController.deleteResourceAdmin);
resourceRouter.delete("/admin/comment/:id",expertGuard,adminResourceController.deleteCommentAdmin);

