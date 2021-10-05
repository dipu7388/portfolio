import { Request, Response } from "express";
import { Error } from "mongoose";

export function AboutController(About) {
  async function post(req: Request, res: Response) {
    const about = new About(req.body);
    try {
      const savedabout = await about.save();
      return res.status(201).send(savedabout);
    } catch (error) {
      return res.status(400).send(error);
    }
  }
  function get(req: Request, res: Response) {
    const query = Object.create({});
    if (req.query.email) {
      query.email = req.query.email;
    }
    About.findOne(
      query,
      (err: Error, aboutDoc: { toJSON: () => any; _id: any }) => {
        if (err) {
          return res.send(err);
        }
        return res.send(aboutDoc);
      }
    );
  }
  return { post, get };
}
