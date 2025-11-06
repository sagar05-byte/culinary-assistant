
import React, { useState, useCallback, useMemo } from 'react';
import ImageUploader from './components/ImageUploader';
import RecipeCard from './components/RecipeCard';
import FilterSidebar from './components/FilterSidebar';
import CookingModeModal from './components/CookingModeModal';
import ShoppingList from './components/ShoppingList';
import { getRecipesFromImage } from './services/geminiService';
import { Recipe, DietaryFilter, Ingredient, View } from './types';

const App: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<DietaryFilter[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [shoppingList, setShoppingList] = useState<Ingredient[]>([]);
  const [currentView, setCurrentView] = useState<View>('main');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageAnalysis = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setRecipes(null);
    setUploadedFile(file);
    try {
      const base64Image = await fileToBase64(file);
      const fetchedRecipes = await getRecipesFromImage(base64Image, file.type, activeFilters);
      setRecipes(fetchedRecipes);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [activeFilters]);

  const handleFilterChange = useCallback((filter: DietaryFilter) => {
    const newFilters = activeFilters.includes(filter)
      ? activeFilters.filter(f => f !== filter)
      : [...activeFilters, filter];
    setActiveFilters(newFilters);

    if (uploadedFile) {
        handleImageAnalysis(uploadedFile);
    }
  }, [activeFilters, uploadedFile, handleImageAnalysis]);

  const handleAddToShoppingList = useCallback((items: Ingredient[]) => {
    setShoppingList(prevList => {
      const newList = [...prevList];
      items.forEach(item => {
        if (!newList.some(i => i.name.toLowerCase() === item.name.toLowerCase())) {
          newList.push(item);
        }
      });
      return newList;
    });
  }, []);
  
  const handleRemoveShoppingItem = useCallback((itemName: string) => {
    setShoppingList(prev => prev.filter(item => item.name !== itemName));
  }, []);

  const handleClearShoppingList = useCallback(() => {
    setShoppingList([]);
  }, []);

  const resetApp = () => {
    setRecipes(null);
    setIsLoading(false);
    setError(null);
    setActiveFilters([]);
    setSelectedRecipe(null);
    setCurrentView('main');
    setUploadedFile(null);
  };

  const hasContent = recipes !== null || isLoading || error !== null;

  const memoizedFilteredRecipes = useMemo(() => {
    return recipes; // The filtering is now done on the API side
  }, [recipes]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-6">
      <main className="max-w-screen-xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">Smart Fridge Assistant</h1>
        </header>

        {!hasContent ? (
          <div className="flex justify-center items-center" style={{ minHeight: 'calc(100vh - 150px)' }}>
            <ImageUploader onImageUpload={handleImageAnalysis} isLoading={isLoading} />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            <FilterSidebar
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              shoppingListCount={shoppingList.length}
              setView={setCurrentView}
              resetApp={resetApp}
            />
            <div className="flex-1 w-full">
              {currentView === 'main' ? (
                <>
                  {isLoading && (
                    <div className="flex justify-center items-center h-96">
                      <div className="text-center">
                          <svg className="animate-spin mx-auto h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <p className="mt-4 text-lg text-gray-300">Generating delicious ideas...</p>
                      </div>
                    </div>
                  )}
                  {error && <div className="bg-red-900 border border-red-500 text-red-200 p-4 rounded-lg">{error}</div>}
                  {memoizedFilteredRecipes && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {memoizedFilteredRecipes.map((recipe, index) => (
                        <RecipeCard
                          key={index}
                          recipe={recipe}
                          onCook={setSelectedRecipe}
                          onAddToShoppingList={handleAddToShoppingList}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <ShoppingList items={shoppingList} onClear={handleClearShoppingList} onRemoveItem={handleRemoveShoppingItem} />
              )}
            </div>
          </div>
        )}
      </main>
      {selectedRecipe && <CookingModeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
    </div>
  );
};

export default App;

