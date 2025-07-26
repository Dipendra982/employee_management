import React, { useState } from 'react';
import Button from './Button';

const Counter = () => {
  const [count, setCount] = useState(0);
  
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => Math.max(0, prev - 1));
  const reset = () => setCount(0);

  return (
    <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Interactive Counter</h2>
      
      <div className="flex justify-center items-center mb-8">
        <div className="text-5xl font-bold text-blue-600 py-4 px-8 bg-blue-50 rounded-lg">
          {count}
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4">
        <Button 
          label="Decrement" 
          onClick={decrement} 
          size="medium"
        />
        <Button 
          label="Reset" 
          onClick={reset} 
          size="medium"
        />
        <Button 
          label="Increment" 
          onClick={increment} 
          primary
          size="medium"
        />
      </div>
    </div>
  );
};

export default Counter;