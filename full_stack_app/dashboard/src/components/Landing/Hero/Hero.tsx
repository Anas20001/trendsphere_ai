import React, { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Vector2 } from 'three';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { Scene } from './Scene';
import { useTheme } from '../../../contexts/ThemeContext';

export function Hero() {
  const navigate = useNavigate();
  const mouse = useRef(new Vector2());
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`
        relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-white 
        dark:from-gray-900 dark:to-gray-800 transition-all duration-1000
        ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      {/* 3D Background */}
      <div className="absolute inset-0">
        <Canvas>
          <Suspense fallback={null}>
            <Scene 
              mouse={mouse}
              particleColor={theme === 'dark' ? '#6366f1' : '#4f46e5'}
              isInView={isInView}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          <h1 className={`
            text-5xl md:text-6xl lg:text-7xl font-bold
            transition-all duration-1000 delay-300
            ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-400 dark:to-indigo-300">
              Transform Your Data
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">
              Into Insights
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Harness the power of AI to unlock actionable insights and drive business growth with our advanced analytics platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transform hover:scale-105 transition-all duration-200"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-6 h-6" />
            </Link>
            
            <button
              onClick={() => navigate('/demo')}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition-all duration-200"
            >
              Watch Demo
              <Play className="ml-2 w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { label: 'Active Users', value: '10,000+' },
            { label: 'Data Points', value: '1B+' },
            { label: 'Customer Satisfaction', value: '99%' }
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}