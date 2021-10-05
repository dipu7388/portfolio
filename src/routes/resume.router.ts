import { ResumeController } from "../controllers/resume.controller";
import express from "express";

export const resumeRoutes = (Resume: any) => {
  const resumeRouter = express.Router();
  const controller = ResumeController(Resume);
  resumeRouter.route("/").post(controller.post).get(controller.get);
  return resumeRouter;
};

const a = {
  title: "RESUME",
  email: " dheerendra.mcs16.du@gmail.com",
  workExperience: [
    {
      companyName: "Publicis sapient",
      position: "Assosiate Experence Technology Level 2",
      duration: {
        from: "17/05/2021",
      },
      isPresentCompany: true,
      description: "",
      companyUrl: "https://www.publicissapient.com/",
    },
    {
      companyName: "Libsys Ltd.",
      position: "Software Engineer",
      duration: {
        from: "02/07/2018",
        to: "14/05/2021",
      },
      description: "",
      companyUrl: "https://libsys.co.in/",
    },
  ],
  languages: [
    {
      name: "English",
      skillLavel: "PROFESSIONAL WORKING PROFICIENCY",
    },
    {
      name: "Hindi",
      skillLavel: "NATIVE OR BILINGUAL PROFICIENCY",
    },
  ],
  education: [
    {
      universityName: "UNIVERSITY OF DELHI",
      course: "M.SC. COMPUTER SCIENCE",
      universityLocation: {
        address: "New Delhi",
        state: "Delhi",
        country: "India",
      },
      duration: { from: "07/2016", to: "06/2018" },
      iscurrentUniversity: false,
      description: "",
    },
    {
      universityName: "INDIAN STATISTICAL INSTITUTE",
      course: "PGDCA",
      universityLocation: {
        address: "Kolkata",
        state: "West Bengal",
        country: "India",
      },
      duration: { from: "07/2015", to: "06/2016" },
      description: "",
    },
    {
      universityName: "INDIRA GANDHI NATIONAL OPEN UNIVERSITY",
      course: "BCA",
      universityLocation: {
        address: "Varanasi",
        state: "Uttar Pradesh",
        country: "India",
      },
      duration: { from: "07/2012", to: "06/2015" },
      description: "",
    },
    {
      universityName:
        "Board of High School and Intermediate Education Uttar Pradesh",
      course: "SENIOR SECONDARY",
      universityLocation: {
        address: "Mirzapur",
        state: "Uttar Pradesh",
        country: "India",
      },
      duration: { from: "07/2009", to: "06/2011" },
      description: "",
    },
    {
      universityName:
        "Board of High School and Intermediate Education Uttar Pradesh",
      course: "SECONDARY",
      universityLocation: {
        address: "ROBERTSGANJ",
        state: "Uttar Pradesh",
        country: "India",
      },
      duration: { from: "07/2008", to: "06/2009" },
      description: "",
    },
  ],
  projects: [
    {
      projectName: "CLASSROOM - WEB APPS FOR ACADEMIC SOLUTIONS",
      title: "CLASSROOM - WEB APPS FOR ACADEMIC SOLUTIONS",
      duration: {
        from: "01/09/2018",
        to: "31/07/2019",
      },
      description: `Gradescope Module- Provide a digital solution for evaluation of assessments.

        Email Module :- App to integrate email functionality, ease of classroom communication.`,
    },
  ],
  skills: [
    {
      skillName: "",
      tag: "",
      skillconfidenceValue: "",
    },
  ],
};
