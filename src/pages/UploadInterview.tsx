
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import Layout from "@/components/Layout";
import { Progress } from "@/components/ui/progress";

const UploadInterview = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [speechDetected, setSpeechDetected] = useState<boolean | null>(null);
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
  };

  const analyzeAudioContent = async (file: File): Promise<boolean> => {
    setIsAnalyzing(true);
    
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
      
      // Store interview data with speech detection results
      sessionStorage.setItem('interviewData', JSON.stringify({
        timestamp: new Date().toISOString(),
        hasSpokenContent: hasSpokenContent,
        fileSize: file.size,
        fileName: file.name,
        fileType: file.type,
        speechPercentage: hasSpokenContent ? Math.floor(Math.random() * 50) + 30 : 5, // If speech detected, between 30-80%
        speechDuration: hasSpokenContent ? Math.floor(Math.random() * 90) + 30 : 5, // If speech detected, between 30-120 seconds
        grammarIssues: hasSpokenContent ? Math.floor(Math.random() * 10) : 20, // More grammar issues if no proper speech
        postureFeedback: Math.random() > 0.5 ? "good" : "slouching",
        eyeContactScore: hasSpokenContent ? Math.floor(Math.random() * 30) + 60 : Math.floor(Math.random() * 20) + 20,
        confidenceScore: hasSpokenContent ? Math.floor(Math.random() * 30) + 60 : Math.floor(Math.random() * 20) + 10,
        facialExpressions: hasSpokenContent ? (Math.random() > 0.6 ? "positive" : "neutral") : "negative",
        recordingDuration: Math.floor(Math.random() * 120) + 60, // 1-3 minutes
      }));
      
      // Simulate API call/upload process
      setTimeout(() => {
        clearInterval(interval);
        setIsUploading(false);
        setUploadProgress(100);
        
        toast({
          title: "Upload successful",
          description: hasSpokenContent 
            ? "Your interview video has been uploaded and is being processed."
            : "Your video was uploaded, but little to no speech was detected. The analysis may be limited.",
        });
        
        setTimeout(() => {
          // Generate a random ID for demo purposes
          const analysisId = Math.floor(Math.random() * 1000000);
          navigate(`/analysis/${analysisId}`);
        }, 1000);
      }, 6000);
    } catch (error) {
      console.error("Error during upload:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your video. Please try again.",
        variant: "destructive",
      });
      setIsUploading(false);
      setUploadProgress(0);
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
            {!file ? (
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
            ) : (
              <div className="space-y-4">
                <div className="h-16 w-16 mx-auto bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium">Video ready for upload</h3>
                <p className="text-neutral-500">
                  {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
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
                    }}
                    disabled={isUploading || isAnalyzing}
                  >
                    Change
                  </Button>
                  
                  {speechDetected === null && !isAnalyzing && (
                    <Button
                      variant="outline"
                      onClick={() => analyzeAudioContent(file)}
                      disabled={isUploading}
                    >
                      Analyze Audio
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading || isAnalyzing}
                  >
                    {isUploading ? "Uploading..." : "Upload and Analyze"}
                  </Button>
                </div>
              </div>
            )}
          </div>

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
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
          
          <div className="mt-8">
            <h4 className="font-medium mb-4">What happens next?</h4>
            <ol className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li className="flex gap-2">
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs">1</span>
                <span>We'll process your video using our AI analysis engine</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs">2</span>
                <span>Your video will be analyzed for verbal and non-verbal cues</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs">3</span>
                <span>You'll receive detailed feedback and performance scores</span>
              </li>
            </ol>
          </div>
        </Card>
      </motion.div>
    </Layout>
  );
};

export default UploadInterview;
