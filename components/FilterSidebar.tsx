
import React from 'react';
import { DietaryFilter, View } from '../types';
import { ShoppingCartIcon } from '../constants';

interface FilterSidebarProps {
  activeFilters: DietaryFilter[];
  onFilterChange: (filter: DietaryFilter) => void;
  shoppingListCount: number;
  setView: (view: View) => void;
  resetApp: () => void;
}

const dietaryOptions: { id: DietaryFilter; label: string }[] = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'keto', label: 'Keto' },
];

const FilterSidebar: React.FC<FilterSidebarProps> = ({ activeFilters, onFilterChange, shoppingListCount, setView, resetApp }) => {
  return (
    <aside className="w-full md:w-64 lg:w-72 flex-shrink-0 bg-gray-800 p-6 rounded-2xl md:sticky md:top-6 self-start">
      <h3 className="text-xl font-bold text-white mb-6">Dietary Filters</h3>
      <div className="space-y-4 mb-8">
        {dietaryOptions.map(({ id, label }) => (
          <label key={id} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={activeFilters.includes(id)}
              onChange={() => onFilterChange(id)}
              className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-300">{label}</span>
          </label>
        ))}
      </div>

      <button
        onClick={() => setView('shoppingList')}
        className="w-full flex items-center justify-center text-center bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 mb-4"
      >
        <ShoppingCartIcon className="w-5 h-5 mr-2" />
        Shopping List
        {shoppingListCount > 0 && (
          <span className="ml-2 bg-white text-green-700 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
            {shoppingListCount}
          </span>
        )}
      </button>

      <button
        onClick={resetApp}
        className="w-full text-center bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300"
      >
        Start Over
      </button>
    </aside>
  );
};

export default FilterSidebar;
