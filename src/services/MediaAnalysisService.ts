
import { pipeline } from '@huggingface/transformers';

export class MediaAnalysisService {
  private static transcriber: any = null;
  private static initialized = false;

  static async initialize() {
    if (!this.initialized) {
      try {
        // Initialize the whisper model for speech recognition
        this.transcriber = await pipeline(
          'automatic-speech-recognition',
          'openai/whisper-tiny.en'
        );
        this.initialized = true;
        console.log('MediaAnalysisService: Initialized successfully');
      } catch (error) {
        console.error('MediaAnalysisService: Failed to initialize:', error);
        throw error;
      }
    }
  }

  static async analyzeSpeech(audioBlob: Blob): Promise<{
    hasSpokenContent: boolean;
    transcription: string;
    speechDuration: number;
    wordCount: number;
    fillerWordCount: number;
    speechQuality: 'poor' | 'fair' | 'good' | 'excellent';
    confidenceScore: number;
  }> {
    try {
      await this.initialize();
      
      // Convert blob to array buffer for analysis
      const arrayBuffer = await audioBlob.arrayBuffer();
      
      console.log('MediaAnalysisService: Starting speech transcription...');
      
      const result = await this.transcriber(arrayBuffer, {
        task: 'transcribe',
        chunk_length_s: 30
      });
      
      const transcription = result.text.trim();
      console.log('MediaAnalysisService: Transcription result:', transcription);
      
      // Enhanced word analysis
      const words = transcription.split(/\s+/).filter(word => word.length > 0);
      const wordCount = words.length;
      
      // Detect filler words (um, uh, like, you know, etc.)
      const fillerWords = ['um', 'uh', 'like', 'you know', 'actually', 'basically', 'literally', 'sort of', 'kind of'];
      const fillerWordCount = words.filter(word => 
        fillerWords.includes(word.toLowerCase())
      ).length;
      
      // Calculate speech quality based on multiple factors
      const fillerWordRatio = wordCount > 0 ? fillerWordCount / wordCount : 0;
      const contentDensity = wordCount / (audioBlob.size / 16000); // words per second
      
      // Determine if there's meaningful speech content
      // More sophisticated detection algorithm
      const hasSpokenContent = wordCount > 5 && contentDensity > 0.5;
      
      // Calculate confidence score (0-100)
      let confidenceScore = 0;
      if (wordCount > 0) {
        // Base score on word count (up to 50 points)
        confidenceScore += Math.min(50, wordCount * 0.5);
        
        // Subtract for high filler word ratio (up to -30 points)
        confidenceScore -= Math.min(30, fillerWordRatio * 100);
        
        // Add for content density (up to 50 points)
        confidenceScore += Math.min(50, contentDensity * 20);
        
        // Ensure score is between 0-100
        confidenceScore = Math.max(0, Math.min(100, confidenceScore));
      }
      
      // Calculate speech quality rating
      let speechQuality: 'poor' | 'fair' | 'good' | 'excellent' = 'poor';
      if (confidenceScore >= 80) speechQuality = 'excellent';
      else if (confidenceScore >= 60) speechQuality = 'good';
      else if (confidenceScore >= 30) speechQuality = 'fair';
      
      // Calculate duration in seconds based on audio content
      const speechDuration = audioBlob.size > 0 ? audioBlob.size / 16000 : 0;
      
      console.log('Speech Analysis Results:', {
        transcription,
        wordCount,
        fillerWordCount,
        fillerWordRatio,
        contentDensity,
        hasSpokenContent,
        speechDuration,
        confidenceScore,
        speechQuality
      });
      
      return {
        hasSpokenContent,
        transcription,
        speechDuration,
        wordCount,
        fillerWordCount,
        speechQuality,
        confidenceScore
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
        confidenceScore: 0
      };
    }
  }
}
