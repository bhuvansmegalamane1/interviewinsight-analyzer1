import { pipeline } from '@huggingface/transformers';

// Type definition for custom pipeline options that extends the base options
interface CustomPipelineOptions {
  chunk_length_s: number;
  [key: string]: any;
}

export class MediaAnalysisService {
  private static transcriber: any = null;
  private static sentimentAnalyzer: any = null;
  private static textClassifier: any = null;
  private static initialized = false;
  private static commonFillerWords = [
    'um', 'uh', 'like', 'you know', 'actually', 'basically', 'literally', 
    'sort of', 'kind of', 'i mean', 'right', 'okay', 'so', 'well', 'anyway',
    'just', 'very', 'really', 'obviously', 'seriously', 'totally', 'essentially'
  ];
  private static technicalTerms: {[domain: string]: string[]} = {
    programming: ['algorithm', 'database', 'framework', 'API', 'code', 'function', 
                 'interface', 'implementation', 'optimization', 'logic', 'syntax'],
    finance: ['asset', 'liability', 'equity', 'portfolio', 'dividend', 'capital', 
             'investment', 'diversification', 'valuation', 'liquidity', 'leverage'],
    healthcare: ['diagnosis', 'treatment', 'patient', 'prognosis', 'symptom', 
                'prescription', 'therapy', 'clinical', 'procedure', 'medical'],
    marketing: ['campaign', 'conversion', 'audience', 'branding', 'engagement', 
               'metrics', 'KPI', 'ROI', 'segmentation', 'targeting', 'funnel']
  };

  // Contextual keywords for interview detection
  private static interviewKeywords = [
    'interview', 'job', 'career', 'position', 'role', 'hiring', 'candidate', 
    'experience', 'skills', 'qualification', 'background', 'resume', 'cv',
    'tell me about yourself', 'strengths', 'weaknesses', 'why should we hire',
    'previous experience', 'team work', 'challenge', 'leadership', 'achievement'
  ];

  static async initialize() {
    if (!this.initialized) {
      try {
        console.log('MediaAnalysisService: Starting initialization...');
        
        // Initialize the whisper model for speech recognition
        this.transcriber = await pipeline(
          'automatic-speech-recognition',
          'openai/whisper-tiny.en',
          // Use type assertion to bypass the type checking
          { chunk_length_s: 30 } as any
        );
        
        console.log('MediaAnalysisService: Transcriber initialized');
        
        // Initialize sentiment analyzer for tone analysis
        try {
          this.sentimentAnalyzer = await pipeline(
            'sentiment-analysis',
            'distilbert-base-uncased-finetuned-sst-2-english'
          );
          console.log('MediaAnalysisService: Sentiment analyzer initialized');
        } catch (error) {
          console.warn('MediaAnalysisService: Failed to initialize sentiment analyzer:', error);
        }
        
        // Initialize text classifier for context detection
        try {
          this.textClassifier = await pipeline(
            'text-classification',
            'facebook/bart-large-mnli'
          );
          console.log('MediaAnalysisService: Text classifier initialized');
        } catch (error) {
          console.warn('MediaAnalysisService: Failed to initialize text classifier:', error);
        }
        
        this.initialized = true;
        console.log('MediaAnalysisService: Initialized successfully');
      } catch (error) {
        console.error('MediaAnalysisService: Failed to initialize:', error);
        throw error;
      }
    }
  }

  // Detect if the content is likely from an interview
  private static async detectInterviewContext(text: string): Promise<{
    isInterview: boolean;
    confidence: number;
    relevantTerms: string[];
  }> {
    if (!text || text.length < 10) {
      return { isInterview: false, confidence: 0, relevantTerms: [] };
    }
    
    // Count occurrences of interview-related keywords
    const lowerText = text.toLowerCase();
    const relevantTerms: string[] = [];
    
    for (const keyword of this.interviewKeywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        relevantTerms.push(keyword);
      }
    }
    
    // Calculate confidence based on keyword density
    const wordCount = text.split(/\s+/).length;
    const keywordDensity = relevantTerms.length / (wordCount > 0 ? wordCount : 1);
    const confidence = Math.min(100, keywordDensity * 500); // Scale to a reasonable percentage
    
    // Advanced classification if text classifier is available
    if (this.textClassifier && text.length > 50) {
      try {
        // Try to classify the text against interview context
        const result = await this.textClassifier(text, {
          hypothesis: "This is content from a job interview.",
        });
        
        if (Array.isArray(result) && result.length > 0) {
          const classificationScore = result[0].score || 0;
          // Combine both methods for better accuracy
          const combinedConfidence = (confidence + classificationScore * 100) / 2;
          return {
            isInterview: combinedConfidence > 40,
            confidence: combinedConfidence,
            relevantTerms
          };
        }
      } catch (error) {
        console.warn("Interview context classification failed:", error);
      }
    }
    
    return {
      isInterview: confidence > 30,
      confidence,
      relevantTerms
    };
  }

  // Analyze sentiment and emotion in speech
  private static async analyzeSentiment(text: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    emotionalTone: string;
  }> {
    if (!this.sentimentAnalyzer || !text || text.length < 5) {
      return { 
        sentiment: 'neutral', 
        confidence: 0,
        emotionalTone: 'undetermined'
      };
    }
    
    try {
      const result = await this.sentimentAnalyzer(text);
      if (Array.isArray(result) && result.length > 0) {
        const label = result[0].label?.toLowerCase() || 'neutral';
        const score = result[0].score || 0.5;
        
        // Determine emotional tone based on words and phrases
        const emotionalKeywords = {
          enthusiastic: ['excited', 'passionate', 'love', 'enjoy', 'thrilled'],
          confident: ['confident', 'sure', 'certain', 'definitely', 'absolutely'],
          hesitant: ['maybe', 'perhaps', 'might', 'possibly', 'unsure'],
          nervous: ['nervous', 'worried', 'concern', 'afraid', 'stress']
        };
        
        let dominantEmotion = 'neutral';
        let highestCount = 0;
        
        const lowerText = text.toLowerCase();
        for (const [emotion, keywords] of Object.entries(emotionalKeywords)) {
          const count = keywords.filter(word => lowerText.includes(word)).length;
          if (count > highestCount) {
            highestCount = count;
            dominantEmotion = emotion;
          }
        }
        
        // Default to sentiment if no emotion is detected
        const emotionalTone = highestCount > 0 ? dominantEmotion : 
          (label === 'positive' ? 'confident' : 
          (label === 'negative' ? 'nervous' : 'neutral'));
          
        return {
          sentiment: label as 'positive' | 'negative' | 'neutral',
          confidence: score * 100,
          emotionalTone
        };
      }
    } catch (error) {
      console.warn("Sentiment analysis failed:", error);
    }
    
    return { 
      sentiment: 'neutral', 
      confidence: 50,
      emotionalTone: 'neutral'
    };
  }

  static async analyzeSpeech(audioBlob: Blob): Promise<{
    hasSpokenContent: boolean;
    transcription: string;
    speechDuration: number;
    wordCount: number;
    fillerWordCount: number;
    speechQuality: 'poor' | 'fair' | 'good' | 'excellent';
    confidenceScore: number;
    pacing: {
      wordsPerMinute: number;
      pauseFrequency: number;
      paceConsistency: number;
      score: number;
    };
    vocabulary: {
      diversity: number;
      complexity: number;
      domainSpecificity: number;
      score: number;
    };
    sentiment: {
      positivity: number;
      enthusiasm: number;
      confidence: number;
      score: number;
    };
    structure: {
      organization: number;
      coherence: number;
      completeness: number;
      score: number;
    };
    contextRelevance: {
      isInterviewContent: boolean;
      contextConfidence: number;
      relevantTerms: string[];
    };
    advancedInsights: {
      keyPoints: string[];
      improvementAreas: string[];
      communicationStyle: string;
    };
  }> {
    try {
      await this.initialize();
      
      // Convert blob to array buffer for analysis
      const arrayBuffer = await audioBlob.arrayBuffer();
      
      console.log('MediaAnalysisService: Starting speech transcription...');
      
      const result = await this.transcriber(arrayBuffer, 
        // Use type assertion to bypass the type checking
        { chunk_length_s: 30 } as any
      );
      
      const transcription = result.text.trim();
      console.log('MediaAnalysisService: Transcription result:', transcription);
      
      // Basic word analysis
      const words = transcription.split(/\s+/).filter(word => word.length > 0);
      const wordCount = words.length;
      
      // Detect pauses using punctuation as a proxy
      const sentenceCount = (transcription.match(/[.!?]+/g) || []).length;
      const pauseFrequency = sentenceCount > 0 ? sentenceCount / wordCount : 0;
      
      // Detect filler words
      const fillerWordCount = words.filter(word => 
        this.commonFillerWords.includes(word.toLowerCase())
      ).length;
      
      // Calculate speech duration in seconds
      const speechDuration = audioBlob.size > 0 ? audioBlob.size / 16000 : 0;
      
      // Vocabulary diversity (unique words ratio)
      const uniqueWords = new Set(words.map(w => w.toLowerCase()));
      const vocabularyDiversity = wordCount > 0 ? uniqueWords.size / wordCount : 0;
      
      // Word complexity (average word length as a proxy)
      const avgWordLength = words.length > 0 
        ? words.reduce((sum, word) => sum + word.length, 0) / words.length 
        : 0;
      const vocabularyComplexity = Math.min(10, avgWordLength) / 10;
      
      // Domain specificity - check for technical terms in different domains
      let domainMatches = 0;
      const allTerms = Object.values(this.technicalTerms).flat();
      words.forEach(word => {
        if (allTerms.includes(word.toLowerCase())) {
          domainMatches++;
        }
      });
      const domainSpecificity = wordCount > 0 ? domainMatches / wordCount : 0;
      
      // Basic sentiment analysis (positive/negative words)
      const positiveWords = ['good', 'great', 'excellent', 'amazing', 'awesome', 'fantastic', 
                            'wonderful', 'best', 'positive', 'success', 'successful', 'achieve'];
      const enthusiasmWords = ['excited', 'passionate', 'love', 'enjoy', 'thrilled', 'eager',
                              'enthusiastic', 'motivated', 'inspired', 'energetic'];
      const confidenceWords = ['confident', 'sure', 'certain', 'definitely', 'absolutely',
                              'undoubtedly', 'clearly', 'precisely', 'exactly'];
      
      const positivityScore = wordCount > 0 
        ? words.filter(w => positiveWords.includes(w.toLowerCase())).length / wordCount * 10
        : 0;
      
      const enthusiasmScore = wordCount > 0
        ? words.filter(w => enthusiasmWords.includes(w.toLowerCase())).length / wordCount * 10
        : 0;
        
      const confidenceWordsScore = wordCount > 0
        ? words.filter(w => confidenceWords.includes(w.toLowerCase())).length / wordCount * 10
        : 0;
      
      // Structure analysis (rudimentary)
      const hasConclusionMarkers = /in\s+conclusion|to\s+summarize|finally|in\s+summary|to\s+sum\s+up/i.test(transcription);
      const hasIntroductionMarkers = /first|firstly|to\s+begin|starting\s+with|initially/i.test(transcription);
      const hasTransitionMarkers = /however|moreover|furthermore|additionally|in\s+addition|on\s+the\s+other\s+hand/i.test(transcription);
      
      const organizationScore = (hasIntroductionMarkers ? 33 : 0) + 
                               (hasTransitionMarkers ? 33 : 0) + 
                               (hasConclusionMarkers ? 34 : 0);
      
      // Coherence - how well sentences connect (using transition words as proxy)
      const transitionWords = ['however', 'therefore', 'thus', 'consequently', 'moreover',
                               'furthermore', 'additionally', 'although', 'nevertheless'];
      const transitionCount = words.filter(w => transitionWords.includes(w.toLowerCase())).length;
      const coherenceScore = Math.min(100, transitionCount * 20);
      
      // Completeness - based on word count and sentence structure
      const completenessScore = Math.min(100, wordCount / 2);
      
      // Words per minute
      const wordsPerMinute = speechDuration > 0 
        ? (wordCount / (speechDuration / 60)) 
        : 0;
      
      // Pace consistency (rudimentary measure using sentence length variance)
      const sentences = transcription.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
      
      let paceConsistency = 0;
      if (sentenceLengths.length > 1) {
        const avgSentenceLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
        const variance = sentenceLengths.reduce((sum, length) => sum + Math.pow(length - avgSentenceLength, 2), 0) / sentenceLengths.length;
        // Higher variance means less consistency
        paceConsistency = Math.max(0, 100 - (variance * 5));
      }
      
      // Calculate combined score for pacing
      const pacingScore = (
        (wordsPerMinute > 0 && wordsPerMinute < 180 ? 100 : Math.max(0, 100 - Math.abs(wordsPerMinute - 150))) +
        paceConsistency
      ) / 2;
      
      // Calculate vocabulary score
      const vocabularyScore = (
        vocabularyDiversity * 100 +
        vocabularyComplexity * 100 +
        domainSpecificity * 100
      ) / 3;
      
      // Calculate sentiment score
      const sentimentScore = (
        positivityScore * 10 +
        enthusiasmScore * 10 +
        confidenceWordsScore * 10
      ) / 3;
      
      // Calculate structure score
      const structureScore = (
        organizationScore +
        coherenceScore +
        completenessScore
      ) / 3;
      
      // Calculate speech quality based on multiple factors
      const fillerWordRatio = wordCount > 0 ? fillerWordCount / wordCount : 0;
      const contentDensity = wordCount / (speechDuration || 1); // words per second
      
      // Determine if there's meaningful speech content
      const hasSpokenContent = wordCount > 5 && contentDensity > 0.5;
      
      // Calculate confidence score (0-100)
      let confidenceScore = 0;
      if (wordCount > 0) {
        // Base score on word count (up to 30 points)
        confidenceScore += Math.min(30, wordCount * 0.3);
        
        // Subtract for high filler word ratio (up to -30 points)
        confidenceScore -= Math.min(30, fillerWordRatio * 100);
        
        // Add for content density (up to 20 points)
        confidenceScore += Math.min(20, contentDensity * 10);
        
        // Add for vocabulary diversity (up to 20 points)
        confidenceScore += Math.min(20, vocabularyDiversity * 100);
        
        // Add for structure (up to 30 points)
        confidenceScore += Math.min(30, (organizationScore + coherenceScore) / 2 * 0.3);
        
        // Ensure score is between 0-100
        confidenceScore = Math.max(0, Math.min(100, confidenceScore));
      }
      
      // Calculate speech quality rating
      let speechQuality: 'poor' | 'fair' | 'good' | 'excellent' = 'poor';
      if (confidenceScore >= 80) speechQuality = 'excellent';
      else if (confidenceScore >= 60) speechQuality = 'good';
      else if (confidenceScore >= 30) speechQuality = 'fair';
      
      // Advanced context detection - determine if the content is interview-related
      const contextAnalysis = await this.detectInterviewContext(transcription);
      
      // Advanced sentiment analysis
      const sentimentAnalysis = await this.analyzeSentiment(transcription);
      
      // Extract key points from the transcription (simplified implementation)
      const keyPoints: string[] = [];
      // Extract sentences that seem important based on keywords and position
      const importantSentences = sentences.filter(sentence => {
        const lowerSentence = sentence.toLowerCase();
        const hasSignificantWord = ['important', 'key', 'main', 'significant', 'crucial', 'essential']
          .some(word => lowerSentence.includes(word));
        
        // Consider first and last sentences often contain important information
        const isIntroOrConclusion = sentences.indexOf(sentence) === 0 || 
                                  sentences.indexOf(sentence) === sentences.length - 1;
                                  
        return hasSignificantWord || isIntroOrConclusion;
      });
      
      // Add up to 3 key points
      importantSentences.slice(0, 3).forEach(sentence => {
        if (sentence.length > 10) {
          keyPoints.push(sentence.trim());
        }
      });
      
      // Identify improvement areas
      const improvementAreas: string[] = [];
      
      if (fillerWordRatio > 0.05) {
        improvementAreas.push("Reduce filler words like 'um', 'uh', 'like'");
      }
      
      if (wordsPerMinute > 180) {
        improvementAreas.push("Consider speaking more slowly for better clarity");
      } else if (wordsPerMinute < 120 && wordCount > 30) {
        improvementAreas.push("Consider increasing your speaking pace to maintain engagement");
      }
      
      if (coherenceScore < 50 && wordCount > 50) {
        improvementAreas.push("Use more transition words to improve the flow of your speech");
      }
      
      if (vocabularyDiversity < 0.6 && wordCount > 50) {
        improvementAreas.push("Try to use a more diverse vocabulary");
      }
      
      // Determine communication style
      let communicationStyle = "Balanced";
      
      if (sentimentAnalysis.sentiment === 'positive' && enthusiasmScore > 5) {
        communicationStyle = "Enthusiastic";
      } else if (sentimentAnalysis.confidence > 70) {
        communicationStyle = "Confident";
      } else if (fillerWordRatio > 0.08) {
        communicationStyle = "Hesitant";
      } else if (coherenceScore > 70 && organizationScore > 70) {
        communicationStyle = "Structured";
      } else if (sentimentAnalysis.sentiment === 'negative') {
        communicationStyle = "Reserved";
      }
      
      console.log('MediaAnalysisService: Comprehensive analysis results:', {
        transcription: transcription.substring(0, 100) + '...',
        wordCount,
        fillerWordCount,
        fillerWordRatio,
        contentDensity,
        hasSpokenContent,
        speechDuration,
        wordsPerMinute,
        vocabularyDiversity,
        vocabularyComplexity,
        domainSpecificity,
        positiveSentiment: positivityScore,
        enthusiasm: enthusiasmScore,
        structure: {
          organization: organizationScore,
          coherence: coherenceScore,
          completeness: completenessScore
        },
        confidenceScore,
        speechQuality,
        contextRelevance: contextAnalysis,
        communicationStyle
      });
      
      return {
        hasSpokenContent,
        transcription,
        speechDuration,
        wordCount,
        fillerWordCount,
        speechQuality,
        confidenceScore,
        pacing: {
          wordsPerMinute,
          pauseFrequency,
          paceConsistency,
          score: pacingScore
        },
        vocabulary: {
          diversity: Math.round(vocabularyDiversity * 100),
          complexity: Math.round(vocabularyComplexity * 100),
          domainSpecificity: Math.round(domainSpecificity * 100),
          score: Math.round(vocabularyScore)
        },
        sentiment: {
          positivity: Math.round(positivityScore * 10),
          enthusiasm: Math.round(enthusiasmScore * 10),
          confidence: Math.round(confidenceWordsScore * 10),
          score: Math.round(sentimentScore)
        },
        structure: {
          organization: Math.round(organizationScore),
          coherence: Math.round(coherenceScore),
          completeness: Math.round(completenessScore),
          score: Math.round(structureScore)
        },
        contextRelevance: {
          isInterviewContent: contextAnalysis.isInterview,
          contextConfidence: contextAnalysis.confidence,
          relevantTerms: contextAnalysis.relevantTerms
        },
        advancedInsights: {
          keyPoints,
          improvementAreas,
          communicationStyle
        }
      };
    } catch (error) {
      console.error('MediaAnalysisService: Speech analysis failed:', error);
      return {
        hasSpokenContent: false,
        transcription: '',
        speechDuration: 0,
        wordCount: 0,
        fillerWordCount: 0,
        speechQuality: 'poor',
        confidenceScore: 0,
        pacing: {
          wordsPerMinute: 0,
          pauseFrequency: 0,
          paceConsistency: 0,
          score: 0
        },
        vocabulary: {
          diversity: 0,
          complexity: 0,
          domainSpecificity: 0,
          score: 0
        },
        sentiment: {
          positivity: 0,
          enthusiasm: 0,
          confidence: 0,
          score: 0
        },
        structure: {
          organization: 0,
          coherence: 0,
          completeness: 0,
          score: 0
        },
        contextRelevance: {
          isInterviewContent: false,
          contextConfidence: 0,
          relevantTerms: []
        },
        advancedInsights: {
          keyPoints: [],
          improvementAreas: ["Unable to analyze speech due to an error."],
          communicationStyle: "Undetermined"
        }
      };
    }
  }
}
