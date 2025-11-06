
export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  recipeName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTime: string;
  calories: number;
  ingredients: Ingredient[];
  instructions: string[];
  missingIngredients: Ingredient[];
}

export type DietaryFilter = 'vegetarian' | 'vegan' | 'gluten-free' | 'keto';

export type View = 'main' | 'shoppingList';
