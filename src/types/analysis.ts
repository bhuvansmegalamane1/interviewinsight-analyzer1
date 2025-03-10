
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
  // New fields for enhanced analysis
  transcription?: string;
  wordCount?: number;
  fillerWordCount?: number;
  speechDuration?: number;
  confidenceScore?: number;
  speechQuality?: 'poor' | 'fair' | 'good' | 'excellent';
}
