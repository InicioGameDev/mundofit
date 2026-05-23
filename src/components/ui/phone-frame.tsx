'use client';

import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  title?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, title = "FitFlow Student" }) => {
  return (
    <div className="relative mx-auto w-full max-w-[340px] shrink-0 select-none">
      {/* 3D shadow and glowing ambient backdrop */}
      <div className="absolute -inset-1.5 rounded-[42px] bg-gradient-to-tr from-lime-400/20 to-emerald-500/20 opacity-40 blur-xl animate-pulse-glow" />
      
      {/* Smartphone Chassis */}
      <div className="relative rounded-[40px] border-8 border-slate-900 bg-slate-950 p-2 shadow-2xl ring-4 ring-slate-800">
        
        {/* Left Side Buttons (Volume) */}
        <div className="absolute -left-2.5 top-24 h-10 w-1 rounded-l bg-slate-800" />
        <div className="absolute -left-2.5 top-36 h-10 w-1 rounded-l bg-slate-800" />
        
        {/* Right Side Button (Power) */}
        <div className="absolute -right-2.5 top-28 h-14 w-1 rounded-r bg-slate-800" />

        {/* Screen Bezel container */}
        <div className="relative overflow-hidden rounded-[32px] bg-slate-950 border border-white/5 flex flex-col" style={{ height: '580px' }}>
          
          {/* iOS Top Status Bar */}
          <div className="relative z-20 flex h-9 items-center justify-between px-5 pt-1 text-[10px] text-white bg-slate-950/80 font-bold backdrop-blur-sm shrink-0">
            <span className="text-[9px] tracking-tight">14:04</span>
            
            {/* Dynamic Island Notch */}
            <div className="absolute left-1/2 top-1.5 h-4.5 w-24 -translate-x-1/2 rounded-full bg-black flex items-center justify-end px-3">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-900" />
            </div>
            
            <div className="flex items-center gap-1">
              <Signal className="h-3 w-3" />
              <Wifi className="h-3 w-3" />
              <div className="flex items-center gap-0.5">
                <Battery className="h-3 w-3.5" />
                <span className="text-[8px] opacity-75">84%</span>
              </div>
            </div>
          </div>

          {/* Core Simulated App Display */}
          <div className="relative flex-1 overflow-y-auto no-scrollbar bg-slate-950 text-slate-100 flex flex-col">
            {children}
          </div>

          {/* iOS Home Indicator Bar */}
          <div className="h-5 bg-slate-950/90 flex items-center justify-center shrink-0">
            <div className="h-1 w-28 rounded-full bg-white/35" />
          </div>

        </div>
      </div>
    </div>
  );
};
