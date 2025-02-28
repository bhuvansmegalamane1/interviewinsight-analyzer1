
import { useState, useEffect } from "react";
import { AnalysisData } from "@/types/analysis";

export const useFakeAnalysisData = (id?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<AnalysisData>({} as AnalysisData);
  
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setData({
        id: id || "123456",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-female-vlogger-recording-her-podcast-42665-large.mp4",
        overallScore: 78,
        scores: {
          verbal: 82,
          nonVerbal: 76,
          content: 85,
          engagement: 70
        },
        detailedScores: {
          clarity: 84,
          conciseness: 79,
          eyeContact: 72,
          posture: 76,
          relevance: 88,
          confidence: 74
        },
        summary: "Overall, your interview performance showed strong communication skills and relevant content. Your answers were well-structured and demonstrated good preparation. There's room for improvement in non-verbal cues and maintaining consistent energy throughout the interview.",
        strengths: [
          "Clear and articulate communication",
          "Well-structured answers with relevant examples",
          "Good technical knowledge demonstration",
          "Effective use of industry terminology"
        ],
        improvements: [
          "Inconsistent eye contact throughout interview",
          "Occasional use of filler words",
          "Some answers could be more concise",
          "Body posture appeared tense at times"
        ],
        recommendations: [
          "Practice maintaining consistent eye contact",
          "Work on eliminating filler words",
          "Prepare more concise versions of key answers",
          "Practice more relaxed body language"
        ],
        feedback: {
          verbal: {
            clarity: "Your speech was generally clear and easy to understand. You articulated thoughts well, though there were a few moments where you spoke too quickly when discussing technical concepts.",
            vocabulary: "You demonstrated appropriate professional vocabulary and effectively used industry terminology. Consider varying your word choice slightly more to avoid repetition.",
            fillerWords: "There was occasional use of filler words like 'um' and 'you know' - about 7 instances throughout the interview. This is an area where minor improvement would enhance your verbal delivery."
          },
          nonVerbal: {
            eyeContact: "Your eye contact was inconsistent throughout the interview. While you maintained good eye contact during the initial questions, it decreased when discussing more challenging topics. Try to maintain consistent eye contact to convey confidence.",
            facialExpressions: "Your facial expressions were generally appropriate and showed engagement. There were good moments of smiling when introducing yourself, though you could incorporate more varied expressions to enhance your points.",
            posture: "Your posture appeared somewhat tense, particularly in the shoulders. Try to maintain a more relaxed but upright posture to convey confidence without appearing rigid."
          },
          content: {
            relevance: "Your answers were highly relevant to the questions asked. You demonstrated good understanding of what was being asked and provided appropriate responses that addressed the core of each question.",
            structure: "Most answers followed a clear structure with introduction, main points, and conclusion. Your STAR method usage for behavioral questions was particularly effective, though some technical explanations could benefit from a more organized approach.",
            examples: "You provided strong, relevant examples from your experience. The specificity of your project examples was particularly effective. Consider preparing more varied examples to avoid repeating the same professional scenarios."
          },
          overall: {
            confidence: "You projected confidence through most of the interview, particularly when discussing your core expertise. There were moments of hesitation when addressing questions about challenges or weaknesses - this is an area for improvement.",
            engagement: "Your level of engagement was good but somewhat inconsistent. You showed strong energy at the beginning and end of the interview, with a noticeable dip in the middle section. Aim for more consistent energy throughout.",
            appearance: "Your professional appearance was appropriate for the interview context. Camera framing and lighting were well set up, creating a clear and professional visual impression."
          }
        }
      });
      setIsLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  return { data, isLoading };
};
