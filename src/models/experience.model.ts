import mongoose from "mongoose";
import { Duration } from "./duration.interface";
export type ExperienceDocument = mongoose.Document & {
  companyName: string;
  position: string;
  duration: Duration;
  isPresentCompany: boolean;
  description: string;
};

const ExperienceSchema = new mongoose.Schema({
  companyName: String,
  position: String,
  duration: Object,
  isPresentCompany: Boolean,
  description: String,
});

export const Experience = mongoose.model<ExperienceDocument>(
  "Experience",
  ExperienceSchema
);
