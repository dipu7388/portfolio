import { AboutController } from "../controllers/about.controller";
import express from "express";

export const aboutRoutes = (About: any) => {
  const aboutRouter = express.Router();
  const controller = AboutController(About);
  aboutRouter.route("/").post(controller.post).get(controller.get);
  return aboutRouter;
};
