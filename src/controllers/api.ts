"use strict";

import graph from "fbgraph";
import express from "express";
import { Response, Request, NextFunction } from "express";
import { UserDocument } from "../models/User";
import { UserRouter } from "../routes/user.router";
import { aboutRoutes } from "../routes/about.router";
import { About } from "../models/about";
import { Resume } from "../models/resume.model";
import { resumeRoutes } from "../routes/resume.router";
import { Contact } from "../models/contact.model";
import { contactRoutes } from "../routes/contact.router";
const AboutRoutes = aboutRoutes(About);
const ContactRoutes = contactRoutes(Contact);
const ResumeRoutes = resumeRoutes(Resume);

const router = express.Router();
/**
 * GET /api
 * List of API examples.
 */
export const getApi = (req: Request, res: Response) => {
  res.send("Hi There!!, Hope you doing  well");
};
/**
 * GET /api/facebook
 * Facebook API example.
 */
export const getFacebook = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as UserDocument;
  const token = user.tokens.find((token: any) => token.kind === "facebook");
  graph.setAccessToken(token.accessToken);
  graph.get(
    `${user.facebook}?fields=id,name,email,first_name,last_name,gender,link,locale,timezone`,
    (err: Error, results: graph.FacebookUser) => {
      if (err) {
        return next(err);
      }
      res.render("api/facebook", {
        title: "Facebook API",
        profile: results,
      });
    }
  );
};
router.get("/", getApi);
router.use("/user", UserRouter);
router.use("/about", AboutRoutes);
router.use("/resume", ResumeRoutes);
router.use("/contact", ContactRoutes);
export const ApiRouter = router;
