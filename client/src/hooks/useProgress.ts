import { useState, useCallback, useRef } from 'react';

export const useProgress = (duration: number) => {
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const progressInterval = useRef<NodeJS.Timeout>();

  const startProgress = useCallback(() => {
    setIsGenerating(true);
    setIsComplete(false);
    setProgress(0);

    const startTime = Date.now();
    progressInterval.current = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = Math.min((elapsedTime / duration) * 100, 95);
      setProgress(newProgress);
    }, 100);
  }, [duration]);

  const completeProgress = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    setProgress(100);
    setIsGenerating(false);
    setIsComplete(true);
  }, []);

  const resetProgress = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    setProgress(0);
    setIsGenerating(false);
    setIsComplete(false);
  }, []);

  return {
    progress,
    isGenerating,
    isComplete,
    startProgress,
    completeProgress,
    resetProgress
  };
};