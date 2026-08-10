const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/evaluate", async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        message: "Question and answer are required",
      });
    }

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: [
        {
          role: "system",
          content:
            "You are an interview evaluator. Evaluate the candidate's answer fairly and constructively.",
        },
        {
          role: "user",
          content: `
Question:
${question}

Candidate Answer:
${answer}

Return ONLY valid JSON:

{
  "score": 0,
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "feedback": "short overall feedback"
}

Score must be between 0 and 100.
`,
        },
      ],
    });

    const result = JSON.parse(response.output_text);

    res.json(result);
  } catch (error) {
    console.error("AI Evaluation Error:", error);

    res.status(500).json({
      message: "AI evaluation failed",
    });
  }
});

module.exports = router;