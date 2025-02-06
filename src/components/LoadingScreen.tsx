import { useEffect, useState } from 'react';

const engagementContent = [
  "Tip: Break your research into manageable chunks. Tackling one piece at a time will make the process feel less overwhelming.",
  "Quote: 'The only way to do great work is to love what you do.' - Steve Jobs",
  "Did you know? The first email was sent in 1971.",
  "Productivity Hack: Use the Pomodoro technique! Work for 25 minutes, then take a 5-minute break. It improves focus and reduces burnout.",
  "Tip: Start with a broad idea and narrow it down to something specific. It’s easier to research a focused topic than a broad one.",
  "Quote: 'The more that you read, the more things you will know. The more that you learn, the more places you'll go.' - Dr. Seuss",
  "Study Tip: To retain information, teach what you’ve learned to someone else. Explaining concepts reinforces your understanding.",
  "Did you know? The first computer programmer was a woman - Ada Lovelace!",
  "Productivity Tip: Eliminate distractions by setting your phone to 'Do Not Disturb' or using apps like Focus@Will to help you concentrate.",
  "Quote: 'Success is the sum of small efforts, repeated day in and day out.' - Robert Collier",
  "Research Tip: Use mind mapping to organize your thoughts and visually connect ideas, helping to clarify complex topics.",
  "Tip: Keep a dedicated notebook or digital document for notes, ideas, and questions that arise during your research. This will keep you organized.",
  "Did you know? The first smartphone was created in 1994.",
  "Study Hack: Experiment with active recall. After reading a chapter or article, try to recall the key points from memory before looking at your notes.",
  "Quote: 'It always seems impossible until it’s done.' - Nelson Mandela",
  "Productivity Tip: Prioritize your tasks by importance rather than urgency. Tackle the most important ones first to make the biggest impact.",
  "Tip: Don’t be afraid to change your research direction if you discover a more interesting or promising idea. Flexibility can lead to better results.",
  "Quote: 'Success is the ability to go from failure to failure without losing your enthusiasm.' - Winston Churchill",
  "Study Tip: Make use of online resources such as academic databases and Google Scholar to find credible research papers for your projects.",
  "Research Tip: Create a timeline for your project, breaking it down into milestones to ensure you stay on track and manage your time effectively.",
  "Did you know? The first computer virus was created in 1983.",
  "Quote: 'The best way to predict the future is to create it.' - Abraham Lincoln",
  "Productivity Hack: To combat procrastination, use the 2-minute rule: If a task will take less than 2 minutes, do it immediately.",
  "Tip: Take regular breaks during long research sessions to keep your brain fresh and prevent mental fatigue.",
  "Quote: 'Learning never exhausts the mind.' - Leonardo da Vinci",
  "Study Tip: Keep your workspace clean and organized to minimize distractions and boost your productivity while working on research.",
  "Research Tip: Always validate your sources. Peer-reviewed journals, academic books, and reputable websites are your best friends in the research process.",
  "Did you know? The term 'bug' in computing came from an actual moth found in a computer in 1947.",
  "Quote: 'The secret of getting ahead is getting started.' - Mark Twain",
  "Productivity Tip: Use the 'two-minute rule' – if a task can be done in less than two minutes, do it right away to avoid unnecessary stress later.",
  "Tip: Make sure to write down questions and ideas as they come to you. These could become important parts of your research down the line.",
  "Research Tip: Don’t wait until the last minute! Start your research early and break it down into stages to avoid rushing through the process.",
  "Quote: 'Your future is created by what you do today, not tomorrow.' - Robert Kiyosaki",
  "Tip: Take time to step back and reflect on your research from a broader perspective. This helps you spot patterns and connections that you might have missed.",
  "Study Tip: Use spaced repetition to reinforce key concepts. Revisiting material at intervals over time helps cement it in your memory.",
  "Quote: 'It’s not that I’m so smart, it’s just that I stay with problems longer.' - Albert Einstein",
  "Did you know? The first computer game was created in 1962.",
  "Productivity Hack: Set specific goals for each study session to give yourself clear targets and a sense of accomplishment when you achieve them.",
  "Research Tip: Keep an open mind during your research. Sometimes the most unexpected findings lead to the best discoveries.",
  "Quote: 'Success does not consist in never making mistakes but in never making the same one a second time.' - George Bernard Shaw",
  "Tip: Set deadlines for each part of your research process to avoid falling behind and feeling overwhelmed as the deadline approaches.",
  "Quote: 'The journey of a thousand miles begins with one step.' - Lao Tzu",
  "Did you know? JavaScript was created in just 10 days in 1995.",
  "Study Tip: Collaborate with others when researching. Different perspectives can help you approach problems in new and creative ways.",
  "Tip: Keep a balance between deep focus and creative thinking. Sometimes stepping away from a problem helps you see solutions you wouldn’t have thought of before.",
  "Research Tip: Always cite your sources properly to avoid plagiarism and give credit where it’s due.",
  "Quote: 'The more that you read, the more things you will know. The more that you learn, the more places you’ll go.' - Dr. Seuss"
];


const loadingTexts = [
  "Generating your perfect FYP ideas... please be patient.",
  "🔍 Exploring the best options just for you.",
  "Hang tight, crafting something amazing...",
  "🚀 Building your project roadmap for success.",
  "⚡ Almost there, fine-tuning your ideas.",
  "Creating innovative possibilities... stay with it!",
  "🔧 Organizing the best-fit project suggestions.",
  "Almost there... the perfect FYP ideas are on the way!",
  "⏳ Reviewing all the best options for you.",
  "Project roadmap in progress... it’s worth the wait!",
  "🔮 Ready to reveal your ideal FYP project ideas shortly.",
  "Exploring exciting research areas... your journey is about to begin.",
  "⏳ Things are being set up... trust the process.",
  "🔎 Analyzing skills and interests... nearly there!",
  "Ideas are being crafted with precision... stay tuned.",
  "⚡ Almost done... perfect project ideas are just around the corner!"
];


export function LoadingScreen() {
  const [currentFact, setCurrentFact] = useState(engagementContent[0]);
  const [currentLoadingText, setCurrentLoadingText] = useState(loadingTexts[0]);

  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFact(prev => {
        const currentIndex = engagementContent.indexOf(prev);
        return engagementContent[(currentIndex + 1) % engagementContent.length];
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