import { ContactController } from "../controllers/contact.controller";
import express from "express";

export const contactRoutes = (Contact: any) => {
  const contactRouter = express.Router();
  const controller = ContactController(Contact);
  contactRouter.route("/").post(controller.post).get(controller.get);
  return contactRouter;
};
