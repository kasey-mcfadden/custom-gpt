import cors from 'cors';
import express, { Request, Response } from 'express';
import { getClient } from './openAiClient';

const isLocal = process.env.NODE_ENV === "development";

if (isLocal) {
  console.log("Running in development mode. Loading .env file...");
  require("dotenv").config();
}

const app = express();
const port = process.env.PORT;
const allowedOrigins = [process.env.FRONTEND_URL]

app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

declare module 'express-session' {
  interface SessionData {
    messages: { role: string; content: string }[];
  }
}

app.post("/chat", async (req: Request, res: Response): Promise<void> => {
  const userMessages = req.body.messages;

  if (!userMessages) {
    console.log(`[400] Invalid message format: ${JSON.stringify(req.body)}`);
    res.status(400).send("Invalid message format");
    return;
  }

  try {
    const client = getClient();
    const result = await client.chat.completions.create({
      messages: req.body.messages,
      model: `${process.env.AZURE_OPENAI_MODEL_DEPLOYMENT}`,
    });
    
    const response = result.choices
      .map((choice: { message: { content: string | null } }) => choice.message.content || '')
      .join('\n');

    res.json({ response });
  } catch (err) {
    console.error(`[500] Error occurred: ${err}`);
    res.status(500).send("An internal server error occurred");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
