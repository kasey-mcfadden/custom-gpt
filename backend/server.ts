import cors from 'cors';
import express, { Request, Response } from 'express';
import session from 'express-session';
import { getClient } from './openAiClient';

declare module 'express-session' {
  interface SessionData {
    messages: { role: string; content: string }[];
  }
}

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post("/chat", async (req: Request, res: Response): Promise<void> => {
  const userMessages = req.body.messages;

  if (!userMessages) {
    res.status(400).send("Invalid message format");
    console.log("400 Invalid message format");
    return;
  }

  try {
    const client = getClient();
    const result = await client.chat.completions.create({
      messages: req.body.messages,
      model: "gpt-4o",
    });
    
    const response = result.choices
      .map((choice: { message: { content: string | null } }) => choice.message.content || '')
      .join('\n');

    res.json({ response });
  } catch (err) {
    console.error("Encountered an error:", err);
    res.status(500).send("An error occurred");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
