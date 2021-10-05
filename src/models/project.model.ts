import mongoose from "mongoose";
import { Duration } from "./duration.interface";
export type ProjectDocument = mongoose.Document & {
  projectName: string;
  title: string;
  duration: Duration;
  description: string;
};

const ProjectSchema = new mongoose.Schema({
  projectName: String,
  title: String,
  duration: Object,
  description: String,
});

export const Project = mongoose.model<ProjectDocument>(
  "Project",
  ProjectSchema
);
