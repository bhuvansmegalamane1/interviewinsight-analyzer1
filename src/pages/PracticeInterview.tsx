
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import CountdownTimer from "@/components/CountdownTimer";
import { interviewQuestions } from "@/data/interviewQuestions";

type RecordingState = "idle" | "countdown" | "recording" | "processing";

const PracticeInterview = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [interviewType, setInterviewType] = useState("general");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [speechDetected, setSpeechDetected] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<number | null>(null);
  const audioAnalyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const questions = interviewQuestions[interviewType as keyof typeof interviewQuestions] || [];
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    return () => {
      // Clean up on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [stream, audioContext]);

  const requestCameraPermission = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      // Setup audio analysis
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(audioCtx);
      
      const analyser = audioCtx.createAnalyser();
      audioAnalyserRef.current = analyser;
      analyser.fftSize = 256;
      
      const audioSource = audioCtx.createMediaStreamSource(mediaStream);
      audioSource.connect(analyser);
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      dataArrayRef.current = dataArray;
      
      // Start audio level monitoring
      const checkAudioInterval = setInterval(() => {
        if (recordingState === "recording" && analyser && dataArray) {
          analyser.getByteFrequencyData(dataArray);
          
          // Calculate audio level (basic average of frequency values)
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setAudioLevel(avg);
          
          // If average is above threshold, consider speech detected
          if (avg > 15) { // Adjust this threshold based on testing
            setSpeechDetected(true);
          }
        }
      }, 100);
      
      // Return the media stream, not the cleanup function
      return mediaStream;
      
    } catch (err) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera and microphone access to use the practice feature.",
        variant: "destructive",
      });
      return null;
    }
  };

  const startRecording = async () => {
    setRecordingState("countdown");
    setIsCountingDown(true);
    setSpeechDetected(false);
    
    setTimeout(() => {
      setIsCountingDown(false);
      beginRecording();
    }, 3000);
  };

  const beginRecording = async () => {
    // If we don't have a stream yet, request it
    let mediaStream = stream;
    if (!mediaStream) {
      mediaStream = await requestCameraPermission();
    }
    
    // Check if mediaStream is valid (not null)
    if (!mediaStream) {
      toast({
        title: "Camera access failed",
        description: "Could not access camera and microphone.",
        variant: "destructive",
      });
      return;
    }
    
    setRecordingState("recording");
    setRecordingTime(0);
    
    const mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorderRef.current = mediaRecorder;
    
    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      setRecordedChunks(chunks);
      setRecordingState("processing");
      
      // Store speech detection result in session storage for analysis page
      sessionStorage.setItem('interviewData', JSON.stringify({
        timestamp: new Date().toISOString(),
        hasSpokenContent: speechDetected,
        recordingDuration: recordingTime
      }));
      
      setTimeout(() => {
        processRecording();
      }, 2000);
    };
    
    // Start the recording timer
    timerRef.current = window.setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    mediaRecorder.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === "recording") {
      mediaRecorderRef.current.stop();
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const processRecording = () => {
    // For demo purposes, just navigate to a random analysis ID
    const analysisId = Math.floor(Math.random() * 1000000);
    navigate(`/analysis/${analysisId}`);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      toast({
        title: "End of questions",
        description: "You've reached the end of the question set.",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Layout title="Practice Interview">
      <motion.div 
        variants={fadeIn("up", 0.3)}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6 border border-neutral-200 dark:border-neutral-800 relative overflow-hidden">
              {recordingState === "countdown" && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                  <CountdownTimer seconds={3} onComplete={() => {}} />
                </div>
              )}
              
              <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                ></video>
              </div>
              
              {recordingState === "recording" && (
                <>
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500/90 text-white py-1 px-3 rounded-full text-sm">
                    <span className="h-2 w-2 bg-white rounded-full animate-pulse"></span>
                    <span>Recording {formatTime(recordingTime)}</span>
                  </div>
                  
                  {/* Audio level indicator */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 text-white py-1 px-3 rounded-full text-sm">
                    <div className="flex gap-1 items-center">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i}
                          className={`h-3 w-1 rounded-full ${
                            audioLevel > i * 10 ? 'bg-green-500' : 'bg-gray-500'
                          }`}
                        ></div>
                      ))}
                    </div>
                    <span>{speechDetected ? 'Voice detected' : 'Silence'}</span>
                  </div>
                </>
              )}
              
              {recordingState === "processing" && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10">
                  <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-white">Processing your interview...</p>
                </div>
              )}
              
              <div className="mt-4 flex justify-between items-center">
                <div>
                  {recordingState === "idle" && (
                    <p className="text-sm text-neutral-500">
                      Start recording to begin the practice interview
                    </p>
                  )}
                  
                  {recordingState === "recording" && (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={nextQuestion}
                        disabled={currentQuestionIndex >= questions.length - 1}
                      >
                        Skip Question
                      </Button>
                    </div>
                  )}
                </div>
                
                <div>
                  {recordingState === "idle" && (
                    <Button onClick={startRecording}>
                      Start Recording
                    </Button>
                  )}
                  
                  {recordingState === "recording" && (
                    <Button 
                      variant="destructive" 
                      onClick={stopRecording}
                    >
                      End Interview
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
          
          <div>
            <Card className="p-6 border border-neutral-200 dark:border-neutral-800 h-full flex flex-col">
              <h3 className="text-lg font-medium mb-4">Interview Settings</h3>
              
              <div className="space-y-6 flex-1">
                <div className="space-y-2">
                  <label className="text-sm text-neutral-500">Interview Type</label>
                  <Select
                    value={interviewType}
                    onValueChange={setInterviewType}
                    disabled={recordingState !== "idle"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select interview type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Interview</SelectItem>
                      <SelectItem value="technical">Technical Interview</SelectItem>
                      <SelectItem value="behavioral">Behavioral Interview</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {recordingState === "recording" && (
                  <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 flex-1">
                    <h4 className="text-sm font-medium text-neutral-500 mb-2">Current Question:</h4>
                    <p className="text-lg">{currentQuestion}</p>
                  </div>
                )}
                
                <div className="space-y-2 text-sm text-neutral-500">
                  <h4 className="font-medium">Tips:</h4>
                  <ul className="space-y-2">
                    <li className="flex gap-2 items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                      <span>Make sure you're in a quiet environment with good lighting</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                      <span>Position yourself so your face is clearly visible</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                      <span>Speak clearly and maintain eye contact with the camera</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default PracticeInterview;
