const jwt = require("jsonwebtoken");
const express = require("express");
const resumeRouter = express.Router();
const axios = require("axios");
const pdfText = require("pdf-text");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { ApplicantModel } = require("../database/applicantModel");

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// convert to JSON from text
function extractJsonFromText(text) {
  // find json in the text using regex
  const jsonMatch = text.match(/(\{[\s\S]*\})/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      throw new Error(`Invalid JSON format: ${error.message}`);
    }
  }
  throw new Error("No JSON structure found in response");
}

// function to structure resume data using gemini ai
async function structureResumeData(extractedText) {
  const prompt = `Analyze this resume and return STRICT JSON format ONLY. Follow this structure EXACTLY:
    {
      "name": "Full Name",
      "email": "email@domain.com",
      "education": {
        "degree": "Degree Name",
        "branch": "Field of Study",
        "institution": "School Name",
        "year": "Graduation Year"
      },
      "experience": [
        {
          "job_title": "Position Name",
          "company": "Company Name",
          "start_date": "YYYY-MM",
          "end_date": "YYYY-MM"
        }
      ],
      "skills": ["Skill1", "Skill2"],
      "summary": "3-4 sentence professional summary"
    }

    RULES:
    1. Return ONLY the JSON object
    2. No additional text or explanations
    3. Use empty strings for missing fields
    4. Maintain this exact structure

    Resume Text:
    ${extractedText.substring(0, 4000)} [truncated if too long]`;
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean response
    const cleaned = text
      // remove unwanted json keywords
      .replace(/json|JSON|/gi, "")
      // remove json prefix
      .replace(/^json\s*/i, "")
      .trim();

    return extractJsonFromText(cleaned);
  } catch (error) {
    console.error("Structure Error:", error);
    throw new Error(`Gemini processing failed: ${error.message}`);
  }
}

// Updated route handler
resumeRouter.post("/add", async (req, res) => {
  try {
    const { url } = req.body;
    // check if url is missing
    if (!url) return res.status(400).json({ error: "URL required" });
    const response = await axios.get(url, { responseType: "arraybuffer" });

    // extracting text from PDF
    pdfText(response.data, async (err, chunks) => {
      if (err) {
        console.error("PDF Error:", err);
        return res.status(500).json({ error: "PDF processing failed" });
      }

      try {
        const extractedText = chunks.join(" ");
        const structuredData = await structureResumeData(extractedText);

        // Validate critical fields
        if (!structuredData.email || !structuredData.name) {
          throw new Error("Missing required fields in parsed data");
        }

        // Check if email already exists in the database
        const existingApplicant = await ApplicantModel.findOne({
          email: structuredData.email,
        });
        if (existingApplicant) {
          return res.status(409).json({ error: "Email already exists" });
        }

        //creating new document
        const applicant = new ApplicantModel({
          ...structuredData,
          experience: Array.isArray(structuredData.experience)
            ? structuredData.experience
            : [],
          skills: Array.isArray(structuredData.skills)
            ? structuredData.skills
            : [],
        });

        // saving document in database
        await applicant.save();
        res.status(200).json(applicant);
      } catch (error) {
        console.error("Processing Error:", error);
        res.status(500).json({
          error: "Resume processing failed",
          details: error.message,
          stage: "data-processing",
        });
      }
    });
  } catch (error) {
    console.error("Route Error:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
      stage: "request-handling",
    });
  }
});

// // New route for searching resumes by name
resumeRouter.get("/search", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name query required" });

    // search for matching records in the database
    const regex = new RegExp(name, "i");
    const matchingRecords = await ApplicantModel.find({ name: regex });

    if (matchingRecords.length === 0) {
      return res.status(404).json({ error: "No matching records found" });
    }

    res.status(200).json(matchingRecords);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({
      error: "Server error during search",
      details: error.message,
    });
  }
});

module.exports = { resumeRouter };
