
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
import { Gauge, Award, Sparkles, ChevronRight } from "lucide-react";

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
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-1 border-4 border-primary/30 border-t-transparent rounded-full animate-spin-slow"></div>
            </div>
            <p className="text-muted-foreground animate-pulse">Analyzing your interview...</p>
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
        className="max-w-7xl mx-auto py-8 px-4 space-y-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            variants={slideIn("left", 0.4)} 
            className="lg:col-span-2"
          >
            <Card className="overflow-hidden border border-neutral-200/50 dark:border-neutral-800/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl bg-gradient-to-br from-background/50 to-background/30 backdrop-blur-sm">
              <VideoPlayer videoUrl={data.videoUrl} />
            </Card>
          </motion.div>
          
          <motion.div variants={slideIn("right", 0.5)}>
            <Card className="p-6 border border-neutral-200/50 dark:border-neutral-800/50 h-full shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl bg-gradient-to-br from-background/50 to-background/30 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Overview</h3>
                {hasContent && (
                  <Badge className={`
                    px-3 py-1 text-sm font-medium rounded-full shadow-sm transition-all duration-300
                    ${speechQuality === 'excellent' ? 'bg-green-500/90 hover:bg-green-500' : ''}
                    ${speechQuality === 'good' ? 'bg-blue-500/90 hover:bg-blue-500' : ''}
                    ${speechQuality === 'fair' ? 'bg-amber-500/90 hover:bg-amber-500' : ''}
                    ${speechQuality === 'poor' ? 'bg-red-500/90 hover:bg-red-500' : ''}
                  `}>
                    {speechQuality} speech
                  </Badge>
                )}
              </div>
              
              <div className="space-y-8">
                {hasContent ? (
                  <>
                    <div className="relative">
                      <div className="flex items-end gap-2">
                        <Gauge className="text-primary w-6 h-6" />
                        <span className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                          {data.overallScore}
                        </span>
                        <span className="text-sm text-muted-foreground mb-1">/100</span>
                      </div>
                      <span className="absolute top-0 right-0 text-xs text-muted-foreground">Overall Score</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                        <span className="text-sm">Verbal Communication</span>
                        <span className="font-semibold text-primary">{data.scores.verbal}/100</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                        <span className="text-sm">Non-verbal Cues</span>
                        <span className="font-semibold text-primary">{data.scores.nonVerbal}/100</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                        <span className="text-sm">Content Quality</span>
                        <span className="font-semibold text-primary">{data.scores.content}/100</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                        <span className="text-sm">Engagement</span>
                        <span className="font-semibold text-primary">{data.scores.engagement}/100</span>
                      </div>
                    </div>
                    
                    {data.transcription && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          Transcription Excerpt
                        </h4>
                        <Card className="p-4 bg-gradient-to-br from-primary/5 to-transparent border-0">
                          <p className="text-sm text-muted-foreground italic">
                            "{data.transcription.length > 100 
                              ? data.transcription.substring(0, 100) + '...' 
                              : data.transcription}"
                          </p>
                        </Card>
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
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    Summary
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {data.summary}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
        
        <motion.div variants={slideIn("up", 0.6)}>
          <Tabs defaultValue="scores" className="w-full">
            <TabsList className="mb-6 p-1 bg-primary/5 rounded-full w-fit">
              <TabsTrigger 
                value="scores" 
                className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
              >
                Performance Scores
              </TabsTrigger>
              <TabsTrigger 
                value="feedback" 
                className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
              >
                Detailed Feedback
              </TabsTrigger>
              {hasContent && (
                <TabsTrigger 
                  value="speech" 
                  className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                >
                  Speech Analysis
                </TabsTrigger>
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
                <Card className="p-6 border border-neutral-200/50 dark:border-neutral-800/50 bg-gradient-to-br from-background/50 to-background/30 backdrop-blur-sm rounded-xl">
                  <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Speech Analysis
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="font-medium text-lg flex items-center gap-2">
                        <ChevronRight className="w-5 h-5 text-primary" />
                        Speech Metrics
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                          <span className="text-sm">Total Words</span>
                          <span className="font-semibold text-primary">{data.wordCount || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                          <span className="text-sm">Speech Duration</span>
                          <span className="font-semibold text-primary">{Math.round(data.speechDuration || 0)}s</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                          <span className="text-sm">Words Per Minute</span>
                          <span className="font-semibold text-primary">
                            {data.speechDuration > 0 
                              ? Math.round((data.wordCount || 0) / (data.speechDuration / 60)) 
                              : 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                          <span className="text-sm">Filler Words</span>
                          <span className="font-semibold text-primary">{data.fillerWordCount || 0}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium text-lg flex items-center gap-2">
                        <ChevronRight className="w-5 h-5 text-primary" />
                        Full Transcription
                      </h4>
                      <Card className="p-4 bg-gradient-to-br from-primary/5 to-transparent border-0 max-h-[300px] overflow-y-auto">
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {data.transcription || "No transcription available."}
                        </p>
                      </Card>
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
