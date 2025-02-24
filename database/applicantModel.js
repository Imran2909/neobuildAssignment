const mongoose = require("mongoose");

// Define the education schema
const educationSchema =  mongoose.Schema({
  degree: { type: String},
  branch: { type: String},
  institution: { type: String},
  year: { type: String},
});

// Define the experience schema
const experienceSchema =  mongoose.Schema({
  job_title: { type: String},
  company: { type: String},
  start_date: { type: String},
  end_date: { type: String},
});

// Define the applicant schema
const applicantSchema =  mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  education: { type: educationSchema, required: true },
  experience: { type: [experienceSchema], required: true },
  skills: { type: [String], required: true },
  summary: { type: String, },
});

// Create the Applicant model
const ApplicantModel = mongoose.model("Applicant", applicantSchema);

module.exports = {
  ApplicantModel,
};