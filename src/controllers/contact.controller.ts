import { Request, Response } from "express";
import { Error } from "mongoose";

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
    Contact.findOne(
      query,
      (err: Error, contactDoc: { toJSON: () => any; _id: any }) => {
        if (err) {
          return res.send(err);
        }
        return res.send(contactDoc);
      }
    );
  }
  return { post, get };
}
