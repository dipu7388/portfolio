import mongoose from "mongoose";
import validator from "validator";

export type ResumeDocument = mongoose.Document & {
  title: string;
  email: string;
  workExperience: [
    {
      type: mongoose.Schema.Types.ObjectId;
      ref: "Experience";
    }
  ];
  languages: [
    {
      type: mongoose.Schema.Types.ObjectId;
      ref: "Language";
    }
  ];
  certificates: [
    {
      type: mongoose.Schema.Types.ObjectId;
      ref: "Certificate";
    }
  ];
  education: [
    {
      type: mongoose.Schema.Types.ObjectId;
      ref: "Education";
    }
  ];
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId;
      ref: "Project";
    }
  ];
  skills: [
    {
      type: mongoose.Schema.Types.ObjectId;
      ref: "Skill";
    }
  ];
};

const resumeSchema = new mongoose.Schema(
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
    workExperience: Array,
    certificates: Array,
    languages: Array,
    education: Array,
    projects: Array,
    skills: Array,
  },
  { timestamps: true }
);

/**
 * Password hash middleware.
 */
resumeSchema.pre("save", function save(next) {
  const user = this as ResumeDocument;

  next();
});

export const Resume = mongoose.model<ResumeDocument>("Resume", resumeSchema);
