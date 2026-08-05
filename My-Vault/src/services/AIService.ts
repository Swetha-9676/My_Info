import * as FileSystem from 'expo-file-system/legacy';

const API_KEY = "A...................";

export class AIService {
  static async generateResponse(query: string, context: string): Promise<string> {
    if (!API_KEY || API_KEY === "YOUR_API_KEY" || API_KEY === "") {
      return "⚠️ API Key Missing: Please add your Gemini API Key in src/services/AIService.ts.";
    }

    try {
      const prompt = `
        You are a Personal Document Assistant. Use the following snippets from the user's documents to answer their query.
        If the answer is not in the context, say you don't know based on the documents.
        Summarize the information in a concise, friendly manner.

        CONTEXT:
        ${context || "No relevant document snippets found."}

        QUERY:
        ${query}
      `;

      // gemini-2.5-flash is confirmed working for your account
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await response.json();
      if (data.error) return `❌ AI Error: ${data.error.message}`;
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      return "I'm sorry, I encountered a network error.";
    }
  }

  static async extractTextFromFile(uri: string, mimeType: string): Promise<string> {
    if (!API_KEY || API_KEY === "YOUR_API_KEY") return "API Key Missing.";

    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64', 
      });

      const payload = {
        contents: [{
          parts: [
            { text: "Extract ALL text from this document accurately. If it is a marksheet, list subjects and marks." },
            {
              inline_data: {
                mime_type: mimeType === 'application/pdf' ? 'application/pdf' : 'image/jpeg',
                data: base64
              }
            }
          ]
        }]
      };

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();
      if (data.error) {
        if (data.error.message.includes('quota')) {
          throw new Error("Google Rate Limit: Please wait 1 minute before uploading another document.");
        }
        throw new Error(data.error.message);
      }
      
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Extraction Error:", error);
      return `Extraction failed: ${error}`;
    }
  }

  static async generatePersonalSummary(allDocsText: string): Promise<string> {
    if (!API_KEY || API_KEY === "YOUR_API_KEY") return "API Key Missing.";
    try {
      const prompt = `Provide a summary of this person's profile based on: ${allDocsText}`;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      return "Unable to generate summary.";
    }
  }
}
