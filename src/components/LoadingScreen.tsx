import { useEffect, useState } from 'react';

const facts = [
  "Did you know? The first computer programmer was a woman - Ada Lovelace!",
  "The term 'bug' in computing came from an actual moth found in a computer in 1947.",
  "The first computer mouse was made of wood!",
  "The first website is still online at info.cern.ch",
  "JavaScript was created in just 10 days in 1995.",
  "The first computer virus was created in 1983.",
  "The first computer game was created in 1962.",
  "The QWERTY keyboard layout was designed to slow down typing.",
  "The first email was sent in 1971.",
  "The first smartphone was created in 1994."
];

const loadingTexts = [
  "Generating your perfect FYP ideas...",
  "Hang tight while we craft something amazing...",
  "Exploring innovative possibilities...",
  "Creating your project roadmap...",
  "Almost there..."
];

export function LoadingScreen() {
  const [currentFact, setCurrentFact] = useState(facts[0]);
  const [currentLoadingText, setCurrentLoadingText] = useState(loadingTexts[0]);

  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFact(prev => {
        const currentIndex = facts.indexOf(prev);
        return facts[(currentIndex + 1) % facts.length];
      });
    }, 3000);

    const loadingTextInterval = setInterval(() => {
      setCurrentLoadingText(prev => {
        const currentIndex = loadingTexts.indexOf(prev);
        return loadingTexts[(currentIndex + 1) % loadingTexts.length];
      });
    }, 2000);

    return () => {
      clearInterval(factInterval);
      clearInterval(loadingTextInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-pulse">
          Generating FYP Ideas...
        </h2>
        
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-r-primary border-t-transparent border-b-transparent border-l-transparent animate-spin-slow"></div>
        </div>

        <div className="h-12">
          <p className="text-xl font-medium animate-fade-in">
            {currentLoadingText}
          </p>
        </div>

        <div className="mt-12 p-6 glass-morphism rounded-lg">
          <p className="text-lg animate-fade-in">
            {currentFact}
          </p>
        </div>
      </div>
    </div>
  );
}