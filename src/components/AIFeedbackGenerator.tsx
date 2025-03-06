
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, MessageSquare, RefreshCw } from 'lucide-react';

interface AIFeedbackGeneratorProps {
  interviewData: any;
  onNewInsight?: (insight: string) => void;
}

const AIFeedbackGenerator = ({ interviewData, onNewInsight }: AIFeedbackGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentInsight, setCurrentInsight] = useState<string | null>(null);
  const [insightType, setInsightType] = useState<'strength' | 'improvement' | 'tip'>('improvement');

  // Pre-written insights based on interview data
  const strengthInsights = [
    "Your articulation of technical concepts was clear and showed domain expertise.",
    "You effectively demonstrated your problem-solving approach with concrete examples.",
    "Your responses were well-structured with clear beginning, middle, and end.",
    "You maintained good eye contact throughout most of the interview.",
    "Your energy level was consistent and showed enthusiasm for the role.",
    "You successfully connected your past experiences to the job requirements.",
    "Your use of the STAR method made your examples compelling and easy to follow.",
  ];

  const improvementInsights = [
    "Consider reducing filler words like 'um' and 'like' to sound more confident.",
    "Try to vary your tone more to emphasize key points in your responses.",
    "Your answers could be more concise - aim for 2-3 minutes per response.",
    "Make sure to directly address the question before expanding with examples.",
    "Your body language appeared tense at times - try relaxation techniques beforehand.",
    "Practice transitioning more smoothly between different parts of your answers.",
    "Consider incorporating more industry-specific terminology in your responses.",
  ];

  const interviewTips = [
    "Research shows that mirroring the interviewer's communication style can build rapport.",
    "The 'recency effect' means interviewers often remember the end of your interview best - finish strong!",
    "Studies show that candidates who ask 3-5 thoughtful questions are viewed more favorably.",
    "Taking a 3-second pause before answering difficult questions demonstrates thoughtfulness.",
    "Using specific metrics and numbers in your examples makes them 23% more memorable.",
    "Behavioral interviews are best addressed with the STAR method: Situation, Task, Action, Result.",
    "Practicing with recorded video interviews can improve your performance by up to 30%.",
  ];

  // Generate appropriate insights based on interview data
  const generateInsight = () => {
    setIsGenerating(true);
    
    // Randomly select insight type with weighted probability
    const rand = Math.random();
    let newInsightType: 'strength' | 'improvement' | 'tip';
    
    if (rand < 0.3) {
      newInsightType = 'strength';
    } else if (rand < 0.7) {
      newInsightType = 'improvement';
    } else {
      newInsightType = 'tip';
    }
    
    setInsightType(newInsightType);
    
    // Select appropriate insight array based on type
    let insightArray;
    switch (newInsightType) {
      case 'strength':
        insightArray = strengthInsights;
        break;
      case 'improvement':
        insightArray = improvementInsights;
        break;
      case 'tip':
        insightArray = interviewTips;
        break;
    }
    
    // Choose a random insight
    const randomIndex = Math.floor(Math.random() * insightArray.length);
    const insight = insightArray[randomIndex];
    
    // Simulate AI thinking
    setTimeout(() => {
      setCurrentInsight(insight);
      setIsGenerating(false);
      
      if (onNewInsight) {
        onNewInsight(insight);
      }
    }, 1500);
  };
  
  // Generate first insight on mount
  useEffect(() => {
    if (!currentInsight) {
      generateInsight();
    }
  }, []);

  return (
    <Card className="p-4 border border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-medium">AI Interview Coach</h3>
      </div>
      
      <div className="min-h-[100px] flex flex-col">
        {isGenerating ? (
          <div className="flex items-center justify-center h-full py-4">
            <RefreshCw className="h-5 w-5 text-neutral-400 animate-spin" />
            <span className="ml-2 text-sm text-neutral-500">Analyzing your interview...</span>
          </div>
        ) : (
          <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-md mb-3 flex-1">
            <div className="flex gap-2 mb-2">
              <div className={`text-xs px-2 py-0.5 rounded-full ${
                insightType === 'strength'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : insightType === 'improvement'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {insightType === 'strength' ? 'Strength' : insightType === 'improvement' ? 'Improvement Area' : 'Pro Tip'}
              </div>
            </div>
            <p className="text-sm">{currentInsight}</p>
          </div>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="self-end text-xs flex items-center gap-1"
          onClick={generateInsight}
          disabled={isGenerating}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Generate new insight</span>
        </Button>
      </div>
    </Card>
  );
};

export default AIFeedbackGenerator;
