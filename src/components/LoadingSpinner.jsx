import { Loader2, Sparkles } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-6">
          <Loader2 className="w-16 h-16 animate-spin text-indigo-400 mx-auto" />
          <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Loading your account...</h2>
        <p className="text-gray-300">Please wait while we prepare everything for you</p>
        
        {/* Loading dots */}
        <div className="flex justify-center space-x-1 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}