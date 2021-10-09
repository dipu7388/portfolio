import mongoose from "mongoose";
import { Duration } from "./duration.interface";
export type ExperienceDocument = mongoose.Document & {
  companyName: string;
  companyUrl: string;
  position: string;
  duration: Duration;
  isPresentCompany: boolean;
  description: string;
  location: string;
};

const ExperienceSchema = new mongoose.Schema({
  companyName: String,
  companyUrl: String,
  position: String,
  duration: Object,
  isPresentCompany: Boolean,
  description: String,
});

export const Experience = mongoose.model<ExperienceDocument>(
  "Experience",
  ExperienceSchema
);
