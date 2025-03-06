
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { AnalysisData } from "@/types/analysis";

interface FeedbackSectionProps {
  data: AnalysisData;
  hasContent: boolean;
}

const FeedbackSection = ({ data, hasContent }: FeedbackSectionProps) => {
  if (!hasContent) {
    return (
      <div className="space-y-8">
        <motion.div variants={fadeIn("up", 0.3)}>
          <h2 className="text-xl font-medium mb-4">Non-verbal Analysis</h2>
          
          <Card className="p-6 border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-medium mb-4">Body Language</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Eye Contact</h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {data.feedback.nonVerbal.eyeContact}
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Facial Expressions</h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {data.feedback.nonVerbal.facialExpressions}
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Posture</h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {data.feedback.nonVerbal.posture}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={fadeIn("up", 0.4)}>
          <Card className="p-6 border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-medium mb-4">Overall Impression</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Confidence Level</h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {data.feedback.overall.confidence}
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Engagement</h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {data.feedback.overall.engagement}
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Professional Appearance</h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {data.feedback.overall.appearance}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={fadeIn("up", 0.5)}>
          <Card className="p-6 border border-neutral-200 dark:border-neutral-800 bg-amber-50 dark:bg-amber-950/30">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                <path d="M12 9v4"/>
                <path d="M12 17h.01"/>
                <path d="M3.44 19h17.12a2 2 0 0 0 1.72-3.01L13.8 4.1a2 2 0 0 0-3.6 0L1.72 15.99A2 2 0 0 0 3.44 19z"/>
              </svg>
              <span>Verbal Analysis Unavailable</span>
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              We couldn't analyze your verbal communication because no speech was detected in your interview. For a complete analysis in future interviews, ensure:
            </p>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li className="flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 mt-1 flex-shrink-0">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" x2="12" y1="8" y2="12"/>
                  <line x1="12" x2="12.01" y1="16" y2="16"/>
                </svg>
                <span>Your microphone is properly connected and functioning</span>
              </li>
              <li className="flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 mt-1 flex-shrink-0">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" x2="12" y1="8" y2="12"/>
                  <line x1="12" x2="12.01" y1="16" y2="16"/>
                </svg>
                <span>You're speaking clearly and at an appropriate volume</span>
              </li>
              <li className="flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 mt-1 flex-shrink-0">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" x2="12" y1="8" y2="12"/>
                  <line x1="12" x2="12.01" y1="16" y2="16"/>
                </svg>
                <span>Your video recording includes audio</span>
              </li>
            </ul>
          </Card>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <motion.div variants={fadeIn("up", 0.3)}>
        <h2 className="text-xl font-medium mb-4">Detailed Feedback</h2>
        
        <Card className="p-6 border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-lg font-medium mb-4">Verbal Communication</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Speech Clarity and Pace</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {data.feedback.verbal.clarity}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Vocabulary and Language</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {data.feedback.verbal.vocabulary}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Filler Words</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {data.feedback.verbal.fillerWords}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
      
      <motion.div variants={fadeIn("up", 0.4)}>
        <Card className="p-6 border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-lg font-medium mb-4">Non-verbal Communication</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Eye Contact</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {data.feedback.nonVerbal.eyeContact}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Facial Expressions</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {data.feedback.nonVerbal.facialExpressions}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Posture and Body Language</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {data.feedback.nonVerbal.posture}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
      
      <motion.div variants={fadeIn("up", 0.5)}>
        <Card className="p-6 border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-lg font-medium mb-4">Content Quality</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Answer Relevance</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {data.feedback.content.relevance}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Structure and Organization</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {data.feedback.content.structure}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Depth and Examples</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {data.feedback.content.examples}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
      
      <motion.div variants={fadeIn("up", 0.6)}>
        <Card className="p-6 border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-lg font-medium mb-4">Overall Impression</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Confidence Level</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {data.feedback.overall.confidence}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Engagement</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {data.feedback.overall.engagement}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Professional Appearance</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {data.feedback.overall.appearance}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default FeedbackSection;
