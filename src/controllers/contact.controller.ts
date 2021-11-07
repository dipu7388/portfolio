import { Request, Response } from "express";
import { Error } from "mongoose";
import { interpolateString } from "../util/helper";

export function ContactController(Contact) {
  async function post(req: Request, res: Response) {
    const contact = new Contact(req.body);
    try {
      const savedcontact = await contact.save();
      return res.status(201).send(savedcontact);
    } catch (error) {
      return res.status(400).send(error);
    }
  }
  function get(req: Request, res: Response) {
    const query = Object.create({});
    if (req.query.email) {
      query.email = req.query.email;
    }
    Contact.findOne(query, (err: Error, contactDoc: typeof Contact) => {
      if (err) {
        return res.send(err);
      }
      contactDoc.copyright = interpolateString(contactDoc.copyright, {
        year: new Date().getFullYear(),
      });
      return res.send(contactDoc);
    });
  }
  return { post, get };
}
