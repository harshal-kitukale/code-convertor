const express = require("express");
require("dotenv").config(); // Load environment variables from .env file
const cors = require("cors");
const app = express();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const PORT = process.env.PORT || 8000;

app.use(cors()); 
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY);
// Endpoint to handle code conversion
app.get("/", (req, res) => {
  res.json("server is healthy");
});

app.post("/convert", async (req, res) => {
  const { code, toLanguage } = req.body;
  if (!code || !toLanguage) {
    return res
      .status(400)
      .json({ error: "Invalid request. Please provide code" });
  }
 
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `Convert this code to ${toLanguage}: ${code}`;
    
    const result = await model.generateContent(prompt);
    const codeData=result.response.text();
    
    // const convertedCode = response.data.choices[0].text.trim();
    return res.status(200).json({ codeData});
  } catch (error) {
    console.error("Error converting code:", error.message);

    res.status(500).json({ error: "Failed to convert code",status:500 });
  }
});
app.post("/debug", async (req, res) => {
  const { code } = req.body;
  console.log(code);
  if (!code) {
    return res
      .status(400)
      .json({ error: "Invalid request. Please provide code" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `debug this code ${code}`;
     
    const result = await model.generateContent(prompt);
    const codeData=result.response.text();
    
    // const convertedCode = response.data.choices[0].text.trim();
    return res.status(200).json({ codeData});
  } catch (error) {
    console.error("Error bebugging code:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
    res.status(500).json({ error: "Failed to debug code",status:500 });
  }
});
app.post("/check", async (req, res) => {
  const { code } = req.body;
  console.log(code);
  if (!code) {
    return res
      .status(400)
      .json({ error: "Invalid request. Please provide code" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `quality check this code ${code}`;
     
    const result = await model.generateContent(prompt);
    const codeData=result.response.text();
    
    // const convertedCode = response.data.choices[0].text.trim();
    return res.status(200).json({ codeData});
  } catch (error) {
    console.error("Error quality checking:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
    res.status(500).json({ error: "Failed to quality check",status:500 });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
