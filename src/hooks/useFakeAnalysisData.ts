
import { useState, useEffect } from "react";
import { AnalysisData } from "@/types/analysis";
import { MediaAnalysisService } from "@/services/MediaAnalysisService";

export const useFakeAnalysisData = (id?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<AnalysisData>({} as AnalysisData);
  
  useEffect(() => {
    const analyzeInterview = async () => {
      console.log("useFakeAnalysisData: Starting analysis");
      setIsLoading(true);
      
      try {
        // Get session data
        const storedData = sessionStorage.getItem('interviewData');
        if (!storedData) {
          throw new Error('No interview data found');
        }

        const sessionData = JSON.parse(storedData);
        console.log("useFakeAnalysisData: Retrieved session data:", sessionData);
        
        // Convert the video blob to audio for analysis
        const videoBlob = await fetch(sessionData.videoUrl).then(r => r.blob());
        
        // Analyze speech content with enhanced analysis
        const speechAnalysis = await MediaAnalysisService.analyzeSpeech(videoBlob);
        console.log("Speech analysis results:", speechAnalysis);
        
        // Update session data with analysis results
        const hasContent = speechAnalysis.hasSpokenContent;
        const speechDuration = speechAnalysis.speechDuration;
        const speechQuality = speechAnalysis.speechQuality;
        const confidenceScore = speechAnalysis.confidenceScore;
        
        // Store enhanced analysis in session storage for future use
        sessionStorage.setItem('interviewData', JSON.stringify({
          ...sessionData,
          hasSpokenContent: hasContent,
          speechDuration: speechDuration,
          wordCount: speechAnalysis.wordCount,
          fillerWordCount: speechAnalysis.fillerWordCount,
          speechQuality: speechQuality,
          confidenceScore: confidenceScore,
          transcription: speechAnalysis.transcription
        }));
        
        // Calculate scores based on actual analysis
        const verbalScore = hasContent ? Math.min(100, Math.max(0, confidenceScore)) : 0;
        const eyeContactScore = Math.floor(Math.random() * 30) + 60; // This would come from actual video analysis
        const engagementScore = hasContent ? Math.floor(Math.random() * 20) + 70 : 30;
        
        // Set data with real analysis results
        setData({
          id: id || "123456",
          videoUrl: sessionData.videoUrl,
          overallScore: hasContent ? Math.floor((verbalScore + eyeContactScore + engagementScore) / 3) : 25,
          scores: {
            verbal: verbalScore,
            nonVerbal: eyeContactScore,
            content: hasContent ? Math.min(100, speechAnalysis.wordCount * 2) : 0,
            engagement: engagementScore
          },
          detailedScores: {
            clarity: hasContent ? Math.min(100, confidenceScore * 0.8) : 0,
            conciseness: hasContent ? Math.min(100, 100 - (speechAnalysis.fillerWordCount * 10)) : 0,
            eyeContact: eyeContactScore,
            posture: Math.floor(Math.random() * 20) + 60,
            relevance: hasContent ? Math.min(100, confidenceScore * 0.7) : 0,
            confidence: confidenceScore
          },
          summary: hasContent 
            ? `Your interview included ${speechAnalysis.wordCount} words over ${Math.round(speechDuration)} seconds. Speech quality was rated as ${speechQuality}. ${speechAnalysis.fillerWordCount > 5 ? 'Consider reducing filler words.' : 'Good job keeping filler words to a minimum!'}`
            : "Our analysis detected minimal or no meaningful speech during your interview. This could be due to technical issues or insufficient verbal responses.",
          strengths: hasContent 
            ? [
                confidenceScore > 60 ? "Clear verbal communication" : "Attempted verbal responses",
                "Professional appearance",
                eyeContactScore > 75 ? "Strong eye contact" : "Acceptable eye contact",
                speechAnalysis.fillerWordCount < 5 ? "Limited use of filler words" : null
              ].filter(Boolean)
            : [
                "You were present on camera",
                "Your visual setup was adequate"
              ],
          improvements: hasContent
            ? [
                speechAnalysis.wordCount < 30 ? "Provide more detailed responses" : "Maintain current response length",
                speechAnalysis.fillerWordCount > 5 ? `Reduce filler words (detected ${speechAnalysis.fillerWordCount})` : null,
                "Improve speech clarity and pace",
                "Enhance engagement through body language"
              ].filter(Boolean)
            : [
                "No meaningful speech detected for analysis",
                "Verbal participation is essential",
                "Responses were insufficient or absent"
              ],
          recommendations: [
            "Practice speaking clearly and confidently",
            "Prepare structured responses to common questions",
            "Maintain consistent eye contact",
            "Show enthusiasm through facial expressions and tone"
          ],
          feedback: {
            verbal: {
              clarity: hasContent 
                ? `Speech was ${speechQuality === 'excellent' || speechQuality === 'good' ? 'clear and well-articulated' : 'somewhat unclear or monotone'}. ${speechAnalysis.transcription.substring(0, 100)}...`
                : "Insufficient speech detected for analysis.",
              vocabulary: hasContent
                ? `Used ${speechAnalysis.wordCount} words throughout the interview. ${speechAnalysis.wordCount < 30 ? 'Consider expanding your responses.' : 'Good vocabulary usage.'}`
                : "No substantial verbal content to evaluate.",
              fillerWords: hasContent
                ? `Detected ${speechAnalysis.fillerWordCount} filler words. ${speechAnalysis.fillerWordCount > 5 ? 'Work on reducing these for clearer communication.' : 'Good job minimizing filler words!'}`
                : "No speech patterns to analyze."
            },
            nonVerbal: {
              eyeContact: `Eye contact was ${eyeContactScore > 75 ? 'strong' : 'adequate'}.`,
              facialExpressions: "Facial expressions were appropriate but could be more engaging.",
              posture: "Maintained professional posture throughout the interview."
            },
            content: {
              relevance: hasContent
                ? `Responses were ${speechAnalysis.wordCount > 20 ? 'relevant and on-topic' : 'too brief to fully evaluate'}.`
                : "Unable to evaluate content due to insufficient speech.",
              structure: hasContent
                ? `Response structure was ${speechAnalysis.wordCount > 30 ? 'well-organized' : 'basic and needs development'}.`
                : "No response structure to evaluate.",
              examples: hasContent
                ? "Some examples provided, but could be more specific."
                : "No examples detected in the responses."
            },
            overall: {
              confidence: `Confidence level appears ${confidenceScore > 75 ? 'strong' : confidenceScore > 50 ? 'moderate' : 'low'}.`,
              engagement: `Engagement level was ${hasContent ? 'acceptable' : 'insufficient'}.`,
              appearance: "Professional appearance maintained throughout the interview."
            }
          },
          transcription: speechAnalysis.transcription,
          wordCount: speechAnalysis.wordCount,
          fillerWordCount: speechAnalysis.fillerWordCount,
          speechDuration: speechDuration,
          confidenceScore: confidenceScore,
          speechQuality: speechQuality
        });
        
      } catch (error) {
        console.error("useFakeAnalysisData: Error during analysis:", error);
        // Set default data for error case
        setData({
          id: id || "123456",
          videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-female-vlogger-recording-her-podcast-42665-large.mp4",
          overallScore: 25,
          scores: {
            verbal: 0,  // No verbal without speech
            nonVerbal: 32,
            content: 0,  // No content without speech
            engagement: 15
          },
          detailedScores: {
            clarity: 0,
            conciseness: 0,
            eyeContact: 38,
            posture: 42,
            relevance: 0,
            confidence: 22
          },
          summary: "Our analysis detected minimal or no speech during your interview. This could be due to technical issues with your microphone, extreme nervousness affecting your ability to speak, or not engaging with the interview questions. An interview requires active verbal participation to be effective.",
          strengths: [
            "You were present on camera",
            "Your visual setup was adequate",
          ],
          improvements: [
            "No meaningful speech detected for analysis",
            "Verbal participation is essential in interviews",
            "Responses to questions were insufficient or absent",
            "Engagement level appeared extremely low"
          ],
          recommendations: [
            "Ensure your microphone is properly connected and functioning",
            "Practice speaking aloud, even to yourself, to overcome extreme nervousness",
            "Prepare responses to common interview questions in advance",
            "Consider recording practice sessions to build confidence",
            "Remember that interviewers need to hear your thoughts and experiences to evaluate you"
          ],
          feedback: {
            verbal: {
              clarity: "We couldn't properly assess your speech clarity as there was insufficient speaking detected during the interview. For interviews to be effective, you must speak clearly and audibly.",
              vocabulary: "No substantial verbal content was detected to evaluate your vocabulary usage or language skills. Remember that demonstrating your communication abilities is crucial in interviews.",
              fillerWords: "With minimal speech detected, we couldn't analyze for filler words or other verbal patterns. In interviews, even with nervousness, it's important to verbalize your thoughts."
            },
            nonVerbal: {
              eyeContact: "While you were visible on camera, the lack of verbal engagement made it impossible to assess if eye contact was appropriate. Eye contact normally should be coordinated with your verbal responses.",
              facialExpressions: "Your facial expressions were limited or neutral, which combined with minimal verbal communication, created an impression of disengagement. Expressive faces help convey enthusiasm and interest.",
              posture: "Your posture appeared somewhat tense or rigid, which can be interpreted as extreme nervousness. In interview settings, a balance of upright but relaxed posture helps convey confidence."
            },
            content: {
              relevance: "With insufficient verbal responses, we couldn't evaluate the relevance of your answers. Interviews require substantive responses to questions to assess your qualifications.",
              structure: "No response structure could be analyzed due to minimal verbal content. Structured answers with clear beginnings, middles, and conclusions are essential in interviews.",
              examples: "We couldn't identify any specific examples or illustrations in your responses. Concrete examples from your experience are crucial for demonstrating your capabilities to interviewers."
            },
            overall: {
              confidence: "Your overall confidence level appeared very low, as evidenced by minimal verbal participation. Remember that some nervousness is normal, but you must still communicate effectively.",
              engagement: "Your engagement level was insufficient for an effective interview. Active participation, even when nervous, is necessary to create a connection with interviewers.",
              appearance: "While your visual appearance was acceptable, the lack of verbal engagement overshadowed other aspects of your presentation. Interviews require both professional appearance and active communication."
            }
          }
        });
      }
      
      setIsLoading(false);
    };
    
    analyzeInterview();
  }, [id]);
  
  return { data, isLoading };
};
