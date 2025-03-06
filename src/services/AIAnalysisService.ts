/**
 * This service simulates an AI analysis engine for interview videos
 * In a production environment, this would connect to a real AI backend
 */

type SentimentType = 'positive' | 'neutral' | 'negative';
type PoseFeedback = 'good' | 'slouching' | 'tooClose' | 'tooFar';

interface InterviewAnalysisResult {
  overallScore: number;
  confidenceScore: number;
  speechClarity: number;
  eyeContactScore: number;
  postureFeedback: PoseFeedback;
  grammarIssues: number;
  fillerWordFrequency: number;
  sentimentTrack: Array<{timepoint: string, sentiment: SentimentType, confidence: number}>;
  detailedFeedback: {
    strengths: string[];
    improvements: string[];
    keyInsights: string[];
  };
  recommendedPractice: string[];
}

// Mock training data categories for the AI model
const trainingCategories = {
  technicalInterview: {
    keyPhrases: ["algorithm", "system design", "technical challenge", "coding", "software"],
    expectedStructure: "problem-solution-outcome",
    idealPace: "measured and thoughtful",
    commonWeaknesses: ["overexplaining", "lack of practical examples", "too abstract"]
  },
  behavioralInterview: {
    keyPhrases: ["team", "challenge", "conflict", "leadership", "initiative"],
    expectedStructure: "STAR method (Situation, Task, Action, Result)",
    idealPace: "conversational but focused",
    commonWeaknesses: ["vague answers", "lack of specificity", "not showing personal growth"]
  },
  generalInterview: {
    keyPhrases: ["background", "experience", "strength", "weakness", "goals"],
    expectedStructure: "concise overview with specific examples",
    idealPace: "energetic and engaging",
    commonWeaknesses: ["rambling", "lack of relevance to position", "generic answers"]
  }
};

// Pre-trained feedback templates based on interview performance patterns
const feedbackTemplates = {
  strengths: [
    "Clear articulation of {topic} concepts",
    "Effective use of the {structure} method in responses",
    "Maintained consistent {nonVerbalCue} throughout the interview",
    "Successfully demonstrated {skill} with specific examples",
    "Excellent pacing and {quality} in responses",
    "Strong {communicationAspect} that conveyed confidence"
  ],
  improvements: [
    "Consider reducing {weaknessTrait} to improve clarity",
    "Incorporate more specific metrics when discussing {topic}",
    "Work on maintaining {nonVerbalCue} more consistently",
    "Try to structure answers using the {structure} method",
    "Be more concise when explaining {topic}",
    "Practice transitioning between points more smoothly"
  ]
};

/**
 * Simulates an AI analysis of interview video content
 * This would normally connect to a real machine learning backend
 */
export const analyzeInterviewContent = (interviewData: any): Promise<InterviewAnalysisResult> => {
  return new Promise((resolve) => {
    // Simulate processing time for AI analysis
    setTimeout(() => {
      // Generate an analysis based on interview data
      const result: InterviewAnalysisResult = {
        overallScore: Math.min(95, Math.max(60, 75 + (Math.random() * 20 - 10))),
        confidenceScore: interviewData.confidenceScore || Math.floor(Math.random() * 30) + 60,
        speechClarity: Math.floor(Math.random() * 25) + 70,
        eyeContactScore: interviewData.eyeContactScore || Math.floor(Math.random() * 30) + 60,
        postureFeedback: interviewData.postureFeedback || "good",
        grammarIssues: interviewData.grammarIssues || Math.floor(Math.random() * 8),
        fillerWordFrequency: Math.floor(Math.random() * 15) + 5,
        
        // Generate timeline of sentiment throughout interview
        sentimentTrack: generateSentimentTrack(interviewData.recordingDuration || 120),
        
        // Generate personalized feedback
        detailedFeedback: {
          strengths: generateStrengthsFeedback(),
          improvements: generateImprovementsFeedback(),
          keyInsights: [
            "Your responses were most confident when discussing technical challenges",
            "You tend to use more filler words when discussing team conflicts",
            "Your most engaging answers used specific numerical examples"
          ]
        },
        
        // AI-recommended practice questions
        recommendedPractice: [
          "Tell me about a time when you had to adapt to a significant change at work",
          "Describe a situation where you had to explain a complex technical issue to a non-technical stakeholder",
          "How do you prioritize tasks when working on multiple projects with competing deadlines?",
          "What approach do you take when receiving constructive criticism?",
          "Describe a situation where you had to make a difficult decision with limited information"
        ]
      };
      
      resolve(result);
    }, 2000);
  });
};

/**
 * Generate a sentiment timeline through the interview
 */
function generateSentimentTrack(duration: number) {
  const result = [];
  const segments = Math.floor(duration / 30); // Every 30 seconds
  
  let prevSentiment: SentimentType = 'neutral';
  
  for (let i = 0; i < segments; i++) {
    const timepoint = formatTimepoint(i * 30);
    
    // Sentiment tends to improve throughout interview with some variation
    let sentiment: SentimentType;
    const rand = Math.random();
    
    if (i < segments * 0.3) {
      // Early in interview - more likely to be neutral/negative
      sentiment = rand < 0.6 ? 'neutral' : rand < 0.8 ? 'negative' : 'positive';
    } else if (i < segments * 0.7) {
      // Mid interview - more balanced
      sentiment = rand < 0.4 ? 'neutral' : rand < 0.8 ? 'positive' : 'negative';
    } else {
      // Late interview - more likely to be positive
      sentiment = rand < 0.7 ? 'positive' : rand < 0.9 ? 'neutral' : 'negative';
    }
    
    // Add some consistency - 30% chance to keep previous sentiment
    if (Math.random() < 0.3) {
      sentiment = prevSentiment;
    }
    
    prevSentiment = sentiment;
    
    result.push({
      timepoint,
      sentiment,
      confidence: 0.5 + Math.random() * 0.4 // Between 0.5 and 0.9
    });
  }
  
  return result;
}

/**
 * Format seconds into MM:SS format
 */
function formatTimepoint(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Generate personalized strength feedback
 */
function generateStrengthsFeedback() {
  const strengths = [];
  const topics = ['problem-solving', 'teamwork', 'technical', 'communication', 'leadership'];
  const structures = ['STAR', 'problem-solution', 'chronological'];
  const nonVerbalCues = ['eye contact', 'confident posture', 'hand gestures', 'vocal variety'];
  const skills = ['conflict resolution', 'technical analysis', 'stakeholder management', 'strategic thinking'];
  const qualities = ['clarity', 'conciseness', 'enthusiasm', 'authenticity'];
  const communicationAspects = ['storytelling ability', 'articulation', 'active listening', 'question handling'];
  
  // Select 3 random strengths
  for (let i = 0; i < 3; i++) {
    let template = feedbackTemplates.strengths[Math.floor(Math.random() * feedbackTemplates.strengths.length)];
    
    // Replace placeholders with random values
    template = template
      .replace('{topic}', topics[Math.floor(Math.random() * topics.length)])
      .replace('{structure}', structures[Math.floor(Math.random() * structures.length)])
      .replace('{nonVerbalCue}', nonVerbalCues[Math.floor(Math.random() * nonVerbalCues.length)])
      .replace('{skill}', skills[Math.floor(Math.random() * skills.length)])
      .replace('{quality}', qualities[Math.floor(Math.random() * qualities.length)])
      .replace('{communicationAspect}', communicationAspects[Math.floor(Math.random() * communicationAspects.length)]);
    
    strengths.push(template);
  }
  
  return strengths;
}

/**
 * Generate personalized improvement feedback
 */
function generateImprovementsFeedback() {
  const improvements = [];
  const weaknessTraits = ['filler words', 'technical jargon', 'speaking pace', 'abstract references'];
  const topics = ['achievements', 'technical challenges', 'collaborative projects', 'past roles'];
  const nonVerbalCues = ['eye contact', 'upright posture', 'hand position', 'facial expressions'];
  const structures = ['STAR', 'problem-solution-outcome', 'context-action-result'];
  
  // Select 3 random improvements
  for (let i = 0; i < 3; i++) {
    let template = feedbackTemplates.improvements[Math.floor(Math.random() * feedbackTemplates.improvements.length)];
    
    // Replace placeholders with random values
    template = template
      .replace('{weaknessTrait}', weaknessTraits[Math.floor(Math.random() * weaknessTraits.length)])
      .replace('{topic}', topics[Math.floor(Math.random() * topics.length)])
      .replace('{nonVerbalCue}', nonVerbalCues[Math.floor(Math.random() * nonVerbalCues.length)])
      .replace('{structure}', structures[Math.floor(Math.random() * structures.length)]);
    
    improvements.push(template);
  }
  
  return improvements;
}

export default {
  analyzeInterviewContent
};
