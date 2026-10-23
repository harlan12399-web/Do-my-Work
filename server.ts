import dns from 'dns';
// Force IPv4 resolution to prevent IPv6 gateway timeouts in container environments
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Worksheet Solver Endpoint
app.post('/api/solve-worksheet', async (req, res) => {
  const {
    textPrompt,
    studentName = 'Scholar',
    studentYear = 'Year 11',
    studentAge = 16,
    studentGender = 'boy',
  } = req.body;

  const todayDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  if (!textPrompt || !textPrompt.trim()) {
    return res.status(400).json({ error: 'Please enter or paste your worksheet questions.' });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured.');
    }

    const systemInstruction = `You are an elite, flawless academic solver and worksheet completion engine for "Do My Work".
The student submitting this worksheet is:
- Student Name: "${studentName}"
- Academic Year / Grade: "${studentYear}"
- Age: ${studentAge}
- Today's Date: "${todayDate}"

Your mission:
1. Thoroughly parse every single question, equation, problem, or blank from the submitted worksheet text.
2. Solve every problem with 100% precision.
3. For math / physics / chemistry: solve equations completely, provide the exact final simplified answer, and concise step work.
4. For science / humanities / reading: provide direct, accurate answers and concise context.
5. In 'formattedCopyText', format a clean, ready-to-copy plain text block containing every question number and its direct answer.`;

    const promptText = `Solve all of these worksheet questions completely with accurate answers for student ${studentName} (${studentYear}):

${textPrompt.trim()}

Return a valid JSON object matching the schema.`;

    // Try gemini-3.5-flash-lite first (fastest and reliable), with fallback to gemini-3.8-flash
    let rawJson = '';

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: promptText,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subject: { type: Type.STRING },
              gradeLevel: { type: Type.STRING },
              summary: { type: Type.STRING },
              formattedCopyText: { type: Type.STRING },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.INTEGER },
                    questionNumber: { type: Type.STRING },
                    questionText: { type: Type.STRING },
                    answer: { type: Type.STRING },
                    workings: { type: Type.STRING },
                  },
                  required: ['id', 'questionNumber', 'questionText', 'answer'],
                },
              },
            },
            required: ['title', 'subject', 'items', 'formattedCopyText'],
          },
        },
      });
      rawJson = response.text?.trim() || '';
    } catch (modelErr: any) {
      console.warn('Retrying with gemini-3.8-flash:', modelErr?.message);
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });
      rawJson = response.text?.trim() || '';
    }

    let parsedData: any;
    try {
      parsedData = JSON.parse(rawJson);
    } catch (parseErr) {
      const cleaned = rawJson.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    parsedData.studentName = studentName;
    parsedData.date = todayDate;

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Worksheet solver error:', error?.message);
    return res.status(500).json({
      error: error?.message || 'Failed to solve worksheet questions. Please try again.',
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[Do My Work] Server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
