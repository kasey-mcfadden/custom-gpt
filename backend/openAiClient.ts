import { AzureOpenAI } from "openai";
const dotenv = require('dotenv');

dotenv.config();

const endpoint = process.env["AZURE_OPENAI_ENDPOINT"];
const apiKey = process.env["AZURE_OPENAI_API_KEY"];
const apiVersion = "2024-05-01-preview";
const deployment = "gpt-4o"; // gpt-4, gpt-4o, etc.

let clientInstance: AzureOpenAI | null = null;

function getClient(): AzureOpenAI {
  if (!clientInstance) {
    clientInstance = new AzureOpenAI({ 
      endpoint, 
      apiKey, 
      apiVersion, 
      deployment 
    });
  }
  return clientInstance;
}

export { getClient };

