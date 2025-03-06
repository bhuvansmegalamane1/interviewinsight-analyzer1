
import { useState, useEffect } from "react";
import { AnalysisData } from "@/types/analysis";

export const useFakeAnalysisData = (id?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<AnalysisData>({} as AnalysisData);
  
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      console.log("useFakeAnalysisData: Generating analysis data");
      
      // Get additional data from sessionStorage if available
      let sessionData = null;
      let hasContent = false;
      
      try {
        const storedData = sessionStorage.getItem('interviewData');
        if (storedData) {
          sessionData = JSON.parse(storedData);
          console.log("useFakeAnalysisData: Retrieved session data:", sessionData);
          
          // Even without speech, we can analyze visual cues
          const hasVisualContent = true; // We assume video has visual content
          hasContent = sessionData.hasSpokenContent || hasVisualContent;
          
          // Analyze facial expressions and posture even without speech
          const visualAnalysis = {
            eyeContactScore: sessionData.eyeContactScore || Math.floor(Math.random() * 30) + 60, // 60-90 range
            postureFeedback: sessionData.postureFeedback || "good",
            facialExpressions: sessionData.facialExpressions || "neutral",
            confidenceScore: sessionData.confidenceScore || Math.floor(Math.random() * 20) + 70 // 70-90 range
          };
          
          // If no speech detected, focus on visual aspects
          if (!sessionData.hasSpokenContent) {
            console.log("useFakeAnalysisData: No speech detected, analyzing visual cues");
            setData({
              id: id || "123456",
              videoUrl: sessionData.videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-young-female-vlogger-recording-her-podcast-42665-large.mp4",
              overallScore: Math.floor((visualAnalysis.eyeContactScore + visualAnalysis.confidenceScore) / 2),
              scores: {
                verbal: 0, // No verbal score without speech
                nonVerbal: visualAnalysis.eyeContactScore,
                content: 0, // No content score without speech
                engagement: visualAnalysis.confidenceScore
              },
              detailedScores: {
                clarity: 0,
                conciseness: 0,
                eyeContact: visualAnalysis.eyeContactScore,
                posture: 75,
                relevance: 0,
                confidence: visualAnalysis.confidenceScore
              },
              summary: "While no speech was detected in your video, we analyzed your non-verbal communication. Your body language and facial expressions show good potential for professional interactions. Consider practicing speaking aloud to complement your visual presentation.",
              strengths: [
                "Good posture and professional appearance",
                "Appropriate facial expressions",
                "Camera-ready presence"
              ],
              improvements: [
                "No verbal content detected - practice speaking clearly",
                "Add verbal responses to demonstrate communication skills",
                "Maintain current positive body language while adding speech"
              ],
              recommendations: [
                "Practice speaking aloud while maintaining your good posture",
                "Record practice sessions with both speech and movement",
                "Use the STAR method to structure your verbal responses",
                "Continue maintaining good eye contact with the camera",
                "Consider using practice questions to help structure your responses"
              ],
              feedback: {
                verbal: {
                  clarity: "No speech was detected in the recording. To provide a complete analysis, we need to hear your verbal responses.",
                  vocabulary: "Unable to assess vocabulary without verbal content. Speaking clearly is essential for interview success.",
                  fillerWords: "No verbal patterns to analyze. Focus on adding clear speech while maintaining your positive non-verbal presentation."
                },
                nonVerbal: {
                  eyeContact: `Your eye contact with the camera was ${visualAnalysis.eyeContactScore > 75 ? 'excellent' : 'good'}. This shows confidence and engagement.`,
                  facialExpressions: "Your facial expressions were appropriate and professional, showing good potential for interview situations.",
                  posture: "Your posture was professional and well-maintained throughout the recording."
                },
                content: {
                  relevance: "Unable to assess content relevance without verbal responses.",
                  structure: "No verbal content to evaluate for structure. Consider adding verbal responses in future recordings.",
                  examples: "To analyze your examples and illustrations, please include verbal responses in your next recording."
                },
                overall: {
                  confidence: `Your non-verbal confidence level appears ${visualAnalysis.confidenceScore > 80 ? 'very good' : 'good'}. Adding verbal responses will complete your professional presence.`,
                  engagement: "While you show good visual engagement, adding verbal responses will create a more complete interaction.",
                  appearance: "Your professional appearance and camera presence are positive aspects of your presentation."
                }
              }
            });
          } else {
            // Extract data from session if available or use defaults
            const speechDuration = sessionData?.speechDuration || 0;
            const speechPercentage = sessionData?.speechPercentage || 0;
            const postureFeedback = sessionData?.postureFeedback || "good";
            const eyeContactScore = sessionData?.eyeContactScore || 70;
            const confidenceScore = sessionData?.confidenceScore || 65;
            const facialExpressions = sessionData?.facialExpressions || "neutral";
            const grammarIssuesCount = sessionData?.grammarIssues || 0;
            const recordingDuration = sessionData?.recordingDuration || 0;
            const isShortAnswer = recordingDuration < 30; // Less than 30 seconds is considered short
            const isLongAnswer = recordingDuration > 120; // More than 2 minutes is considered long
            
            // If we have content, generate realistic scores based on the data
            if (hasContent) {
              // Calculate performance scores using the collected data
              const verbalScore = speechPercentage > 30 ? 
                                 Math.min(100, 60 + (speechPercentage / 4) - (grammarIssuesCount * 5)) : 
                                 Math.min(100, 30 + (speechPercentage / 2));
              
              const postureScore = postureFeedback === "good" ? 
                                  Math.floor(Math.random() * 15) + 80 : // 80-95 for good posture
                                  Math.floor(Math.random() * 20) + 55;  // 55-75 for poor posture
              
              const contentScore = speechDuration > 20 ? 
                                  Math.min(100, 65 + (speechDuration / 10) - (isLongAnswer ? 15 : 0)) :
                                  Math.min(100, 40 + (speechDuration * 1.5));
              
              const engagementScore = Math.min(100, 
                                     (eyeContactScore * 0.4) + 
                                     ((facialExpressions === "positive" ? 90 : 
                                       facialExpressions === "neutral" ? 70 : 50) * 0.3) + 
                                     (confidenceScore * 0.3));
              
              // Calculate detailed scores
              const clarityScore = Math.min(100, verbalScore + Math.floor(Math.random() * 15) - 5);
              const concisenessScore = isShortAnswer ? 60 : (isLongAnswer ? 65 : 85); // Penalize very short or long answers
              const relevanceScore = Math.min(100, contentScore + Math.floor(Math.random() * 10) - 5);
              
              // Calculate overall score (weighted average)
              const overallScore = Math.floor(
                (verbalScore * 0.3) + 
                (postureScore * 0.2) + 
                (contentScore * 0.3) + 
                (engagementScore * 0.2)
              );
              
              // Determine feedback based on scores
              const verbalFeedback = {
                clarity: verbalScore > 80 ? 
                  "Your speech was clear and articulate. You spoke at an appropriate pace and enunciated well, making it easy for listeners to understand you." :
                  verbalScore > 65 ? 
                  "Your speech was generally clear, though there were a few moments where you spoke too quickly or mumbled slightly. Focus on maintaining consistent clarity throughout." :
                  "Your speech clarity needs improvement. You frequently spoke too quickly or mumbled, making it difficult to understand some of your points. Practice speaking more deliberately and enunciating each word.",
                
                vocabulary: contentScore > 80 ? 
                  "You demonstrated a strong, professional vocabulary and effectively used industry terminology where appropriate. Your language was precise and effective." :
                  contentScore > 65 ? 
                  "Your vocabulary was adequate, though occasionally repetitive. Consider expanding your professional terminology and varying your word choice for more impact." :
                  "Your vocabulary was limited and repetitive. Work on expanding your professional vocabulary and using more varied language to express your ideas more effectively.",
                
                fillerWords: grammarIssuesCount < 2 ?
                  "You used minimal filler words ('um', 'uh', 'like', etc.), which contributed to your professional delivery. Continue to be mindful of these in future interviews." :
                  grammarIssuesCount < 5 ?
                  "You occasionally used filler words ('um', 'uh', 'like', etc.) – about 10-15 instances throughout. Being more conscious of these would enhance your verbal delivery." :
                  "You frequently used filler words ('um', 'uh', 'like', etc.) – over 20 instances throughout the interview. This significantly impacted your professional delivery. Practice pausing instead of using fillers."
              };
              
              const nonVerbalFeedback = {
                eyeContact: eyeContactScore > 80 ? 
                  "You maintained excellent eye contact with the camera throughout the interview, which conveyed confidence and engagement. This is a strong point in your interview technique." :
                  eyeContactScore > 65 ? 
                  "Your eye contact was generally good, though inconsistent at times, particularly when discussing more challenging topics. Work on maintaining steady eye contact even when under pressure." :
                  "Your eye contact was minimal or inconsistent throughout the interview. This can give the impression of nervousness or lack of confidence. Practice looking directly at the camera more consistently.",
                
                facialExpressions: facialExpressions === "positive" ? 
                  "Your facial expressions were animated and appropriate, showing engagement and enthusiasm throughout the interview. You effectively conveyed interest in the conversation." :
                  facialExpressions === "neutral" ? 
                  "Your facial expressions were appropriate but somewhat limited in range. Incorporating more expressive responses would better demonstrate your engagement and enthusiasm." :
                  "Your facial expressions were minimal or flat throughout the interview. This can make it difficult for interviewers to gauge your interest or enthusiasm. Practice incorporating more expressive responses.",
                
                posture: postureFeedback === "good" ? 
                  "Your posture was excellent – upright, attentive, and professional throughout. This non-verbal cue significantly enhanced your professional presence." :
                  postureFeedback === "slouching" ? 
                  "Your posture showed signs of slouching at times. Maintaining consistent, upright posture would enhance your presence and convey more confidence." :
                  postureFeedback === "tooClose" ?
                  "You were positioned too close to the camera at times, which can feel intrusive to the interviewer. Maintain an appropriate distance from the camera." :
                  "You were positioned too far from the camera at times, which can reduce your presence. Move closer to ensure you're properly framed in the video."
              };
              
              const contentFeedback = {
                relevance: relevanceScore > 85 ? 
                  "Your answers were highly relevant and directly addressed the questions asked. You demonstrated excellent understanding of what was being asked and provided appropriately targeted responses." :
                  relevanceScore > 70 ? 
                  "Your answers were generally relevant, though occasionally you veered off-topic or included unnecessary information. Focus on keeping responses more closely aligned with the specific questions." :
                  "Many of your answers lacked relevance to the questions asked. You frequently went off-topic or failed to address key aspects of the questions. Practice providing more focused responses.",
                
                structure: contentScore > 80 ? 
                  "Your answers followed a clear, logical structure. You effectively used frameworks like STAR for behavioral questions and presented information in a well-organized manner." :
                  contentScore > 65 ? 
                  "Your answers had some structure, but organization could be improved. Some responses lacked clear beginnings, middles, and conclusions. Consider using the STAR method more consistently." :
                  "Your answers lacked clear structure or organization. Information was often presented in a confusing order. Practice organizing your thoughts into introduction, main points, and conclusion.",
                
                examples: contentScore > 85 ? 
                  "You provided excellent, specific examples from your experience that effectively illustrated your points. The examples were relevant and demonstrated your capabilities well." :
                  contentScore > 70 ? 
                  "You included some good examples, though they could have been more specific or detailed at times. More concrete illustrations of your accomplishments would strengthen your responses." :
                  "Your answers lacked specific examples or the examples provided were too vague. Including detailed, relevant examples from your experience would significantly improve your responses."
              };
              
              const overallFeedback = {
                confidence: confidenceScore > 85 ? 
                  "You projected strong confidence throughout the interview. Your tone, pace, and body language all contributed to a self-assured presence that would impress interviewers." :
                  confidenceScore > 70 ? 
                  "You appeared reasonably confident, though there were moments of hesitation or uncertainty, particularly when addressing challenging questions. Work on maintaining consistent confidence." :
                  "You appeared nervous or lacking in confidence during much of the interview. This was evident in your hesitant tone, uncertain language, and tense body language. Practice techniques to project more confidence.",
                
                engagement: engagementScore > 85 ? 
                  "You demonstrated excellent engagement throughout the interview. Your energy level, responsiveness, and interest in the conversation were consistently strong." :
                  engagementScore > 70 ? 
                  "Your level of engagement was good but somewhat inconsistent. Your energy fluctuated at times, with stronger engagement at the beginning than later in the interview. Aim for more consistent energy throughout." :
                  "Your engagement level appeared low throughout much of the interview. More animation, enthusiasm, and energy would significantly improve the impression you make on interviewers.",
                
                appearance: postureFeedback === "good" ? 
                  "Your professional appearance was excellent. You were well-groomed, appropriately dressed, and positioned well on camera with good lighting and framing." :
                  postureFeedback === "slouching" ? 
                  "Your appearance was generally professional, though your posture could be improved. Sitting up straight would enhance your professional image." :
                  postureFeedback === "tooClose" || postureFeedback === "tooFar" ?
                  "Your appearance was generally professional, though your positioning relative to the camera could be improved for better framing." :
                  "Your appearance needs improvement for professional interviews. Focus on better positioning and posture for improved visual presence."
              };
              
              // Identify strengths based on highest scores
              const strengths = [];
              if (verbalScore >= 75) strengths.push("Clear and articulate communication");
              if (contentScore >= 80) strengths.push("Well-structured answers with relevant content");
              if (eyeContactScore >= 80) strengths.push("Strong eye contact and engagement");
              if (clarityScore >= 85) strengths.push("Excellent clarity in expressing complex ideas");
              if (concisenessScore >= 80) strengths.push("Concise and to-the-point responses");
              if (confidenceScore >= 85) strengths.push("Confident and self-assured presentation");
              if (relevanceScore >= 85) strengths.push("Highly relevant responses that directly address questions");
              if (facialExpressions === "positive") strengths.push("Positive and engaging facial expressions");
              if (postureFeedback === "good") strengths.push("Excellent posture and professional presence");
              // Ensure we have at least 2 strengths
              if (strengths.length < 2) {
                strengths.push("Willingness to engage with challenging questions");
                strengths.push("Potential for improvement with continued practice");
              }
              
              // Identify areas for improvement based on lowest scores
              const improvements = [];
              if (verbalScore < 70) improvements.push("Reduce filler words and improve verbal clarity");
              if (eyeContactScore < 70) improvements.push("Maintain more consistent eye contact");
              if (postureFeedback !== "good") improvements.push("Improve posture and body language");
              if (contentScore < 70) improvements.push("Provide more structured and relevant responses");
              if (engagementScore < 70) improvements.push("Show more enthusiasm and energy during responses");
              if (concisenessScore < 70) improvements.push(isShortAnswer ? "Provide more detailed and complete answers" : "Make responses more concise and focused");
              if (confidenceScore < 70) improvements.push("Project more confidence in your tone and delivery");
              if (grammarIssuesCount > 3) improvements.push("Reduce grammatical errors and filler words");
              if (facialExpressions === "negative") improvements.push("Display more positive facial expressions");
              // Ensure we have at least 2 improvements
              if (improvements.length < 2) {
                if (concisenessScore < 90) improvements.push(isShortAnswer ? "Elaborate more on your examples" : "Be slightly more concise in your responses");
                improvements.push("Further refine your professional vocabulary");
              }
              
              // Generate tailored recommendations
              const recommendations = [];
              if (verbalScore < 75) recommendations.push("Practice speaking slowly and clearly, recording yourself to identify areas for improvement");
              if (eyeContactScore < 75) recommendations.push("Practice maintaining eye contact by placing a sticker near your camera as a reminder");
              if (contentScore < 75) recommendations.push("Use the STAR method (Situation, Task, Action, Result) to structure your answers");
              if (engagementScore < 75) recommendations.push("Practice showing more enthusiasm by slightly increasing your energy level beyond what feels natural");
              if (confidenceScore < 75) recommendations.push("Practice power posing for 2 minutes before interviews to boost confidence");
              if (grammarIssuesCount > 2) recommendations.push("Record practice interviews and count your filler words to become more aware of them");
              if (postureFeedback !== "good") recommendations.push("Practice interviews in front of a mirror to monitor your posture and body language");
              if (facialExpressions !== "positive") recommendations.push("Practice smiling more during interviews, even when speaking about challenging topics");
              // Ensure we have at least 3 recommendations
              if (recommendations.length < 3) {
                recommendations.push("Prepare 5-7 concrete examples of your achievements that can be adapted to different questions");
                recommendations.push("Ask a friend to conduct mock interviews and provide feedback on your non-verbal communication");
                recommendations.push("Research common interview questions in your field and practice concise, structured responses");
              }
              
              // Set the analysis data with calculated scores and feedback
              setData({
                id: id || "123456",
                videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-female-vlogger-recording-her-podcast-42665-large.mp4",
                overallScore,
                scores: {
                  verbal: verbalScore,
                  nonVerbal: Math.floor((eyeContactScore + (postureFeedback === "good" ? 85 : 60)) / 2),
                  content: contentScore,
                  engagement: engagementScore
                },
                detailedScores: {
                  clarity: clarityScore,
                  conciseness: concisenessScore,
                  eyeContact: eyeContactScore,
                  posture: postureFeedback === "good" ? 85 : postureFeedback === "slouching" ? 60 : 70,
                  relevance: relevanceScore,
                  confidence: confidenceScore
                },
                summary: `Your interview performance earned an overall score of ${overallScore}/100. ${
                  overallScore >= 80 ? "You demonstrated strong communication skills and professional presence." :
                  overallScore >= 70 ? "You showed good potential with several strengths, though there are areas for improvement." :
                  "Your interview revealed several opportunities for improvement that would significantly enhance your performance."
                } ${
                  verbalScore > contentScore ? "Your verbal communication was particularly strong, while your content could be more developed." :
                  contentScore > verbalScore ? "The content of your answers was your strong point, while verbal delivery could be improved." :
                  "You maintained a balance between verbal delivery and content quality."
                } With targeted practice on the recommended areas, you can further improve your interview performance.`,
                strengths,
                improvements,
                recommendations,
                feedback: {
                  verbal: {
                    clarity: verbalScore > 80 ? 
                      "Your speech was clear and articulate. You spoke at an appropriate pace and enunciated well, making it easy for listeners to understand you." :
                      verbalScore > 65 ? 
                      "Your speech was generally clear, though there were a few moments where you spoke too quickly or mumbled slightly. Focus on maintaining consistent clarity throughout." :
                      "Your speech clarity needs improvement. You frequently spoke too quickly or mumbled, making it difficult to understand some of your points. Practice speaking more deliberately and enunciating each word.",
                    
                    vocabulary: contentScore > 80 ? 
                      "You demonstrated a strong, professional vocabulary and effectively used industry terminology where appropriate. Your language was precise and effective." :
                      contentScore > 65 ? 
                      "Your vocabulary was adequate, though occasionally repetitive. Consider expanding your professional terminology and varying your word choice for more impact." :
                      "Your vocabulary was limited and repetitive. Work on expanding your professional vocabulary and using more varied language to express your ideas more effectively.",
                    
                    fillerWords: grammarIssuesCount < 2 ?
                      "You used minimal filler words ('um', 'uh', 'like', etc.), which contributed to your professional delivery. Continue to be mindful of these in future interviews." :
                      grammarIssuesCount < 5 ?
                      "You occasionally used filler words ('um', 'uh', 'like', etc.) – about 10-15 instances throughout. Being more conscious of these would enhance your verbal delivery." :
                      "You frequently used filler words ('um', 'uh', 'like', etc.) – over 20 instances throughout the interview. This significantly impacted your professional delivery. Practice pausing instead of using fillers."
                  },
                  nonVerbal: {
                    eyeContact: eyeContactScore > 80 ? 
                      "You maintained excellent eye contact with the camera throughout the interview, which conveyed confidence and engagement. This is a strong point in your interview technique." :
                      eyeContactScore > 65 ? 
                      "Your eye contact was generally good, though inconsistent at times, particularly when discussing more challenging topics. Work on maintaining steady eye contact even when under pressure." :
                      "Your eye contact was minimal or inconsistent throughout the interview. This can give the impression of nervousness or lack of confidence. Practice looking directly at the camera more consistently.",
                    
                    facialExpressions: facialExpressions === "positive" ? 
                      "Your facial expressions were animated and appropriate, showing engagement and enthusiasm throughout the interview. You effectively conveyed interest in the conversation." :
                      facialExpressions === "neutral" ? 
                      "Your facial expressions were appropriate but somewhat limited in range. Incorporating more expressive responses would better demonstrate your engagement and enthusiasm." :
                      "Your facial expressions were minimal or flat throughout the interview. This can make it difficult for interviewers to gauge your interest or enthusiasm. Practice incorporating more expressive responses.",
                    
                    posture: postureFeedback === "good" ? 
                      "Your posture was excellent – upright, attentive, and professional throughout. This non-verbal cue significantly enhanced your professional presence." :
                      postureFeedback === "slouching" ? 
                      "Your posture showed signs of slouching at times. Maintaining consistent, upright posture would enhance your presence and convey more confidence." :
                      postureFeedback === "tooClose" ?
                      "You were positioned too close to the camera at times, which can feel intrusive to the interviewer. Maintain an appropriate distance from the camera." :
                      "You were positioned too far from the camera at times, which can reduce your presence. Move closer to ensure you're properly framed in the video."
                  },
                  content: {
                    relevance: relevanceScore > 85 ? 
                      "Your answers were highly relevant and directly addressed the questions asked. You demonstrated excellent understanding of what was being asked and provided appropriately targeted responses." :
                      relevanceScore > 70 ? 
                      "Your answers were generally relevant, though occasionally you veered off-topic or included unnecessary information. Focus on keeping responses more closely aligned with the specific questions." :
                      "Many of your answers lacked relevance to the questions asked. You frequently went off-topic or failed to address key aspects of the questions. Practice providing more focused responses.",
                    
                    structure: contentScore > 80 ? 
                      "Your answers followed a clear, logical structure. You effectively used frameworks like STAR for behavioral questions and presented information in a well-organized manner." :
                      contentScore > 65 ? 
                      "Your answers had some structure, but organization could be improved. Some responses lacked clear beginnings, middles, and conclusions. Consider using the STAR method more consistently." :
                      "Your answers lacked clear structure or organization. Information was often presented in a confusing order. Practice organizing your thoughts into introduction, main points, and conclusion.",
                    
                    examples: contentScore > 85 ? 
                      "You provided excellent, specific examples from your experience that effectively illustrated your points. The examples were relevant and demonstrated your capabilities well." :
                      contentScore > 70 ? 
                      "You included some good examples, though they could have been more specific or detailed at times. More concrete illustrations of your accomplishments would strengthen your responses." :
                      "Your answers lacked specific examples or the examples provided were too vague. Including detailed, relevant examples from your experience would significantly improve your responses."
                  },
                  overall: {
                    confidence: confidenceScore > 85 ? 
                      "You projected strong confidence throughout the interview. Your tone, pace, and body language all contributed to a self-assured presence that would impress interviewers." :
                      confidenceScore > 70 ? 
                      "You appeared reasonably confident, though there were moments of hesitation or uncertainty, particularly when addressing challenging questions. Work on maintaining consistent confidence." :
                      "You appeared nervous or lacking in confidence during much of the interview. This was evident in your hesitant tone, uncertain language, and tense body language. Practice techniques to project more confidence.",
                    
                    engagement: engagementScore > 85 ? 
                      "You demonstrated excellent engagement throughout the interview. Your energy level, responsiveness, and interest in the conversation were consistently strong." :
                      engagementScore > 70 ? 
                      "Your level of engagement was good but somewhat inconsistent. Your energy fluctuated at times, with stronger engagement at the beginning than later in the interview. Aim for more consistent energy throughout." :
                      "Your engagement level appeared low throughout much of the interview. More animation, enthusiasm, and energy would significantly improve the impression you make on interviewers.",
                    
                    appearance: postureFeedback === "good" ? 
                      "Your professional appearance was excellent. You were well-groomed, appropriately dressed, and positioned well on camera with good lighting and framing." :
                      postureFeedback === "slouching" ? 
                      "Your appearance was generally professional, though your posture could be improved. Sitting up straight would enhance your professional image." :
                      postureFeedback === "tooClose" || postureFeedback === "tooFar" ?
                      "Your appearance was generally professional, though your positioning relative to the camera could be improved for better framing." :
                      "Your appearance needs improvement for professional interviews. Focus on better positioning and posture for improved visual presence."
                  }
                }
              });
            }
          }
        } else {
          console.log("useFakeAnalysisData: No interview data found in session storage, using default values");
          hasContent = false; // No data means we can't confirm speech

          // Default scores for videos without content
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
      } catch (e) {
        console.error("useFakeAnalysisData: Error parsing session data:", e);
        hasContent = false;
      }
      
      console.log("useFakeAnalysisData: Analysis complete, setting data with hasContent:", hasContent);
      setIsLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  return { data, isLoading };
};
