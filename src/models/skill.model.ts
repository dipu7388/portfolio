import mongoose from "mongoose";

export type SkillDocument = mongoose.Document & {
  skillName: string;
  tag: string[];
  skillconfidenceValue: number;
};

const skillSchema = new mongoose.Schema({
  skillName: String,
  tag: Array,
  skillconfidenceValue: Number,
});

export const Skill = mongoose.model<SkillDocument>("Skill", skillSchema);
