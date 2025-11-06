
import React from 'react';
import { Recipe, Ingredient } from '../types';
import { ChefHatIcon, ClockIcon, FlameIcon, ShoppingCartIcon } from '../constants';

interface RecipeCardProps {
  recipe: Recipe;
  onCook: (recipe: Recipe) => void;
  onAddToShoppingList: (items: Ingredient[]) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onCook, onAddToShoppingList }) => {
  const getDifficultyColor = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-700 flex flex-col transition-transform duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl">
      <div className="p-6 flex-grow">
        <h3 className="text-2xl font-bold text-white mb-3">{recipe.recipeName}</h3>
        <div className="flex items-center justify-between text-gray-400 mb-6 flex-wrap gap-4">
          <div className={`flex items-center space-x-2 font-medium ${getDifficultyColor(recipe.difficulty)}`}>
            <ChefHatIcon className="w-5 h-5" />
            <span>{recipe.difficulty}</span>
          </div>
          <div className="flex items-center space-x-2">
            <ClockIcon className="w-5 h-5" />
            <span>{recipe.prepTime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FlameIcon className="w-5 h-5" />
            <span>{recipe.calories} kcal</span>
          </div>
        </div>

        {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-white mb-2">You might need:</h4>
            <div className="flex flex-wrap gap-2">
              {recipe.missingIngredients.map((item, index) => (
                <span key={index} className="bg-gray-700 text-gray-300 text-sm font-medium px-3 py-1 rounded-full">
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-gray-800/50 border-t border-gray-700 flex flex-col sm:flex-row gap-3">
        {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
          <button
            onClick={() => onAddToShoppingList(recipe.missingIngredients)}
            className="flex-1 flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300"
          >
            <ShoppingCartIcon className="w-5 h-5 mr-2" />
            Add Missing
          </button>
        )}
        <button
          onClick={() => onCook(recipe)}
          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
        >
          Start Cooking
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
