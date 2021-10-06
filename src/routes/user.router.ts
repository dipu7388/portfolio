// API keys and Passport configuration
import * as passportConfig from "../config/passport";
// Controllers (route handlers)
import * as userController from "../controllers/user";

import express from "express";

const router = express.Router();

router.post("/login", userController.postLogin);
router.get("/logout", userController.logout);
router.post("/forgot", userController.postForgot);
router.get("/reset/:token", userController.getReset);
router.post("/reset/:token", userController.postReset);
router.post("/signup", userController.postSignup);
router.post(
  "/account/profile",
  passportConfig.isAuthenticated,
  userController.postUpdateProfile
);
router.post(
  "/account/password",
  passportConfig.isAuthenticated,
  userController.postUpdatePassword
);
router.post(
  "/account/delete",
  passportConfig.isAuthenticated,
  userController.postDeleteAccount
);
router.get(
  "/account/unlink/:provider",
  passportConfig.isAuthenticated,
  userController.getOauthUnlink
);

export const UserRouter = router;
