
import { useState, useRef, useEffect } from "react";

interface VideoPlayerProps {
  videoUrl: string;
  onRecordingComplete?: (recordedBlob: Blob) => void;
  isRecording?: boolean;
  autoStart?: boolean;
}

const VideoPlayer = ({ 
  videoUrl, 
  onRecordingComplete, 
  isRecording = false, 
  autoStart = false 
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
  
  // Initialize recording if isRecording prop is true
  useEffect(() => {
    console.log("VideoPlayer: isRecording prop changed to", isRecording);
    setRecording(isRecording);
    
    if (isRecording && !mediaRecorder) {
      console.log("VideoPlayer: Starting recording based on prop change");
      startRecording();
    } else if (!isRecording && mediaRecorder) {
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
      
      // Clean up recording resources
      if (streamRef.current) {
        console.log("VideoPlayer: Cleaning up stream on unmount");
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isPlaying]);
  
  const startRecording = async () => {
    setRecordingError(null);
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
        videoRef.current.play().catch(err => {
          console.error("Error playing stream:", err);
        });
        setIsPlaying(true);
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
      
      const recorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType,
        videoBitsPerSecond: 2500000, // 2.5 Mbps
      });
      
      console.log("VideoPlayer: Created MediaRecorder", recorder);
      
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e: BlobEvent) => {
        console.log("VideoPlayer: Data available event", e.data.size);
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      recorder.onstart = () => {
        console.log("VideoPlayer: Recording started");
        setRecordedChunks([]);
      };
      
      recorder.onstop = () => {
        console.log("VideoPlayer: Recording stopped, chunks:", chunks.length);
        if (chunks.length > 0) {
          const recordedBlob = new Blob(chunks, { type: selectedMimeType });
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
          setRecordingError("No data was recorded. Please try again.");
        }
        
        // Reset recorder
        setMediaRecorder(null);
        setRecordedChunks([]);
        setRecording(false);
      };
      
      recorder.onerror = (event) => {
        console.error("VideoPlayer: Recording error:", event);
        setRecordingError("Recording error occurred. Please try again.");
      };
      
      setMediaRecorder(recorder);
      recorder.start(1000); // Collect chunks every second
      setRecording(true);
      
    } catch (error) {
      console.error("VideoPlayer: Error starting recording:", error);
      setRecordingError(`Could not start recording: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  const stopRecording = () => {
    console.log("VideoPlayer: Stopping recording, mediaRecorder state:", mediaRecorder?.state);
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      
      // Stop all tracks from the stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          console.log("VideoPlayer: Stopping track", track.kind, track.id);
          track.stop();
        });
      }
      
      // Reset video source to the original video URL if provided
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        if (videoUrl) {
          videoRef.current.src = videoUrl;
          videoRef.current.muted = false;
        }
      }
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
  
  return (
    <div className="relative bg-black rounded-lg overflow-hidden group" 
         onMouseEnter={() => setShowControls(true)}
         onMouseLeave={() => isPlaying && setShowControls(false)}>
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full aspect-video object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
        onEnded={handleVideoEnd}
      />
      
      {/* Recording error message */}
      {recordingError && (
        <div className="absolute top-4 left-4 right-4 bg-red-500/90 text-white py-2 px-3 rounded-lg text-sm z-20">
          Error: {recordingError}
        </div>
      )}
      
      {/* Recording indicator */}
      {recording && (
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500/90 text-white py-1 px-3 rounded-full text-sm z-10">
          <span className="h-2 w-2 bg-white rounded-full animate-pulse"></span>
          <span>Recording</span>
        </div>
      )}
      
      {/* Large play button overlay - always visible when paused */}
      {!isPlaying && !recording && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
          <button 
            onClick={togglePlay}
            className="bg-white/20 hover:bg-white/30 w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-sm transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Controls overlay - visible on hover or when paused */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'} z-10`}>
        <div className="space-y-2">
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
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
          
          {/* Play/pause and volume controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={togglePlay}
                className="text-white hover:text-white/80 transition-colors"
                disabled={recording}
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </button>
              
              {/* Recording button */}
              {onRecordingComplete && !recording && (
                <button
                  onClick={startRecording}
                  className="text-white hover:text-white/80 transition-colors flex items-center gap-1"
                  title="Start Recording"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" fill="#ef4444" />
                  </svg>
                  <span className="text-xs">REC</span>
                </button>
              )}
              
              {/* Stop recording button */}
              {onRecordingComplete && recording && (
                <button
                  onClick={stopRecording}
                  className="text-white hover:text-white/80 transition-colors flex items-center gap-1"
                  title="Stop Recording"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="6" width="12" height="12" />
                  </svg>
                  <span className="text-xs">STOP</span>
                </button>
              )}
              
              {/* Volume control */}
              <div className="flex items-center gap-2">
                <button className="text-white">
                  {volume === 0 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  ) : volume < 0.5 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </svg>
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
    </div>
  );
};

export default VideoPlayer;
