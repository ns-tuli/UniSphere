import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY, // Get the API key from your Groq account
  dangerouslyAllowBrowser: true, // Allow this for client-side usage, but be mindful of security risks
});

export default groq;
