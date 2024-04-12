import './App.css';
import React, { useEffect, useRef, useState } from 'react';

const RecipeCard = () => {
  const [ingredients, setIngredients] = useState("");
  const [mealType, setMealType] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [complexity, setComplexity] = useState("");

  return (
    <div className="w-[400px] border rounded-lg overflow-hidden shadow-lg">
      <div className="px-6 py-4">
      </div>
    </div>
  )


}

function App() {
  return (
    <div className="App">
      
    </div>
  );
}

export default App;
