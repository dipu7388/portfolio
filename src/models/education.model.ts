import mongoose from "mongoose";
import validator from "validator";

export type EducationDocument = mongoose.Document & {
  universityName: string;
  course: string;
  universityLocation: {
    address: string;
    state: string;
    country: string;
  };
  from: Date;
  to: Date;
  iscurrentUniversity: boolean;
  description: string;
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId;
      ref: "Project";
    }
  ];
};

const EducationSchema = new mongoose.Schema({
  universityName: String,
  course: String,
  universityLocation: {
    address: String,
    state: String,
    country: String,
  },
  from: Date,
  to: Date,
  iscurrentUniversity: Boolean,
  description: String,
  projects: Array,
});

export const Education = mongoose.model<EducationDocument>(
  "Education",
  EducationSchema
);
