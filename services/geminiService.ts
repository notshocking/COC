import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, Verdict } from '../types';
import { PRODUCT_CATALOG } from '../data/products';

const apiKey = process.env['API_KEY'];

// Define the response schema using standard Schema format for Gemini 2.5 Flash
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    verdict: {
      type: Type.STRING,
      enum: [Verdict.CHAD, Verdict.CHUD],
      description: "The classification of the person in the image. CHAD represents attractive, confident, well-groomed features. CHUD represents unkempt, unflattering, or low-effort presentation.",
    },
    score: {
      type: Type.INTEGER,
      description: "A score from 0 to 100 representing the aesthetic rating.",
    },
    title: {
      type: Type.STRING,
      description: "A highly specific, creative, and slightly roasting 2-5 word title describing the person's exact vibe (e.g. 'Corporate Aztec Warrior', 'Suburban Step-Dad Final Boss', 'Zoomer Broccoli Head', 'Crypto Rug-Puller Physiognomy').",
    },
    explanation: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 concise, punchy bullet points explaining the rating. Use specific physiognomy terms (canthal tilt, jaw vectors) and internet slang naturally.",
    },
    keyFeatures: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 3-5 specific physical traits identified (e.g., 'Positive canthal tilt', 'Recessed chin', 'Hunter eyes').",
    },
    improvements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, enum: ['Gym', 'Grooming', 'Style', 'Health', 'Enhancement'] },
          suggestion: { type: Type.STRING, description: "Specific actionable advice explaining WHY this product helps the user's specific flaws." },
          productSearchTerm: { type: Type.STRING, description: "The EXACT name of the product selected from the provided Product Catalog." }
        },
        required: ['category', 'suggestion', 'productSearchTerm'],
        propertyOrdering: ['category', 'suggestion', 'productSearchTerm']
      },
      description: "A list of 3 specific recommendations from the provided catalog. One MUST be from the Enhancement category.",
    },
  },
  required: ["verdict", "score", "title", "explanation", "keyFeatures", "improvements"],
  propertyOrdering: ["verdict", "score", "title", "explanation", "keyFeatures", "improvements"],
};

export const analyzeImage = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Format the catalog for the prompt
  const catalogText = PRODUCT_CATALOG.map(p => `- [${p.category}] ${p.name}: ${p.description}`).join('\n');

  try {
    // We use gemini-2.5-flash for multimodal analysis with structured output (JSON).
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: `Analyze this image based on rigorous internet 'looksmaxxing' standards and physiognomy analysis.
            
            CRITICAL EVALUATION GUIDELINES:
            1. Look past the "halo effect". Focus on raw bone structure, facial harmony, and health markers.
            2. SCORING: 
               - 80-100: Exceptional genetics or maximized potential (Chad).
               - 60-79: Average to Above Average (Normie/Potential).
               - 0-59: Unkempt, poor hygiene, or weak features (Chud).
            3. CELEBRITIES: Rate them objectively as if they were a normal person. Do not inflate scores for fame.

            TONE & STYLE:
            - Be brutally honest but humorous. 
            - Use internet culture slang correctly (mogging, looksmaxxing, negative aura, prey eyes).
            - The 'Title' must be creative and specific to their archetype. Avoid generic titles like "Average Joe".

            RECOMMENDATION PROTOCOL:
            You MUST select exactly 3 recommendations from the Product Catalog below.
            Rule A: Exactly ONE (1) recommendation MUST be from the 'Enhancement' category.
            Rule B: The other TWO (2) recommendations should address the user's most significant flaws (Skin? Hair? Style? Muscle?).
            
            PRODUCT CATALOG:
            ${catalogText}
            
            If the image is not of a person, return a neutral/low score with a humorous title about them not being human.`
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.85, // Higher creativity
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from AI.");
    }

    const result = JSON.parse(text) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze image. Please try again with a clearer photo.");
  }
};