import React from 'react';
import Counter from './Counter';

const InteractiveSection = () => {
  return (
    <section id="about" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Try It Yourself</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This interactive example demonstrates React's state management and event handling capabilities.
          </p>
        </div>
        
        <Counter />
      </div>
    </section>
  );
};

export default InteractiveSection;