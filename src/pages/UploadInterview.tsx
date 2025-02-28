
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import UploadIcon from "@/components/icons/UploadIcon";
import Layout from "@/components/Layout";
import { Progress } from "@/components/ui/progress";

const UploadInterview = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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

  const handleFile = (file: File) => {
    // Check if file is a video
    if (!file.type.startsWith("video/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file.",
        variant: "destructive",
      });
      return;
    }
    
    setFile(file);
  };

  const handleUpload = () => {
    if (!file) return;
    
    setIsUploading(true);
    
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
    
    // Simulate API call/upload process
    setTimeout(() => {
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(100);
      
      toast({
        title: "Upload successful",
        description: "Your interview video has been uploaded and is being processed.",
      });
      
      setTimeout(() => {
        // Generate a random ID for demo purposes
        const analysisId = Math.floor(Math.random() * 1000000);
        navigate(`/analysis/${analysisId}`);
      }, 1000);
    }, 6000);
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
                <UploadIcon className="h-16 w-16 mx-auto text-neutral-400" />
                <h3 className="text-xl font-medium">Upload your interview video</h3>
                <p className="text-neutral-500 dark:text-neutral-400">
                  Drag and drop your video file here, or click to browse
                </p>
                <Button
                  as="label"
                  htmlFor="file-upload"
                  variant="outline"
                  className="cursor-pointer"
                >
                  Select Video
                  <input
                    id="file-upload"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </Button>
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
                <div className="flex space-x-2 justify-center">
                  <Button
                    variant="ghost"
                    onClick={() => setFile(null)}
                    disabled={isUploading}
                  >
                    Change
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Upload and Analyze"}
                  </Button>
                </div>
              </div>
            )}
          </div>

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
