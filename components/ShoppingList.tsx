
import React, { useState } from 'react';
import { Ingredient } from '../types';

interface ShoppingListProps {
  items: Ingredient[];
  onClear: () => void;
  onRemoveItem: (itemName: string) => void;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ items, onClear, onRemoveItem }) => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const handleToggleCheck = (itemName: string) => {
    setCheckedItems(prev => 
      prev.includes(itemName) ? prev.filter(name => name !== itemName) : [...prev, itemName]
    );
  };
  
  if (items.length === 0) {
    return (
        <div className="w-full bg-gray-800 rounded-2xl p-8 text-center border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-4">Shopping List</h2>
            <p className="text-gray-400">Your shopping list is empty. Add missing ingredients from recipe cards!</p>
        </div>
    );
  }

  return (
    <div className="w-full bg-gray-800 rounded-2xl p-8 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Shopping List</h2>
        <button
          onClick={onClear}
          className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Clear All
        </button>
      </div>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={`${item.name}-${index}`} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
            <label className="flex items-center space-x-4 cursor-pointer">
              <input
                type="checkbox"
                checked={checkedItems.includes(item.name)}
                onChange={() => handleToggleCheck(item.name)}
                className="h-6 w-6 rounded bg-gray-600 border-gray-500 text-blue-500 focus:ring-blue-500"
              />
              <span className={`text-lg ${checkedItems.includes(item.name) ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                {item.name} <span className="text-gray-400 text-sm">({item.quantity})</span>
              </span>
            </label>
            <button onClick={() => onRemoveItem(item.name)} className="text-gray-500 hover:text-red-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingList;
