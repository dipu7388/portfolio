import { Request, Response } from "express";
import { Error } from "mongoose";

export function ResumeController(Resume) {
  async function post(req: Request, res: Response) {
    const resume = new Resume(req.body);
    try {
      const savedresume = await resume.save();
      return res.status(201).send(savedresume);
    } catch (error) {
      return res.status(400).send(error);
    }
  }
  function get(req: Request, res: Response) {
    const query = Object.create({});
    if (req.query.email) {
      query.email = req.query.email;
    }
    Resume.findOne(
      query,
      (err: Error, resumeDoc: { toJSON: () => any; _id: any }) => {
        if (err) {
          return res.send(err);
        }
        return res.send(resumeDoc);
      }
    );
  }
  return { post, get };
}
