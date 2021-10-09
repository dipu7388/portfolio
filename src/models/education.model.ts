import mongoose from "mongoose";
import validator from "validator";

export type EducationDocument = mongoose.Document & {
  universityName: string;
  course: string;
  universityLocation: {
    address: string;
    state: string;
    country: string;
    universityUrl: string;
  };
  duration: {
    from: Date;
    to: Date;
    duration: string;
  };
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
    universityUrl: String,
  },
  duration: {
    from: Date,
    to: Date,
    duration: String,
  },
  iscurrentUniversity: Boolean,
  description: String,
  projects: Array,
});

export const Education = mongoose.model<EducationDocument>(
  "Education",
  EducationSchema
);
