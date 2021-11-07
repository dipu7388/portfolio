import { Request, Response } from "express";
import { Error } from "mongoose";
import { interpolateString } from "../util/helper";

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
    About.findOne(query, (err: Error, aboutDoc: typeof About) => {
      if (err) {
        return res.send(err);
      }
      if (aboutDoc.workStarted) {
        const workStartDate = new Date(aboutDoc.workStarted);
        let year = new Date().getFullYear() - workStartDate.getFullYear();
        let months = new Date().getMonth() + 12 - workStartDate.getMonth();
        year += parseInt(months / 12 + "");
        months = months % 12;
        year += months / 10;
        year = +year.toFixed(1);
        aboutDoc.desc = interpolateString(aboutDoc.desc, {
          yearOfExp: year,
        });
      }
      return res.send(aboutDoc);
    });
  }
  return { post, get };
}
