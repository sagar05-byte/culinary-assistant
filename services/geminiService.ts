
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, DietaryFilter } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const recipeSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      recipeName: {
        type: Type.STRING,
        description: "The name of the recipe.",
      },
      difficulty: {
        type: Type.STRING,
        enum: ["Easy", "Medium", "Hard"],
        description: "The difficulty level of the recipe.",
      },
      prepTime: {
        type: Type.STRING,
        description: "Estimated preparation and cooking time (e.g., '30 minutes').",
      },
      calories: {
        type: Type.INTEGER,
        description: "Estimated calorie count per serving.",
      },
      ingredients: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            quantity: { type: Type.STRING },
          },
          required: ["name", "quantity"],
        },
        description: "List of ingredients available in the fridge for this recipe.",
      },
      instructions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Step-by-step cooking instructions.",
      },
      missingIngredients: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            quantity: { type: Type.STRING },
          },
          required: ["name", "quantity"],
        },
        description: "List of common complementary ingredients that are missing for this recipe (e.g., spices, oil).",
      },
    },
    required: ["recipeName", "difficulty", "prepTime", "calories", "ingredients", "instructions", "missingIngredients"],
  },
};

export const getRecipesFromImage = async (
  base64Image: string,
  mimeType: string,
  dietaryFilters: DietaryFilter[]
): Promise<Recipe[]> => {
  const dietaryPrompt = dietaryFilters.length > 0
    ? `The user has the following dietary restrictions: ${dietaryFilters.join(", ")}. Please only suggest recipes that meet these requirements.`
    : "The user has no dietary restrictions.";

  const prompt = `
    You are a smart culinary assistant. Analyze the ingredients in this image of a refrigerator. 
    Based on the visible ingredients, suggest 3-5 creative recipes. 
    For each recipe, if any common complementary ingredients are missing (like spices, oil, or a specific vegetable), list them as 'missingIngredients'.
    ${dietaryPrompt}
    Your response must be a JSON object that conforms to the provided schema. Do not include any markdown formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Image } },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: recipeSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    return parsedJson as Recipe[];
  } catch (error) {
    console.error("Error generating recipes:", error);
    throw new Error("Failed to generate recipes. The model might be unable to process the request. Please try a different image or prompt.");
  }
};
