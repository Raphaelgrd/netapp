import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client
// Note: In a real production app, you would proxy this request through a backend
// to protect your API key. For this client-side demo, we use the env variable.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const generateNoteContent = async (topic: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("Clé API manquante (process.env.API_KEY).");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Génère une note courte, utile et structurée sur le sujet suivant : "${topic}". Utilise le format Markdown. Réponds en français.`,
      config: {
        maxOutputTokens: 500,
        temperature: 0.7,
      }
    });

    return response.text || "Aucun contenu généré.";
  } catch (error) {
    console.error("Erreur Gemini:", error);
    throw new Error("Impossible de générer la note.");
  }
};
