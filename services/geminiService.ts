import { GoogleGenAI } from "@google/genai";

export const generateNoteContent = async (topic: string): Promise<string> => {
  // Initialisation avec la clé d'environnement
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Génère une note courte, utile et structurée sur le sujet suivant : "${topic}". Utilise le format Markdown. Réponds en français.`,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "Aucun contenu généré.";
  } catch (error) {
    console.error("Erreur Gemini:", error);
    throw new Error("Impossible de générer la note. Vérifiez votre configuration API_KEY sur Vercel.");
  }
};
