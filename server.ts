import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "15mb" })); // allow generous payload for reports/images
const PORT = 3001;

const apiKey = process.env.GEMINI_API_KEY;

// Lazy init the Gemini client
let ai: GoogleGenAI | null = null;
function getGemini() {
  if (!ai) {
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY env is not set. AI features might fail.");
    }
    ai = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

// 1. Symptom Checker API with JSON Schema
app.post("/api/check-symptoms", async (req, res) => {
  try {
    const { symptoms, patientAge, gender } = req.body;
    if (!symptoms) {
      return res.status(400).json({ error: "Symptoms description is required" });
    }

    const client = getGemini();
    const systemPrompt = `You are an expert clinical triage assistant. Based on patient symptoms, age and gender, provide an informational, accurate triage summary. 
IMPORTANT SAFETY RULES:
- Frame everything as general informational data, never diagnostic certainties.
- Maintain a compassionate, objective tone.
- Match symptoms to one of these specializations only: "General Medicine", "Pediatrics", "Cardiology", "Dermatology", "Neurology", "Orthopedics", "Psychiatry", "Ophthalmology".
- Classify urgency as: "Low", "Medium", "High", or "Critical".
- Provide 3 self-care tips.
`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Patient Details: Age: ${patientAge}, Gender: ${gender}. Symptoms reported: "${symptoms}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["specialty", "urgency", "analysis", "selfCare", "matchReasoning"],
          properties: {
            specialty: {
              type: Type.STRING,
              description: "The most logical matching department/specialist to consult.",
            },
            urgency: {
              type: Type.STRING,
              description: "Triage urgency score: 'Low' (rest), 'Medium' (consult doctor), 'High' (urgent clinic visit), 'Critical' (ER/911)",
            },
            analysis: {
              type: Type.STRING,
              description: "A patient-friendly explanation of why these symptoms manifest, clearly noting this is for education only.",
            },
            selfCare: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Three helpful, immediate self-care practices or things to monitor.",
            },
            matchReasoning: {
              type: Type.STRING,
              description: "Brief clinician-level reasoning for department referral.",
            }
          }
        }
      }
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (err: any) {
    console.error("Symptom Checker Error:", err);
    res.status(500).json({ error: err.message || "Failed to analyze symptoms" });
  }
});

// 2. Chat Support API
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const client = getGemini();
    const formattedHistory = messages.map(m => 
      `${m.sender === "user" ? "Patient" : "Support AI"}: ${m.text}`
    ).join("\n");

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `You are 'Aura', a professional medical website concierge at Apex Health Clinic. Your duty is to guide patient queries regarding specialties, doctor availability, appointment prep, or general health hygiene in a professional, warm, concise, and articulate manner. Do not diagnose or prescribe medicine. Limit response to 3-4 sentences.

History:
${formattedHistory}
Support AI:`,
    });

    res.json({ reply: response.text || "I am here to assist with any clinic directions or scheduling. How can I help?" });
  } catch (err: any) {
    console.error("Chat Error:", err);
    res.status(500).json({ error: err.message || "concierge failed to reply" });
  }
});

// 3. Summarize Medical Report API (Translates complicated files into simple breakdowns)
app.post("/api/summarize-report", async (req, res) => {
  try {
    const { reportText, filename } = req.body;
    if (!reportText) {
      return res.status(400).json({ error: "Report text or content is required" });
    }

    const client = getGemini();
    const systemInstructions = `You are a patient-centered translational physician. Analyze clinical lab results, radiology logs, scan feedback or diagnostic summaries.
Formulate a translation into simple English for patients. 
- Highlight key readings as "Normal", "Under investigation", or "Action Required". 
- Translate core Latin medical terms elegantly. 
- Lay down next protective actions.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Analyze the medical document details here. File is named: "${filename || 'report.txt'}". Content:\n\n${reportText}`,
      config: {
        systemInstruction: systemInstructions,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["summary", "keyMetrics", "nextSteps", "clinicalVocabulary"],
          properties: {
            summary: {
              type: Type.STRING,
              description: "A supportive, comforting, simple English overall interpretation of the scan or test results.",
            },
            keyMetrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["metric", "value", "status", "comment"],
                properties: {
                  metric: { type: Type.STRING, description: "Metric name, e.g. HbA1c, LDL Cholesterol, Left Ventricle Wall Rate" },
                  value: { type: Type.STRING, description: "Observed value with reference, e.g., 6.2% (Normal range < 5.7%)" },
                  status: { type: Type.STRING, description: "Classification: 'Optimal', 'Borderline', 'Attention Needed'" },
                  comment: { type: Type.STRING, description: "Actionable observation for the metric in plain language of what it means." }
                }
              }
            },
            nextSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Step-by-step advice e.g. contact specific expert, follow-up timelines, dietary checks, or repeat tests."
            },
            clinicalVocabulary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["latinWord", "simpleTranslation", "explanation"],
                properties: {
                  latinWord: { type: Type.STRING, description: "The medical keyword, e.g. Hypercholesterolemia, Erythema, Arrhythmia" },
                  simpleTranslation: { type: Type.STRING, description: "Standard plain terms, e.g., High Blood cholesterol, Skin redness, Irregular heart rate" },
                  explanation: { type: Type.STRING, description: "What that condition represents biologically in simple non-threatening words." }
                }
              },
              description: "Glossary of clinical terminology present in the text of the report."
            }
          }
        }
      }
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (err: any) {
    console.error("Report Summary Error:", err);
    res.status(500).json({ error: err.message || "Failed to parse report" });
  }
});

// 4. Smart Prescription Formatter API
app.post("/api/smart-prescription", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Prescription text is required" });
    }

    const client = getGemini();
    const systemPrompt = "Read handwritten or shorthand clinical prescriptions and convert them into beautifully structured digital guidelines.";

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Convert the following list of medicine shorthand notes into formatted guidelines:\n"${text}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["diagnosis", "medicines"],
          properties: {
            diagnosis: { type: Type.STRING, description: "Inferred medical condition / primary symptom targeted" },
            medicines: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["name", "dosage", "frequency", "duration", "instructions"],
                properties: {
                  name: { type: Type.STRING, description: "Medicine name" },
                  dosage: { type: Type.STRING, description: "e.g., 500mg, 1 tablet, 5ml" },
                  frequency: { type: Type.STRING, description: "e.g., Twice daily, Once in morning before meals, PRN (As needed)" },
                  duration: { type: Type.STRING, description: "e.g., 5 days, 1 month, Chronic" },
                  instructions: { type: Type.STRING, description: "e.g., Take with plenty of water, avoid dairy, may cause drowsiness" }
                }
              }
            }
          }
        }
      }
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (err: any) {
    console.error("Smart Prescription Error:", err);
    res.status(500).json({ error: err.message || "Failed to process prescription" });
  }
});


// Serve static assets in production, otherwise mount Vite Express middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Serve index.html for React SPA
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running on http://localhost:${PORT}`);
  });
}

startServer();
