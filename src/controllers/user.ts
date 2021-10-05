import async from "async";
import crypto from "crypto";
import nodemailer from "nodemailer";
import passport from "passport";
import { User, UserDocument, AuthToken } from "../models/User";
import { Request, Response, NextFunction } from "express";
import { IVerifyOptions } from "passport-local";
import { WriteError } from "mongodb";
import { check, sanitize, validationResult } from "express-validator";
import "../config/passport";
import { setReply } from "../util/helper";

/**
 * POST /login
 * Sign in using email and password.
 */
export const postLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await check("email", "Email is not valid").isEmail().run(req);
  await check("password", "Password cannot be blank")
    .isLength({ min: 1 })
    .run(req);
  await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send(setReply("errors", errors));
  }

  passport.authenticate(
    "local",
    (err: Error, user: UserDocument, info: IVerifyOptions) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).send(setReply("errors", info.message));
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.send(setReply("success", "Success! You are logged in."));
      });
    }
  )(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
export const logout = (req: Request, res: Response) => {
  req.logout();
  res.sendStatus(200);
};

/**
 * POST /signup
 * Create a new local account.
 */
export const postSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash("errors", errors.array());
    return res.status(400).send(setReply("errors", errors));
  }

  const user = new User({
    ...req.body,
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      return res
        .status(400)
        .send(
          setReply("errors", "Account with that email address already exists.")
        );
    }
    user.save((err, savedUser) => {
      if (err) {
        return next(err);
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.send(savedUser);
      });
    });
  });
};

/**
 * POST /account/profile
 * Update profile information.
 */
export const postUpdateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await check("email", "Please enter a valid email address.")
    .isEmail()
    .run(req);
  await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send(setReply("errors", errors));
  }

  const user = req.user as UserDocument;
  User.findById(user.id, async (err, user: UserDocument) => {
    if (err) {
      return next(err);
    }
    user.email = req.body.email || "";
    user.profile.name = req.body.name || "";
    user.profile.gender = req.body.gender || "";
    user.profile.location = req.body.location || "";
    user.profile.website = req.body.website || "";
    await user.save();
    res.send(user);
  });
};

/**
 * POST /account/password
 * Update current password.
 */
export const postUpdatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await check("password", "Password must be at least 4 characters long")
    .isLength({ min: 4 })
    .run(req);
  await check("confirmPassword", "Passwords do not match")
    .equals(req.body.password)
    .run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send(setReply("errors", errors));
  }

  const user = req.user as UserDocument;
  User.findById(user.id, async (err, user: UserDocument) => {
    if (err) {
      return next(err);
    }
    user.password = req.body.password;
    try {
      await user.save();
      res.send(setReply("success", "Password has been changed."));
    } catch (error) {
      return next(err);
    }
  });
};

/**
 * POST /account/delete
 * Delete user account.
 */
export const postDeleteAccount = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as UserDocument;
  User.remove({ _id: user.id }, (err) => {
    if (err) {
      return next(err);
    }
    req.logout();
    res.send(setReply("info", "Your account has been deleted."));
  });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
export const getOauthUnlink = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const provider = req.params.provider;
  const user = req.user as UserDocument;
  User.findById(user.id, (err, user: any) => {
    if (err) {
      return next(err);
    }
    user[provider] = undefined;
    user.tokens = user.tokens.filter(
      (token: AuthToken) => token.kind !== provider
    );
    user.save((err: WriteError) => {
      if (err) {
        return next(err);
      }
      res.send(setReply("info", `${provider} account has been unlinked.`));
    });
  });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
export const getReset = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return res.sendStatus(400);
  }
  User.findOne({ passwordResetToken: req.params.token })
    .where("passwordResetExpires")
    .gt(Date.now())
    .exec((err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res
          .status(400)
          .send(
            setReply(
              "errors",
              "Password reset token is invalid or has expired."
            )
          );
      }
      return res.sendStatus(200);
    });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
export const postReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await check("password", "Password must be at least 4 characters long.")
    .isLength({ min: 4 })
    .run(req);
  await check("confirm", "Passwords must match.")
    .equals(req.body.password)
    .run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash("errors", errors.array());
    return res.status(400).send(setReply("errors", errors));
  }

  async.waterfall(
    [
      function resetPassword(done: (err?, user?) => unknown) {
        User.findOne({ passwordResetToken: req.params.token })
          .where("passwordResetExpires")
          .gt(Date.now())
          .exec((err, user: any) => {
            if (err) {
              return next(err);
            }
            if (!user) {
              return res
                .status(400)
                .send(
                  setReply(
                    "errors",
                    "Password reset token is invalid or has expired."
                  )
                );
            }
            user.password = req.body.password;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            user.save((err: WriteError) => {
              if (err) {
                return next(err);
              }
              req.logIn(user, (err) => {
                done(err, user);
              });
            });
          });
      },
      function sendResetPasswordEmail(
        user: UserDocument,
        done: (err?) => unknown
      ) {
        const transporter = nodemailer.createTransport({
          service: "SendGrid",
          auth: {
            user: process.env.SENDGRID_USER,
            pass: process.env.SENDGRID_PASSWORD,
          },
        });
        const mailOptions = {
          to: user.email,
          from: "express-ts@starter.com",
          subject: "Your password has been changed",
          text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`,
        };
        transporter.sendMail(mailOptions, (err) => {
          done(err);
        });
      },
    ],
    (err) => {
      if (err) {
        return next(err);
      }
      res.sendStatus(200);
    }
  );
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
export const postForgot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await check("email", "Please enter a valid email address.")
    .isEmail()
    .run(req);
  await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send(setReply("errors", errors));
  }

  async.waterfall(
    [
      function createRandomToken(done: (err?, token?) => unknown) {
        crypto.randomBytes(16, (err, buf) => {
          const token = buf.toString("hex");
          done(err, token);
        });
      },
      function setRandomToken(
        token: AuthToken,
        done: (err, token?, user?) => unknown
      ) {
        User.findOne({ email: req.body.email }, (err, user: any) => {
          if (err) {
            return done(err);
          }
          if (!user) {
            req.flash("errors", {
              msg: "Account with that email address does not exist.",
            });
            return res.redirect("/forgot");
          }
          user.passwordResetToken = token;
          user.passwordResetExpires = Date.now() + 3600000; // 1 hour
          user.save((err: WriteError) => {
            done(err, token, user);
          });
        });
      },
      function sendForgotPasswordEmail(
        token: AuthToken,
        user: UserDocument,
        done: (err) => unknown
      ) {
        const transporter = nodemailer.createTransport({
          service: "SendGrid",
          auth: {
            user: process.env.SENDGRID_USER,
            pass: process.env.SENDGRID_PASSWORD,
          },
        });
        const mailOptions = {
          to: user.email,
          from: "hackathon@starter.com",
          subject: "Reset your password on Hackathon Starter",
          text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://${req.headers.host}/reset/${token}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };
        transporter.sendMail(mailOptions, (err) => {
          req.flash("info", {
            msg: `An e-mail has been sent to ${user.email} with further instructions.`,
          });
          done(err);
        });
      },
    ],
    (err) => {
      if (err) {
        return next(err);
      }
      res.sendStatus(200);
    }
  );
};
