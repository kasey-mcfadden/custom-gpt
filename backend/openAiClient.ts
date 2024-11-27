import { AzureOpenAI } from "openai";

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;
const modelDeployment = process.env.AZURE_OPENAI_MODEL_DEPLOYMENT;

let clientInstance: AzureOpenAI | null = null;

function getClient(): AzureOpenAI {
  if (!clientInstance) {
    if (!endpoint) {
      throw new Error("Missing required environment variable: AZURE_OPENAI_ENDPOINT");
    }
    if (!apiKey) {
      throw new Error("Missing required environment variable: AZURE_OPENAI_API_KEY");
    }
    if (!apiVersion) {
      throw new Error("Missing required environment variable: AZURE_OPENAI_API_VERSION");
    }
    if (!modelDeployment) {
      throw new Error("Missing required environment variable: AZURE_OPENAI_MODEL_DEPLOYMENT");
    }

    clientInstance = new AzureOpenAI({ 
      endpoint, 
      apiKey, 
      apiVersion, 
      deployment: modelDeployment 
    });
  }
  return clientInstance;
}

export { getClient };

