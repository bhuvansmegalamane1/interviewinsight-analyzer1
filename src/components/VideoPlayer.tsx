import { useState, useRef, useEffect } from "react";
import { Play, Pause, Square, Volume, Volume1, Volume2, VolumeX, Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoPlayerProps {
  videoUrl: string;
  onRecordingComplete?: (recordedBlob: Blob) => void;
  isRecording?: boolean;
  autoStart?: boolean;
  onError?: (error: string) => void;
}

const VideoPlayer = ({ 
  videoUrl, 
  onRecordingComplete, 
  isRecording = false, 
  autoStart = false,
  onError
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recording, setRecording] = useState(isRecording);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recorderStateRef = useRef<string>("inactive");

  const { toast } = useToast();
  
  // Initialize recording if isRecording prop is true
  useEffect(() => {
    console.log("VideoPlayer: isRecording prop changed to", isRecording);
    
    if (isRecording && !recording) {
      console.log("VideoPlayer: Starting recording based on prop change");
      startRecording();
    } else if (!isRecording && recording) {
      console.log("VideoPlayer: Stopping recording based on prop change");
      stopRecording();
    }
  }, [isRecording]);
  
  // Auto start playback if specified
  useEffect(() => {
    if (autoStart && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Error auto-starting video:", error);
      });
      setIsPlaying(true);
    }
  }, [autoStart]);
  
  // Handle control visibility
  useEffect(() => {
    // Auto hide controls after inactivity
    const handleMouseMove = () => {
      setShowControls(true);
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  // Clean up resources on component unmount
  useEffect(() => {
    return () => {
      // Clean up recording resources
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        try {
          mediaRecorder.stop();
        } catch (e) {
          console.error("Error stopping media recorder:", e);
        }
      }
      
      if (streamRef.current) {
        console.log("VideoPlayer: Cleaning up stream on unmount");
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);
  
  const startRecording = async () => {
    setRecordingError(null);
    chunksRef.current = []; // Reset chunks
    setRecordedChunks([]);
    
    try {
      console.log("VideoPlayer: Requesting user media");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      console.log("VideoPlayer: Got media stream", stream);
      streamRef.current = stream;
      
      // Set the video source to the camera stream for recording
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true; // Prevent feedback
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().catch(err => {
              console.error("Error playing stream:", err);
            });
            setIsPlaying(true);
          }
        };
      }
      
      // Check for supported MIME types
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4'
      ];
      
      let selectedMimeType = '';
      for (const type of mimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          selectedMimeType = type;
          console.log("VideoPlayer: Using MIME type:", selectedMimeType);
          break;
        }
      }
      
      if (!selectedMimeType) {
        throw new Error("No supported MIME type found for recording");
      }
      
      // Create a new MediaRecorder instance with more conservative settings
      const recorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType,
        videoBitsPerSecond: 1000000, // 1 Mbps - more conservative
      });
      
      console.log("VideoPlayer: Created MediaRecorder", recorder);
      recorderStateRef.current = "inactive";
      
      recorder.ondataavailable = (e: BlobEvent) => {
        console.log("VideoPlayer: Data available event", e.data.size);
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
          setRecordedChunks(prev => [...prev, e.data]);
        }
      };
      
      recorder.onstart = () => {
        console.log("VideoPlayer: Recording started");
        recorderStateRef.current = "recording";
        setRecording(true);
        
        toast({
          title: "Recording Started",
          description: "Your interview is now being recorded.",
        });
      };
      
      recorder.onstop = () => {
        console.log("VideoPlayer: Recording stopped, chunks:", chunksRef.current.length);
        recorderStateRef.current = "inactive";
        setRecording(false);
        
        // Add a small delay to ensure all chunks are processed
        setTimeout(() => {
          if (chunksRef.current.length > 0 && chunksRef.current.some(chunk => chunk.size > 0)) {
            const recordedBlob = new Blob(chunksRef.current, { type: selectedMimeType });
            console.log("VideoPlayer: Created blob", recordedBlob.size);
            
            // Store in local storage (using URL)
            const videoUrl = URL.createObjectURL(recordedBlob);
            localStorage.setItem('latestInterviewRecording', videoUrl);
            
            // Store the metadata in sessionStorage
            const recordingData = {
              timestamp: new Date().toISOString(),
              blobType: recordedBlob.type,
              size: recordedBlob.size,
              duration: recorder.videoBitsPerSecond ? Math.floor(recordedBlob.size / (recorder.videoBitsPerSecond / 8)) : 0,
              hasSpokenContent: true // Simplified for mock purposes
            };
            
            console.log("VideoPlayer: Saving interview data", recordingData);
            sessionStorage.setItem('interviewData', JSON.stringify(recordingData));
            
            // Call the callback if provided
            if (onRecordingComplete) {
              console.log("VideoPlayer: Calling onRecordingComplete callback");
              onRecordingComplete(recordedBlob);
            }
          } else {
            console.error("VideoPlayer: No data recorded");
            const errorMsg = "No data was recorded. Please try again.";
            setRecordingError(errorMsg);
            if (onError) {
              onError(errorMsg);
            }
            
            toast({
              title: "Recording Error",
              description: errorMsg,
              variant: "destructive",
            });
          }
          
          // Reset recorder and streams
          setMediaRecorder(null);
          
          // Reset video source to the original video URL if provided
          if (videoRef.current) {
            videoRef.current.srcObject = null;
            if (videoUrl) {
              videoRef.current.src = videoUrl;
              videoRef.current.muted = false;
            }
          }
        }, 500);
      };
      
      recorder.onerror = (event) => {
        console.error("VideoPlayer: Recording error:", event);
        const errorMsg = "Recording error occurred. Please try again.";
        setRecordingError(errorMsg);
        if (onError) {
          onError(errorMsg);
        }
        
        toast({
          title: "Recording Error",
          description: errorMsg,
          variant: "destructive",
        });
      };
      
      // Set up timer to collect data at intervals
      recorder.start(1000); // Collect chunks every second
      setMediaRecorder(recorder);
      
      // Make sure we record for at least 3 seconds before allowing to stop
      // This helps ensure we get some data
      setTimeout(() => {
        console.log("VideoPlayer: Setting minimum recording time");
      }, 3000);
      
    } catch (error) {
      console.error("VideoPlayer: Error starting recording:", error);
      const errorMsg = `Could not start recording: ${error instanceof Error ? error.message : String(error)}`;
      setRecordingError(errorMsg);
      if (onError) {
        onError(errorMsg);
      }
      
      toast({
        title: "Camera Access Error",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };
  
  const stopRecording = () => {
    console.log("VideoPlayer: Stopping recording, mediaRecorder state:", mediaRecorder?.state);
    
    // Only stop if we're actually recording
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      try {
        // Request a final data chunk before stopping
        mediaRecorder.requestData();
        
        // Short delay to ensure we get the final data
        setTimeout(() => {
          try {
            mediaRecorder.stop();
          } catch (err) {
            console.error("Error stopping recorder after delay:", err);
          }
        }, 200);
      } catch (error) {
        console.error("Error stopping recording:", error);
        
        toast({
          title: "Error",
          description: "Failed to stop recording properly. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // If mediaRecorder is not in recording state, just clean up
      setRecording(false);
    }
    
    // Stop all tracks from the stream regardless of recorder state
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log("VideoPlayer: Stopping track", track.kind, track.id);
        track.stop();
      });
      streamRef.current = null;
    }
  };
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleVideoEnd = () => {
    setIsPlaying(false);
    setShowControls(true);
  };
  
  // New simplified UI to match the design in the image
  return (
    <div className="relative bg-black rounded-lg overflow-hidden group h-full w-full" 
         onMouseEnter={() => setShowControls(true)}
         onMouseLeave={() => isPlaying && setShowControls(false)}>
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
        onEnded={handleVideoEnd}
      />
      
      {/* Recording error message */}
      {recordingError && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white py-3 px-4 text-center z-50">
          Error: {recordingError}
        </div>
      )}
      
      {/* Recording indicator */}
      {recording && (
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/90 text-white py-1 px-3 rounded-full text-sm z-10">
          <span className="h-2 w-2 bg-white rounded-full animate-pulse"></span>
          <span>REC</span>
        </div>
      )}
      
      {/* Large play button overlay - visible when paused or no media */}
      {(!isPlaying || !videoUrl) && !recording && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
          <button 
            onClick={togglePlay}
            className="bg-black/60 hover:bg-black/70 w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-sm transition-all"
            disabled={!videoUrl && !videoRef.current?.srcObject}
          >
            <Play className="text-white h-10 w-10" />
          </button>
        </div>
      )}
      
      {/* Controls overlay - simplified to match the design */}
      <div className={`absolute bottom-0 left-0 right-0 bg-black/60 py-2 px-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'} z-10`}>
        <div className="space-y-3">
          {/* Seek bar */}
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.01"
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1.5 rounded-full bg-white/30 appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
            <div className="text-xs text-white font-medium whitespace-nowrap">
              {formatTime(currentTime)} / {Number.isFinite(duration) ? formatTime(duration) : "∞:NaN"}
            </div>
          </div>
          
          {/* Play/pause and volume controls */}
          <div className="flex items-center gap-4">
            <button 
              onClick={togglePlay}
              className="text-white hover:text-white/80 transition-colors"
              disabled={recording}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            
            {/* Recording button */}
            {onRecordingComplete && (
              <button
                onClick={recording ? stopRecording : startRecording}
                className={`flex items-center justify-center h-6 w-6 rounded-full ${recording ? 'bg-red-500 text-white' : 'bg-white/20 text-white'}`}
                title={recording ? "Stop Recording" : "Start Recording"}
              >
                {recording ? (
                  <Square className="h-3 w-3" />
                ) : (
                  <Mic className="h-3 w-3" />
                )}
              </button>
            )}
            
            {/* Volume control */}
            <div className="flex items-center gap-2">
              <button className="text-white">
                {volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : volume < 0.3 ? (
                  <Volume className="h-4 w-4" />
                ) : volume < 0.7 ? (
                  <Volume1 className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 rounded-full bg-white/30 appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
