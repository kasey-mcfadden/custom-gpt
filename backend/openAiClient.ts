import { AzureOpenAI } from "openai";

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;
const modelDeployment = process.env.AZURE_OPENAI_MODEL_DEPLOYMENT;

let clientInstance: AzureOpenAI | null = null;

function getClient(): AzureOpenAI {
  if (!clientInstance) {
    if (!endpoint || !apiKey) {
      throw new Error("Missing required environment variables: AZURE_OPENAI_ENDPOINT or AZURE_OPENAI_API_KEY");
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

