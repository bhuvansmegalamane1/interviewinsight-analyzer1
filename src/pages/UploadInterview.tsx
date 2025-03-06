
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import { Progress } from "@/components/ui/progress";
import VideoPlayer from "@/components/VideoPlayer";

const UploadInterview = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [speechDetected, setSpeechDetected] = useState<boolean | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [analysisStage, setAnalysisStage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Check if file is a video
    if (!file.type.startsWith("video/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a video smaller than 500MB.",
        variant: "destructive",
      });
      return;
    }
    
    setFile(file);
    
    // Create a URL for the video preview
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
  };

  const analyzeAudioContent = async (file: File): Promise<boolean> => {
    setIsAnalyzing(true);
    setAnalysisStage("Speech detection");
    
    try {
      // Create an audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      // Create a video element to extract audio from the video
      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(file);
      await videoElement.play();
      videoElement.pause();
      
      // Create a media element source
      const source = audioContext.createMediaElementSource(videoElement);
      
      // Create an analyzer node
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      
      // Create a buffer to get frequency data
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      // Sample the audio at multiple points to detect speech
      const totalSamples = 10;
      let speechSamples = 0;
      
      // Sample at different points in the video
      for (let i = 0; i < totalSamples; i++) {
        // Skip to a different part of the video each time
        videoElement.currentTime = (videoElement.duration / totalSamples) * i;
        
        // Small delay to let the video seek
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Get frequency data
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate average frequency level
        const avg = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
        
        // If average frequency is above threshold, count as speech
        if (avg > 10) { // Lower threshold to detect more subtle speech
          speechSamples++;
        }
      }
      
      // Clean up
      videoElement.pause();
      URL.revokeObjectURL(videoElement.src);
      
      // If more than 30% of samples contain audio, consider it as having speech
      const hasSpeech = speechSamples / totalSamples > 0.3;
      
      console.log(`Speech detection: ${speechSamples}/${totalSamples} samples with speech`);
      console.log(`Speech detected: ${hasSpeech ? 'Yes' : 'No'}`);
      
      setSpeechDetected(hasSpeech);
      return hasSpeech;
      
    } catch (error) {
      console.error("Error analyzing audio content:", error);
      return false;
    } finally {
      setIsAnalyzing(false);
      
      // Close audio context
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // First analyze if the video contains speech
      setAnalysisStage("Analyzing speech patterns");
      const hasSpokenContent = await analyzeAudioContent(file);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 300);
      
      // AI analysis phases
      const analysisPhases = [
        "Extracting verbal content",
        "Analyzing non-verbal cues",
        "Evaluating speaking confidence",
        "Processing sentiment analysis",
        "Generating personalized feedback",
        "Finalizing interview assessment"
      ];
      
      // Simulate AI analysis with different stages
      for (const phase of analysisPhases) {
        setAnalysisStage(phase);
        // Wait between 1-2 seconds for each phase
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      }
      
      // Store interview data with speech detection results and enhanced AI analysis
      sessionStorage.setItem('interviewData', JSON.stringify({
        timestamp: new Date().toISOString(),
        hasSpokenContent: hasSpokenContent,
        fileSize: file.size,
        fileName: file.name,
        fileType: file.type,
        speechPercentage: hasSpokenContent ? Math.floor(Math.random() * 50) + 30 : 5,
        speechDuration: hasSpokenContent ? Math.floor(Math.random() * 90) + 30 : 5,
        grammarIssues: hasSpokenContent ? Math.floor(Math.random() * 10) : 20,
        postureFeedback: Math.random() > 0.5 ? "good" : "slouching",
        eyeContactScore: hasSpokenContent ? Math.floor(Math.random() * 30) + 60 : Math.floor(Math.random() * 20) + 20,
        confidenceScore: hasSpokenContent ? Math.floor(Math.random() * 30) + 60 : Math.floor(Math.random() * 20) + 10,
        facialExpressions: hasSpokenContent ? (Math.random() > 0.6 ? "positive" : "neutral") : "negative",
        recordingDuration: Math.floor(Math.random() * 120) + 60, // 1-3 minutes
        // Enhanced AI feedback
        detailedFeedback: {
          strengths: [
            "Good articulation of technical concepts",
            "Effectively communicated past experience",
            "Used specific examples to support answers"
          ],
          improvements: [
            "Consider reducing filler words (um, like)",
            "Maintain more consistent eye contact",
            "Structure answers with STAR method (Situation, Task, Action, Result)"
          ],
          keyInsights: [
            "You appear most confident when discussing technical problems",
            "Your engagement increases when talking about collaborative work",
            "Tendency to speak faster when discussing challenging situations"
          ]
        },
        // Sentiment analysis throughout the interview
        sentimentTrack: [
          { timepoint: "00:30", sentiment: "neutral", confidence: 0.75 },
          { timepoint: "01:15", sentiment: "positive", confidence: 0.82 },
          { timepoint: "02:00", sentiment: "neutral", confidence: 0.67 },
          { timepoint: "02:45", sentiment: "positive", confidence: 0.91 }
        ],
        // AI-generated interview question recommendations
        recommendedPractice: [
          "Tell me about a situation where you had to adapt quickly to changes",
          "How do you prioritize tasks when dealing with multiple deadlines?",
          "Describe a situation where you had to collaborate with a difficult team member"
        ]
      }));
      
      // Simulate API call/upload process
      setTimeout(() => {
        clearInterval(interval);
        setIsUploading(false);
        setUploadProgress(100);
        
        toast({
          title: "Analysis complete",
          description: hasSpokenContent 
            ? "Your interview was successfully analyzed by our AI systems."
            : "Analysis complete, but limited speech was detected which may affect the quality of feedback.",
        });
        
        setTimeout(() => {
          // Generate a random ID for demo purposes
          const analysisId = Math.floor(Math.random() * 1000000);
          navigate(`/analysis/${analysisId}`);
        }, 1000);
      }, 2000);
    } catch (error) {
      console.error("Error during upload:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your video. Please try again.",
        variant: "destructive",
      });
      setIsUploading(false);
      setUploadProgress(0);
      setAnalysisStage(null);
    }
  };

  return (
    <Layout title="Upload Interview">
      <motion.div 
        variants={fadeIn("up", 0.3)}
        initial="hidden"
        animate="show"
        className="max-w-3xl mx-auto py-8"
      >
        <Card className="p-8 border border-neutral-200 dark:border-neutral-800">
          {!videoUrl ? (
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                isDragging 
                  ? "border-primary bg-primary/5" 
                  : file 
                    ? "border-green-500 bg-green-50/5" 
                    : "border-neutral-300 dark:border-neutral-700"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <Upload className="h-16 w-16 mx-auto text-neutral-400" />
                <h3 className="text-xl font-medium">Upload your interview video</h3>
                <p className="text-neutral-500 dark:text-neutral-400">
                  Drag and drop your video file here, or click to browse
                </p>
                <div>
                  <input
                    id="file-upload"
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                  <Button 
                    variant="outline" 
                    className="cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Select Video
                  </Button>
                </div>
                <p className="text-xs text-neutral-400">
                  Supported formats: MP4, MOV, AVI, WEBM (max 500MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <VideoPlayer 
                  videoUrl={videoUrl} 
                  onRecordingComplete={() => {}}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-medium">Video ready for analysis</h3>
                <p className="text-neutral-500">
                  {file?.name} ({(file?.size ? (file.size / (1024 * 1024)).toFixed(2) : 0)} MB)
                </p>
                
                {speechDetected !== null && (
                  <div className={`text-sm py-2 px-4 rounded-full mx-auto inline-block ${
                    speechDetected 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
                  }`}>
                    {speechDetected 
                      ? "✓ Speech detected in video" 
                      : "⚠ Little or no speech detected"}
                  </div>
                )}
                
                <div className="flex space-x-2 justify-center">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setFile(null);
                      setSpeechDetected(null);
                      setVideoUrl(null);
                    }}
                    disabled={isUploading || isAnalyzing}
                  >
                    Change
                  </Button>
                  
                  {speechDetected === null && !isAnalyzing && (
                    <Button
                      variant="outline"
                      onClick={() => analyzeAudioContent(file!)}
                      disabled={isUploading}
                    >
                      Analyze Audio
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading || isAnalyzing}
                  >
                    {isUploading ? "Processing..." : "Analyze Interview"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analyzing audio...</span>
              </div>
              <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 animate-pulse rounded-full"></div>
              </div>
            </div>
          )}

          {isUploading && (
            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span>{analysisStage || "Processing..."}</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
              
              <div className="text-sm text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <h4 className="font-medium mb-2">AI Analysis in Progress</h4>
                <p>Our advanced AI is analyzing multiple aspects of your interview:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Verbal content and speech patterns</li>
                  <li>Non-verbal cues and body language</li>
                  <li>Tone, pace, and speech clarity</li>
                  <li>Engagement and confidence indicators</li>
                  <li>Question-response relevance</li>
                </ul>
              </div>
            </div>
          )}
          
          <div className="mt-8">
            <h4 className="font-medium mb-4">What happens next?</h4>
            <ol className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li className="flex gap-2">
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs">1</span>
                <span>Our AI system analyzes your interview using natural language processing</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs">2</span>
                <span>We detect verbal patterns, non-verbal cues, and response quality</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs">3</span>
                <span>You'll receive personalized feedback with specific improvement recommendations</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs">4</span>
                <span>Get AI-generated practice questions tailored to your performance areas</span>
              </li>
            </ol>
          </div>
        </Card>
      </motion.div>
    </Layout>
  );
};

export default UploadInterview;
