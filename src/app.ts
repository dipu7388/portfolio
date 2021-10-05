import express from "express";
import compression from "compression"; // compresses requests
import session from "express-session";
import lusca from "lusca";
import flash from "express-flash";
import bluebird from "bluebird";
import mongoose from "mongoose";
import passport from "passport";
import MongoStore from "connect-mongo";
import cors from "cors";
import frameguard from "frameguard";

import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";

// API keys and Passport configuration
import * as passportConfig from "./config/passport";
// Controllers (route handlers)
import * as apiController from "./controllers/api";

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

mongoose
  .connect(mongoUrl)
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
  })
  .catch((err) => {
    console.log(
      "MongoDB connection error. Please make sure MongoDB is running. " + err
    );
    // process.exit();
  });

// Express configuration
app.set("port", process.env.PORT || 3000);
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());
app.use(compression());

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: MongoStore.create({
      mongoUrl: mongoUrl,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe("http://localhost:4200"));
app.use(lusca.xssProtection(true));
app.use(frameguard({ action: "DENY" }));
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use(
  cors({
    origin: "*",
  })
);

/**
 * Primary app routes.
 */

/**
 * API examples routes.
 */
app.get(
  "/api/facebook",
  passportConfig.isAuthenticated,
  passportConfig.isAuthorized,
  apiController.getFacebook
);
app.use("/api", apiController.ApiRouter);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email", "public_profile"] })
);
app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    // res.redirect(req.session.returnTo || "/");
  }
);

export default app;
