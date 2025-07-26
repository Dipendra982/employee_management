import React from 'react';
import Card from './Card';
import { Code, Layout, Palette, Zap } from 'lucide-react';

const FeatureSection = () => {
  const features = [
    {
      title: 'React Components',
      description: 'Build reusable UI components with React\'s component-based architecture.',
      icon: <Code size={36} />
    },
    {
      title: 'Responsive Design',
      description: 'Create layouts that work perfectly on any device with Tailwind CSS.',
      icon: <Layout size={36} />
    },
    {
      title: 'Beautiful Styling',
      description: 'Apply beautiful styles and animations with modern CSS techniques.',
      icon: <Palette size={36} />
    },
    {
      title: 'JavaScript Interactions',
      description: 'Add interactivity and dynamic behaviors with JavaScript and React hooks.',
      icon: <Zap size={36} />
    }
  ];

  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover what makes React and modern frontend technologies so powerful for creating exceptional user experiences.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;