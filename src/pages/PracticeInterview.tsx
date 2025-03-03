
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
  const [speechDuration, setSpeechDuration] = useState(0);
  const [postureFeedback, setPostureFeedback] = useState({
    status: "good", // "good", "slouching", "tooClose", "tooFar"
    lastChecked: Date.now()
  });
  const [eyeContactScore, setEyeContactScore] = useState(0);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [grammarIssues, setGrammarIssues] = useState<string[]>([]);
  const [facialExpressions, setFacialExpressions] = useState("neutral"); // "neutral", "positive", "negative"
  const [audioAnalysisInterval, setAudioAnalysisInterval] = useState<number | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<number | null>(null);
  const audioAnalyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const silenceTimer = useRef<number | null>(null);
  const postureCheckInterval = useRef<number | null>(null);
  const expressionCheckInterval = useRef<number | null>(null);
  const eyeContactCheckInterval = useRef<number | null>(null);
  const grammarCheckInterval = useRef<number | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const questions = interviewQuestions[interviewType as keyof typeof interviewQuestions] || [];
  const currentQuestion = questions[currentQuestionIndex];

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
      }
      if (postureCheckInterval.current) {
        clearInterval(postureCheckInterval.current);
      }
      if (expressionCheckInterval.current) {
        clearInterval(expressionCheckInterval.current);
      }
      if (eyeContactCheckInterval.current) {
        clearInterval(eyeContactCheckInterval.current);
      }
      if (grammarCheckInterval.current) {
        clearInterval(grammarCheckInterval.current);
      }
      if (audioContext) {
        audioContext.close();
      }
      if (audioAnalysisInterval) {
        clearInterval(audioAnalysisInterval);
      }
    };
  }, [stream, audioContext, audioAnalysisInterval]);

  // Simulate facial expression detection
  const checkFacialExpression = () => {
    // In a real implementation, this would use computer vision AI
    // For simulation, we'll randomly transition between expressions with a bias toward positive
    const expressionRoll = Math.random();
    if (expressionRoll > 0.7) {
      setFacialExpressions("positive");
    } else if (expressionRoll > 0.5) {
      setFacialExpressions("neutral");
    } else if (expressionRoll > 0.35) {
      setFacialExpressions("negative");
    }
    // No change for the remaining probability
  };

  // Simulate eye contact detection
  const checkEyeContact = () => {
    // In a real implementation, this would use eye-tracking computer vision
    // For simulation, we'll use a weighted random approach
    const baseScore = Math.floor(Math.random() * 40) + 50; // Base score between 50-90
    const variationRange = 10; // How much the score can vary
    const newScore = Math.min(100, Math.max(0, baseScore + (Math.random() * variationRange * 2 - variationRange)));
    setEyeContactScore(newScore);
  };

  // Simulate grammar checking
  const checkGrammar = () => {
    // In a real implementation, this would analyze speech transcription
    // For simulation, we'll randomly create grammar issues
    const potentialIssues = [
      "Using 'like' as a filler word",
      "Subject-verb agreement error",
      "Incorrect use of 'me and I'",
      "Run-on sentence detected",
      "Sentence fragment detected",
      "Incorrect verb tense"
    ];
    
    // Clear previous issues occasionally
    if (Math.random() > 0.7) {
      setGrammarIssues([]);
    }
    
    // Add new issues occasionally
    if (speechDetected && Math.random() > 0.8) {
      const newIssue = potentialIssues[Math.floor(Math.random() * potentialIssues.length)];
      if (!grammarIssues.includes(newIssue)) {
        setGrammarIssues(prev => [...prev, newIssue]);
      }
    }
  };

  // Simulate confidence scoring
  const updateConfidenceScore = () => {
    // In a real implementation, this would analyze speech patterns, tone, and body language
    // For simulation, we'll base it on audio level, speech duration, and a random factor
    
    // Higher audio level and longer speech duration typically indicate more confidence
    const audioFactor = audioLevel / 100; // Normalize to 0-1
    const speechFactor = Math.min(1, speechDuration / 60); // Cap at 1 minute for max score
    const postureFactor = postureFeedback.status === "good" ? 1 : 0.7; // Good posture boosts confidence score
    const expressionFactor = facialExpressions === "positive" ? 1.1 : 
                              facialExpressions === "neutral" ? 1 : 0.9;
    
    const baseScore = 50 + (audioFactor * 15) + (speechFactor * 15) + (Math.random() * 10);
    const finalScore = Math.min(100, Math.max(0, baseScore * postureFactor * expressionFactor));
    
    setConfidenceScore(finalScore);
  };

  // Posture detection simulator
  const checkPosture = () => {
    // In a real app, this would use computer vision AI
    // For simulation, we'll weight toward good posture but with occasional issues
    const postureRoll = Math.random();
    
    let newPostureStatus = postureFeedback.status;
    
    // 60% chance of good posture
    if (postureRoll > 0.4) {
      newPostureStatus = "good";
    } else if (postureRoll > 0.25) {
      newPostureStatus = "slouching";
    } else if (postureRoll > 0.1) {
      newPostureStatus = "tooClose";
    } else {
      newPostureStatus = "tooFar";
    }
    
    if (newPostureStatus !== postureFeedback.status) {
      setPostureFeedback({
        status: newPostureStatus as "good" | "slouching" | "tooClose" | "tooFar",
        lastChecked: Date.now()
      });
      
      // If bad posture is detected, give feedback
      if (newPostureStatus !== "good" && Date.now() - postureFeedback.lastChecked > 5000) {
        const feedback = {
          slouching: "Try sitting up straighter to appear more confident.",
          tooClose: "You're a bit too close to the camera.",
          tooFar: "Move a bit closer to be more visible."
        }[newPostureStatus];
        
        if (feedback) {
          toast({
            title: "Posture Tip",
            description: feedback,
          });
        }
      }
    }
  };

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
      
      // Start audio level monitoring with higher sensitivity
      const audioMonitoringInterval = setInterval(() => {
        if (analyser && dataArray) {
          analyser.getByteFrequencyData(dataArray);
          
          // Calculate audio level with improved sensitivity
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setAudioLevel(avg);
          
          // Lower threshold for speech detection
          if (avg > 8) { // Reduced threshold for better sensitivity
            setSpeechDetected(true);
            setSpeechDuration(prev => prev + 0.1); // Increment speech duration (100ms interval)
            
            if (silenceTimer.current) {
              clearTimeout(silenceTimer.current);
              silenceTimer.current = null;
            }
          } else if (speechDetected) {
            // If silence is detected after speech, wait a bit before changing state
            if (!silenceTimer.current) {
              silenceTimer.current = window.setTimeout(() => {
                // We don't set speechDetected to false here because we want to
                // track if speech was ever detected during the interview
              }, 1500);
            }
          }
        }
      }, 100);
      
      setAudioAnalysisInterval(audioMonitoringInterval);
      
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
    setSpeechDuration(0);
    setGrammarIssues([]);
    
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
      
      // Enhanced data collection for more accurate analysis
      sessionStorage.setItem('interviewData', JSON.stringify({
        timestamp: new Date().toISOString(),
        hasSpokenContent: speechDetected,
        recordingDuration: recordingTime,
        speechDuration: speechDuration,
        speechPercentage: recordingTime > 0 ? Math.min(100, (speechDuration / recordingTime) * 100) : 0,
        postureFeedback: postureFeedback.status,
        eyeContactScore: eyeContactScore,
        confidenceScore: confidenceScore,
        facialExpressions: facialExpressions,
        grammarIssues: grammarIssues.length,
        interviewType: interviewType,
        questionsAnswered: currentQuestionIndex + 1
      }));
      
      setTimeout(() => {
        processRecording();
      }, 2000);
    };
    
    // Start the recording timer
    timerRef.current = window.setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    // Start analysis intervals
    postureCheckInterval.current = window.setInterval(() => {
      checkPosture();
      updateConfidenceScore(); // Update confidence regularly
    }, 2000);
    
    expressionCheckInterval.current = window.setInterval(() => {
      checkFacialExpression();
    }, 3000);
    
    eyeContactCheckInterval.current = window.setInterval(() => {
      checkEyeContact();
    }, 2500);
    
    grammarCheckInterval.current = window.setInterval(() => {
      checkGrammar();
    }, 4000);
    
    mediaRecorder.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === "recording") {
      mediaRecorderRef.current.stop();
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
        silenceTimer.current = null;
      }
      
      if (postureCheckInterval.current) {
        clearInterval(postureCheckInterval.current);
        postureCheckInterval.current = null;
      }
      
      if (expressionCheckInterval.current) {
        clearInterval(expressionCheckInterval.current);
        expressionCheckInterval.current = null;
      }
      
      if (eyeContactCheckInterval.current) {
        clearInterval(eyeContactCheckInterval.current);
        eyeContactCheckInterval.current = null;
      }
      
      if (grammarCheckInterval.current) {
        clearInterval(grammarCheckInterval.current);
        grammarCheckInterval.current = null;
      }
      
      if (audioAnalysisInterval) {
        clearInterval(audioAnalysisInterval);
        setAudioAnalysisInterval(null);
      }
    }
  };

  const processRecording = () => {
    // Generate a random analysis ID and navigate to the analysis page
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

  // Get posture status text and color
  const getPostureStatus = () => {
    const statusText = {
      good: "Good posture",
      slouching: "Slouching detected",
      tooClose: "Too close to camera",
      tooFar: "Too far from camera"
    }[postureFeedback.status];
    
    const statusColor = {
      good: "bg-green-500",
      slouching: "bg-amber-500",
      tooClose: "bg-amber-500",
      tooFar: "bg-amber-500"
    }[postureFeedback.status];
    
    return { text: statusText, color: statusColor };
  };
  
  // Get facial expression status
  const getExpressionStatus = () => {
    const statusText = {
      positive: "Positive expression",
      neutral: "Neutral expression",
      negative: "Negative expression"
    }[facialExpressions];
    
    const statusColor = {
      positive: "bg-green-500",
      neutral: "bg-blue-500",
      negative: "bg-amber-500"
    }[facialExpressions];
    
    return { text: statusText, color: statusColor };
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
                            audioLevel > i * 8 ? 'bg-green-500' : 'bg-gray-500'
                          }`}
                        ></div>
                      ))}
                    </div>
                    <span>{speechDetected ? 'Voice detected' : 'Silence'}</span>
                  </div>
                  
                  {/* Performance indicators */}
                  <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                    {/* Posture indicator */}
                    <div className="flex items-center gap-2 bg-black/50 text-white py-1 px-3 rounded-full text-sm">
                      <span className={`h-2 w-2 rounded-full ${getPostureStatus().color}`}></span>
                      <span>{getPostureStatus().text}</span>
                    </div>
                    
                    {/* Expression indicator */}
                    <div className="flex items-center gap-2 bg-black/50 text-white py-1 px-3 rounded-full text-sm">
                      <span className={`h-2 w-2 rounded-full ${getExpressionStatus().color}`}></span>
                      <span>{getExpressionStatus().text}</span>
                    </div>
                    
                    {/* Eye contact indicator */}
                    <div className="flex items-center gap-2 bg-black/50 text-white py-1 px-3 rounded-full text-sm">
                      <span className={`h-2 w-2 rounded-full ${eyeContactScore > 70 ? 'bg-green-500' : eyeContactScore > 40 ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                      <span>Eye contact: {Math.round(eyeContactScore)}%</span>
                    </div>
                    
                    {/* Confidence indicator */}
                    <div className="flex items-center gap-2 bg-black/50 text-white py-1 px-3 rounded-full text-sm">
                      <span className={`h-2 w-2 rounded-full ${confidenceScore > 70 ? 'bg-green-500' : confidenceScore > 40 ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                      <span>Confidence: {Math.round(confidenceScore)}%</span>
                    </div>
                  </div>
                  
                  {/* Grammar issues notification */}
                  {grammarIssues.length > 0 && (
                    <div className="absolute bottom-4 left-4 bg-black/50 text-white py-1 px-3 rounded-full text-sm flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                      <span>Grammar issues: {grammarIssues.length}</span>
                    </div>
                  )}
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
                  <h4 className="font-medium">How You're Being Analyzed:</h4>
                  <ul className="space-y-2">
                    <li className="flex gap-2 items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                      <span>Verbal analysis: Speech clarity, grammar, filler words</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                      <span>Visual analysis: Eye contact, posture, facial expressions</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                      <span>Content analysis: Relevance, structure, completeness</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                      <span>Overall impression: Confidence, engagement, professionalism</span>
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
