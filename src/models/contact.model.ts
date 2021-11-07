import mongoose from "mongoose";
import validator from "validator";

export type ContactDocument = mongoose.Document & {
  title: string;
  subHeading: string;
  desc: string;
  mobileNumber: string;
  address: string;
  email: string;
  socialLinks: SocialLink[];
  copyright: string;
};

export interface SocialLink {
  name: string;
  icon: string;
  url: string;
}

const contactSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    title: String,
    subHeading: String,
    desc: String,
    mobileNumber: String,
    address: String,
    socialLinks: Array,
    copyright: String,
  },
  { timestamps: true }
);

export const Contact = mongoose.model<ContactDocument>(
  "Contact",
  contactSchema
);
