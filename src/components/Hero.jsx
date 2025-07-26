import React from 'react';
import Button from './Button';

const Hero = () => {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Build Amazing UIs with React
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            Create beautiful, responsive web applications using the power of CSS, JavaScript, React, and HTML. Get started today!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button primary size="large" label="Get Started" onClick={() => console.log('Get started clicked')} />
            <Button size="large" label="Learn More" onClick={() => console.log('Learn more clicked')} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;