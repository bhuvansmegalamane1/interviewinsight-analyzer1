
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { AnalysisData } from "@/types/analysis";

interface FeedbackSectionProps {
  data: AnalysisData;
}

const FeedbackSection = ({ data }: FeedbackSectionProps) => {
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
