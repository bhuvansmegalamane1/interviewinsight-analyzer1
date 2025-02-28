
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { fadeIn, slideIn } from "@/lib/animations";
import Layout from "@/components/Layout";
import ScoreSection from "@/components/analysis/ScoreSection";
import FeedbackSection from "@/components/analysis/FeedbackSection";
import VideoPlayer from "@/components/VideoPlayer";
import { useFakeAnalysisData } from "@/hooks/useFakeAnalysisData";

const InterviewAnalysis = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useFakeAnalysisData(id);
  
  if (isLoading) {
    return (
      <Layout title="Loading Analysis">
        <div className="h-[70vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-neutral-500">Analyzing your interview...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title="Interview Analysis">
      <motion.div 
        variants={fadeIn("up", 0.3)}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border border-neutral-200 dark:border-neutral-800">
              <VideoPlayer videoUrl={data.videoUrl} />
            </Card>
          </div>
          
          <div>
            <Card className="p-6 border border-neutral-200 dark:border-neutral-800 h-full">
              <h3 className="text-lg font-medium mb-4">Overview</h3>
              
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-neutral-500">Overall Score</span>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-medium">{data.overallScore}</span>
                    <span className="text-sm text-neutral-500 mb-1">/100</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span>Verbal Communication</span>
                    <span className="font-medium">{data.scores.verbal}/100</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Non-verbal Cues</span>
                    <span className="font-medium">{data.scores.nonVerbal}/100</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Content Quality</span>
                    <span className="font-medium">{data.scores.content}/100</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Engagement</span>
                    <span className="font-medium">{data.scores.engagement}/100</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Summary</h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {data.summary}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        <motion.div variants={slideIn("up", 0.5)}>
          <Tabs defaultValue="scores" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="scores">Performance Scores</TabsTrigger>
              <TabsTrigger value="feedback">Detailed Feedback</TabsTrigger>
            </TabsList>
            
            <TabsContent value="scores" className="mt-0">
              <ScoreSection data={data} />
            </TabsContent>
            
            <TabsContent value="feedback" className="mt-0">
              <FeedbackSection data={data} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default InterviewAnalysis;
