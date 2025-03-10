
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
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const InterviewAnalysis = () => {
  const { id } = useParams<{ id: string }>();
  const [hasContent, setHasContent] = useState(false);
  const [speechQuality, setSpeechQuality] = useState<'poor' | 'fair' | 'good' | 'excellent'>('poor');
  const { data, isLoading } = useFakeAnalysisData(id);
  const { toast } = useToast();
  
  useEffect(() => {
    const sessionData = sessionStorage.getItem('interviewData');
    if (sessionData) {
      try {
        const parsedData = JSON.parse(sessionData);
        setHasContent(parsedData.hasSpokenContent || false);
        setSpeechQuality(parsedData.speechQuality || 'poor');
        
        if (!parsedData.hasSpokenContent) {
          toast({
            title: "Limited Speech Detected",
            description: "We could only analyze your visual presentation as minimal speech was detected.",
            variant: "warning",
          });
        } else if (parsedData.speechQuality === 'poor') {
          toast({
            title: "Speech Quality Issues",
            description: "Your speech was detected but had quality issues. See the analysis for details.",
            variant: "warning",
          });
        }
      } catch (e) {
        console.error("Error parsing session data:", e);
        setHasContent(false);
        toast({
          title: "Error loading analysis",
          description: "There was a problem processing your interview data.",
          variant: "destructive",
        });
      }
    }
  }, [id, toast]);
  
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
        className="max-w-7xl mx-auto py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow duration-300">
              <VideoPlayer videoUrl={data.videoUrl} />
            </Card>
          </div>
          
          <div>
            <Card className="p-6 border border-neutral-200 dark:border-neutral-800 h-full shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Overview</h3>
                {hasContent && (
                  <Badge className={`
                    ${speechQuality === 'excellent' ? 'bg-green-500' : ''}
                    ${speechQuality === 'good' ? 'bg-blue-500' : ''}
                    ${speechQuality === 'fair' ? 'bg-amber-500' : ''}
                    ${speechQuality === 'poor' ? 'bg-red-500' : ''}
                  `}>
                    {speechQuality} speech
                  </Badge>
                )}
              </div>
              
              <div className="space-y-6">
                {hasContent ? (
                  <>
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
                    
                    {data.transcription && (
                      <div className="mt-4 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-md border border-neutral-200 dark:border-neutral-800">
                        <h4 className="text-sm font-medium mb-2">Transcription Excerpt</h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 italic">
                          "{data.transcription.length > 100 
                            ? data.transcription.substring(0, 100) + '...' 
                            : data.transcription}"
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <div className="bg-amber-50 dark:bg-amber-950/30 text-center p-3 mb-3 rounded-md">
                      <div className="text-amber-500 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2">
                          <path d="M12 9v4"/>
                          <path d="M12 17h.01"/>
                          <path d="M3.44 19h17.12a2 2 0 0 0 1.72-3.01L13.8 4.1a2 2 0 0 0-3.6 0L1.72 15.99A2 2 0 0 0 3.44 19z"/>
                        </svg>
                        <span className="font-medium">No Speech Detected</span>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        We analyzed your visual presentation, but couldn't detect speech. Verbal scores are marked as 0.
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-xs text-neutral-500">Overall Score (Visual Only)</span>
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-medium">{data.overallScore}</span>
                        <span className="text-sm text-neutral-500 mb-1">/100</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mt-4">
                      <div className="flex justify-between items-center text-sm">
                        <span>Verbal Communication</span>
                        <span className="font-medium text-neutral-400">0/100</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Non-verbal Cues</span>
                        <span className="font-medium">{data.scores.nonVerbal}/100</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Content Quality</span>
                        <span className="font-medium text-neutral-400">0/100</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Engagement</span>
                        <span className="font-medium">{data.scores.engagement}/100</span>
                      </div>
                    </div>
                  </div>
                )}
                
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
              {hasContent && (
                <TabsTrigger value="speech">Speech Analysis</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="scores" className="mt-0">
              <ScoreSection data={data} hasContent={hasContent} />
            </TabsContent>
            
            <TabsContent value="feedback" className="mt-0">
              <FeedbackSection data={data} hasContent={hasContent} />
            </TabsContent>
            
            {hasContent && (
              <TabsContent value="speech" className="mt-0">
                <Card className="p-6">
                  <h3 className="text-lg font-medium mb-4">Speech Analysis</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Speech Metrics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span>Total Words</span>
                          <span className="font-medium">{data.wordCount || 0}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Speech Duration</span>
                          <span className="font-medium">{Math.round(data.speechDuration || 0)}s</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Words Per Minute</span>
                          <span className="font-medium">
                            {data.speechDuration > 0 
                              ? Math.round((data.wordCount || 0) / (data.speechDuration / 60)) 
                              : 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Filler Words</span>
                          <span className="font-medium">{data.fillerWordCount || 0}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Confidence Score</span>
                          <span className="font-medium">{data.confidenceScore || 0}/100</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Full Transcription</h4>
                      <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-md border border-neutral-200 dark:border-neutral-800 max-h-60 overflow-y-auto">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {data.transcription || "No transcription available."}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default InterviewAnalysis;
