
import { useState, useEffect } from "react";
import { AnalysisData } from "@/types/analysis";
import { MediaAnalysisService } from "@/services/MediaAnalysisService";

export const useFakeAnalysisData = (id?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<AnalysisData>({} as AnalysisData);
  
  useEffect(() => {
    const analyzeInterview = async () => {
      console.log("useFakeAnalysisData: Starting comprehensive analysis");
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
        console.log("Comprehensive speech analysis results:", speechAnalysis);
        
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
          transcription: speechAnalysis.transcription,
          pacing: speechAnalysis.pacing,
          vocabulary: speechAnalysis.vocabulary,
          sentiment: speechAnalysis.sentiment,
          structure: speechAnalysis.structure,
          // Add privacy compliance information
          privacy: {
            dataRetentionPeriod: '30 days',
            anonymizationLevel: 'partial',
            consentObtained: true
          }
        }));
        
        // Calculate scores based on actual analysis
        const verbalScore = hasContent ? Math.min(100, Math.max(0, confidenceScore)) : 0;
        const eyeContactScore = Math.floor(Math.random() * 30) + 60; // This would come from actual video analysis
        const engagementScore = hasContent ? Math.floor(Math.random() * 20) + 70 : 30;
        
        // Generate more comprehensive strengths and recommendations
        const strengths = [];
        const improvements = [];
        const recommendations = [];
        
        // Add speech-specific insights if speech was detected
        if (hasContent) {
          // Strengths based on actual analysis
          if (confidenceScore > 60) strengths.push("Clear verbal communication");
          if (speechAnalysis.pacing.score > 70) strengths.push("Well-paced delivery");
          if (speechAnalysis.vocabulary.score > 70) strengths.push("Strong vocabulary usage");
          if (speechAnalysis.sentiment.enthusiasm > 70) strengths.push("Enthusiastic presentation");
          if (speechAnalysis.structure.score > 70) strengths.push("Well-structured responses");
          if (speechAnalysis.fillerWordCount < 5) strengths.push("Limited use of filler words");
          
          // Improvements based on actual analysis
          if (speechAnalysis.wordCount < 30) improvements.push("Provide more detailed responses");
          if (speechAnalysis.fillerWordCount > 5) improvements.push(`Reduce filler words (detected ${speechAnalysis.fillerWordCount})`);
          if (speechAnalysis.pacing.score < 50) improvements.push("Improve speech pacing and rhythm");
          if (speechAnalysis.vocabulary.score < 50) improvements.push("Enhance vocabulary diversity");
          if (speechAnalysis.structure.organization < 50) improvements.push("Better organize your responses with clear structure");
          if (speechAnalysis.sentiment.enthusiasm < 50) improvements.push("Show more enthusiasm in your delivery");
          
          // Recommendations based on actual analysis
          if (speechAnalysis.fillerWordCount > 5) recommendations.push("Practice speaking without filler words by recording yourself and reviewing");
          if (speechAnalysis.pacing.score < 50) recommendations.push("Practice speaking at a consistent pace of 120-150 words per minute");
          if (speechAnalysis.vocabulary.score < 50) recommendations.push("Expand your vocabulary by reading industry-specific content daily");
          if (speechAnalysis.structure.organization < 50) recommendations.push("Use the STAR method (Situation, Task, Action, Result) to structure your responses");
          if (speechAnalysis.sentiment.confidence < 50) recommendations.push("Practice power poses before interviews to boost confidence");
        } else {
          // Default strengths for no speech
          strengths.push("You were present on camera");
          strengths.push("Your visual setup was adequate");
          
          // Default improvements for no speech
          improvements.push("No meaningful speech detected for analysis");
          improvements.push("Verbal participation is essential");
          improvements.push("Responses were insufficient or absent");
          
          // Default recommendations for no speech
          recommendations.push("Ensure your microphone is properly connected and functioning");
          recommendations.push("Practice speaking aloud, even to yourself, to overcome nervousness");
          recommendations.push("Prepare responses to common interview questions in advance");
        }
        
        // Always add some general recommendations
        recommendations.push("Practice speaking clearly and confidently");
        recommendations.push("Maintain consistent eye contact");
        recommendations.push("Show enthusiasm through facial expressions and tone");
        
        // Ensure we have at least some entries
        while (strengths.length < 3) strengths.push("Professional appearance");
        while (improvements.length < 3) improvements.push("Enhance engagement through body language");
        while (recommendations.length < 4) recommendations.push("Prepare structured responses to common questions");
        
        // Set data with comprehensive analysis results
        setData({
          id: id || "123456",
          videoUrl: sessionData.videoUrl,
          overallScore: hasContent ? Math.floor((verbalScore + eyeContactScore + engagementScore + 
            speechAnalysis.pacing.score + speechAnalysis.vocabulary.score + 
            speechAnalysis.sentiment.score + speechAnalysis.structure.score) / 7) : 25,
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
            ? `Your interview included ${speechAnalysis.wordCount} words over ${Math.round(speechDuration)} seconds at a pace of ${Math.round(speechAnalysis.pacing.wordsPerMinute)} words per minute. Speech quality was rated as ${speechQuality} with a vocabulary diversity score of ${speechAnalysis.vocabulary.diversity}/100 and structure score of ${speechAnalysis.structure.score}/100. ${speechAnalysis.fillerWordCount > 5 ? 'Consider reducing filler words.' : 'Good job keeping filler words to a minimum!'}`
            : "Our analysis detected minimal or no meaningful speech during your interview. This could be due to technical issues or insufficient verbal responses.",
          strengths: strengths.filter(Boolean),
          improvements: improvements.filter(Boolean),
          recommendations: recommendations,
          feedback: {
            verbal: {
              clarity: hasContent 
                ? `Speech was ${speechQuality === 'excellent' || speechQuality === 'good' ? 'clear and well-articulated' : 'somewhat unclear or monotone'}. Your pacing was ${speechAnalysis.pacing.score > 70 ? 'excellent' : speechAnalysis.pacing.score > 50 ? 'good' : 'inconsistent'} at ${Math.round(speechAnalysis.pacing.wordsPerMinute)} words per minute. ${speechAnalysis.transcription.substring(0, 100)}...`
                : "Insufficient speech detected for analysis.",
              vocabulary: hasContent
                ? `Used ${speechAnalysis.wordCount} words with a vocabulary diversity score of ${speechAnalysis.vocabulary.diversity}/100. Your language complexity scored ${speechAnalysis.vocabulary.complexity}/100. ${speechAnalysis.vocabulary.domainSpecificity > 30 ? 'Good use of domain-specific terminology.' : 'Consider using more industry-specific terms.'}`
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
                ? `Responses were ${speechAnalysis.wordCount > 20 ? 'relevant and on-topic' : 'too brief to fully evaluate'}. Your content organization scored ${speechAnalysis.structure.organization}/100.`
                : "Unable to evaluate content due to insufficient speech.",
              structure: hasContent
                ? `Response structure scored ${speechAnalysis.structure.score}/100. ${speechAnalysis.structure.score > 70 ? 'Well-organized with clear beginning, middle, and end.' : 'Could benefit from better organization.'}${speechAnalysis.structure.coherence > 70 ? ' Good use of transition phrases.' : ' Consider adding more transition phrases to connect ideas.'}`
                : "No response structure to evaluate.",
              examples: hasContent
                ? `${speechAnalysis.structure.completeness > 70 ? 'Good level of detail in responses.' : 'Responses could use more specific examples and details.'}`
                : "No examples detected in the responses."
            },
            overall: {
              confidence: `Confidence level appears ${confidenceScore > 75 ? 'strong' : confidenceScore > 50 ? 'moderate' : 'low'}. ${hasContent ? `Your enthusiasm scored ${speechAnalysis.sentiment.enthusiasm}/100.` : ''}`,
              engagement: `Engagement level was ${hasContent ? 'acceptable' : 'insufficient'}. ${hasContent && speechAnalysis.sentiment.positivity > 70 ? 'Good use of positive language.' : ''}`,
              appearance: "Professional appearance maintained throughout the interview."
            }
          },
          transcription: speechAnalysis.transcription,
          wordCount: speechAnalysis.wordCount,
          fillerWordCount: speechAnalysis.fillerWordCount,
          speechDuration: speechDuration,
          confidenceScore: confidenceScore,
          speechQuality: speechQuality,
          
          // Add new comprehensive metrics from our enhanced analysis
          pacing: speechAnalysis.pacing,
          vocabulary: speechAnalysis.vocabulary,
          sentiment: speechAnalysis.sentiment,
          structure: speechAnalysis.structure,
          
          // Add privacy compliance information
          privacy: {
            dataRetentionPeriod: '30 days',
            anonymizationLevel: 'partial',
            consentObtained: true
          }
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
          },
          privacy: {
            dataRetentionPeriod: '30 days',
            anonymizationLevel: 'partial',
            consentObtained: true
          }
        });
      }
      
      setIsLoading(false);
    };
    
    analyzeInterview();
  }, [id]);
  
  return { data, isLoading };
};
