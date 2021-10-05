import mongoose from "mongoose";
export type LanguageDocument = mongoose.Document & {
  name: string;
  skillLavel: string;
  skillValue: number;
};
const LanguageSchema = new mongoose.Schema({
  name: String,
  skillLavel: String,
  skillValue: Number,
});

export const Language = mongoose.model<LanguageDocument>(
  "Language",
  LanguageSchema
);
