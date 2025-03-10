
export interface AnalysisData {
  id: string;
  videoUrl: string;
  overallScore: number;
  scores: {
    verbal: number;
    nonVerbal: number;
    content: number;
    engagement: number;
  };
  detailedScores: {
    clarity: number;
    conciseness: number;
    eyeContact: number;
    posture: number;
    relevance: number;
    confidence: number;
  };
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  feedback: {
    verbal: {
      clarity: string;
      vocabulary: string;
      fillerWords: string;
    };
    nonVerbal: {
      eyeContact: string;
      facialExpressions: string;
      posture: string;
    };
    content: {
      relevance: string;
      structure: string;
      examples: string;
    };
    overall: {
      confidence: string;
      engagement: string;
      appearance: string;
    };
  };
  // Enhanced analysis fields
  transcription?: string;
  wordCount?: number;
  fillerWordCount?: number;
  speechDuration?: number;
  confidenceScore?: number;
  speechQuality?: 'poor' | 'fair' | 'good' | 'excellent';
  
  // New comprehensive metrics
  pacing?: {
    wordsPerMinute: number;
    pauseFrequency: number;
    paceConsistency: number;
    score: number;
  };
  vocabulary?: {
    diversity: number;
    complexity: number;
    domainSpecificity: number;
    score: number;
  };
  sentiment?: {
    positivity: number;
    enthusiasm: number;
    confidence: number;
    score: number;
  };
  structure?: {
    organization: number;
    coherence: number;
    completeness: number;
    score: number;
  };
  behavioral?: {
    stressIndicators: number;
    engagementLevel: number;
    adaptability: number;
    score: number;
  };
  technicalDepth?: {
    knowledgeLevel: number;
    problemSolving: number;
    domainExpertise: number;
    score: number;
  };
  // Advanced analysis capabilities
  contextRelevance?: {
    isInterviewContent: boolean;
    contextConfidence: number;
    relevantTerms: string[];
    contextualScore: number;
  };
  advancedInsights?: {
    keyPoints: string[];
    improvementAreas: string[];
    communicationStyle: string;
    insightScore: number;
  };
  emotionalAnalysis?: {
    dominantEmotions: string[];
    emotionalVariability: number;
    stressCues: string[];
    confidenceCues: string[];
    score: number;
  };
  interactionQuality?: {
    responsiveness: number;
    listeningSkills: number;
    questionHandling: number;
    score: number;
  };
  privacy: {
    dataRetentionPeriod: string;
    anonymizationLevel: 'full' | 'partial' | 'none';
    consentObtained: boolean;
  };
  feedback360?: string[];
  trendAnalysis?: {
    improvementAreas: string[];
    progressMetrics: {
      [key: string]: {
        previous: number;
        current: number;
        change: number;
      };
    };
  };
  userFeedback?: {
    relevanceRating?: number;
    accuracyRating?: number;
    actionabilityRating?: number;
    comments?: string;
  };
}
