import React, { useState, useEffect } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + Math.floor(Math.random() * 3) + 1; // Slower progress
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 180);

    // Complete loading effect after full animation cycle
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      // Stay at 100% for a moment before fading out
      setTimeout(() => {
        // Fade out by adding a class that triggers opacity animation
        document.querySelector('.loading-screen').style.opacity = 0;
        
        // After fade-out animation completes, remove the component
        setTimeout(() => {
          setShowLoadingScreen(false);
          if (onLoadingComplete) onLoadingComplete();
        }, 1000);
      }, 1200);
    }, 4500);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  if (!showLoadingScreen) return null;

  return (
    <div className="loading-screen">
      <div className="logo-container animate-logo">
        <h1 className="split-logo">
          <span className="logo-dark">Indian</span>
          <span className="logo-light">_ArtMate</span>
        </h1>
      </div>
      <div className="loading-info">
        <span>loading... {progress}%</span>
      </div>
    </div>
  );
};

export default LoadingScreen; 