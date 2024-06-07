// src/components/LoadingAnimation.js
import React from 'react';

const LoadingAnimation = () => {
  return (
    <div className="flex justify-center items-center py-5">
      <div className="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingAnimation;
