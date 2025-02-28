
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownTimerProps {
  seconds: number;
  onComplete: () => void;
}

const CountdownTimer = ({ seconds, onComplete }: CountdownTimerProps) => {
  const [countdown, setCountdown] = useState(seconds);
  
  useEffect(() => {
    if (countdown <= 0) {
      onComplete();
      return;
    }
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [countdown, onComplete]);
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={countdown}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="text-white text-7xl font-bold flex items-center justify-center h-24 w-24 rounded-full bg-primary/70 backdrop-blur-sm"
      >
        {countdown}
      </motion.div>
    </AnimatePresence>
  );
};

export default CountdownTimer;
