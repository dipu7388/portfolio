import mongoose from "mongoose";

export type CertificateDocument = mongoose.Document & {
  name: string;
  organisation: string;
  url: string;
  issueDate: Date;
};

const CertificateSchema = new mongoose.Schema({
  name: String,
  organisation: String,
  url: String,
  issueDate: Date,
});

export const Certificate = mongoose.model<CertificateDocument>(
  "Certificate",
  CertificateSchema
);
