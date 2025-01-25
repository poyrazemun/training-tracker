import React, { useState } from 'react';

const measurements = {
  weight: 'Kilo',
  chest: 'Göğüs',
  waist: 'Bel',
  arms: 'Kollar',
  legs: 'Bacaklar'
};

const BodyMeasurements = () => {
  const [measurements, setMeasurements] = useState({});
  
  return (
    <div className="measurements">
      {Object.entries(measurements).map(([key, label]) => (
        <div key={key}>
          <label>{label}</label>
          <input 
            type="number" 
            onChange={e => updateMeasurement(key, e.target.value)} 
          />
        </div>
      ))}
    </div>
  );
};

export default BodyMeasurements; 