import React, { useState } from 'react';

const NutritionTracker = () => {
  const [meals, setMeals] = useState([]);
  const [macros, setMacros] = useState({
    protein: 0,
    carbs: 0,
    fats: 0
  });

  return (
    <div className="nutrition">
      <div className="macros">
        <div>Protein: {macros.protein}g</div>
        <div>Karbonhidrat: {macros.carbs}g</div>
        <div>Yağ: {macros.fats}g</div>
      </div>
      {/* Öğün ekleme formu */}
    </div>
  );
};

export default NutritionTracker; 