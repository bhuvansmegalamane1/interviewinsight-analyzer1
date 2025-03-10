
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
  }> {
    try {
      await this.initialize();
      
      // Convert blob to array buffer for analysis
      const arrayBuffer = await audioBlob.arrayBuffer();
      const result = await this.transcriber(arrayBuffer, {
        task: 'transcribe',
        chunk_length_s: 30
      });
      
      const transcription = result.text.trim();
      const words = transcription.split(/\s+/).filter(word => word.length > 0);
      
      // Determine if there's meaningful speech content
      // More than just filler sounds or single words
      const hasSpokenContent = words.length > 3;
      
      // Calculate duration in seconds based on audio content
      const speechDuration = audioBlob.size > 0 ? audioBlob.size / 16000 : 0;
      
      console.log('Speech Analysis Results:', {
        transcription,
        wordCount: words.length,
        hasSpokenContent,
        speechDuration
      });
      
      return {
        hasSpokenContent,
        transcription,
        speechDuration,
        wordCount: words.length
      };
    } catch (error) {
      console.error('MediaAnalysisService: Speech analysis failed:', error);
      return {
        hasSpokenContent: false,
        transcription: '',
        speechDuration: 0,
        wordCount: 0
      };
    }
  }
}
