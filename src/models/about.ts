import mongoose from "mongoose";
import validator from "validator";

export type AboutDocument = mongoose.Document & {
  title: string;
  position: string;
  desc: string;
  name: string;
  address: Address[];
  email: string;
  freelance: string;
  resumelink: string;
  age: number;
  yearOfBirth: number;
  workStarted: Date;
  yearOfExp: number;
  services: Service[];
  profilePic: string;
  mobileNumber: string;
  interestes: string[];
};

export interface Service {
  name: string;
  icon: string;
  desc: string;
}

export interface Address {
  addressType: string;
  addr: string;
  city: string;
  pincode: string;
  state: string;
  country: string;
}
const aboutSchema = new mongoose.Schema(
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
    position: String,
    desc: String,
    name: String,
    address: Array,
    freelance: String,
    resumelink: String,
    age: Number,
    yearOfBirth: Number,
    services: Array,
    profilePic: String,
    mobileNumber: String,
    workStarted: Date,
    yearOfExp: Number,
    interestes: Array,
  },
  { timestamps: true }
);

/**
 * Password hash middleware.
 */
aboutSchema.pre("save", function save(next) {
  const user = this as AboutDocument;
  if (user.yearOfBirth) {
    user.age = new Date().getFullYear() - +user.yearOfBirth;
  }
  next();
});

export const About = mongoose.model<AboutDocument>("About", aboutSchema);
