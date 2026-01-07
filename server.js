import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY; // secure

app.post("/generate", async (req, res) => {
  const prompt = req.body.prompt || "Hello! Generate a friendly greeting.";

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({ prompt: { text: prompt } })
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

const PORT = process.env.PORT || 10000; // Render uses dynamic PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
