
import { GoogleGenAI, Type } from "@google/genai";

// Use process.env.API_KEY directly in the service function
export const generateWheelSuggestions = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest 5-8 fun, creative options for a decision wheel based on this topic: ${prompt}. Return as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    // response.text is a getter property, do not call it as a function
    const text = response.text;
    if (!text) return [];
    
    const result = JSON.parse(text);
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};
