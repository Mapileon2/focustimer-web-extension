
import React from 'react';
import { TimerState } from '../types';

interface TimerDisplayProps {
  timerState: TimerState;
}

const fmtMMSS = (seconds: number): string => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

const sessionTypeLabels: { [key in TimerState['sessionType']]: string } = {
  work: "Work Session",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

const TimerDisplay = ({ timerState }: TimerDisplayProps) => {
  const remainingSec = timerState?.remainingSec ?? 0;
  const sessionType = timerState?.sessionType ?? 'work';
  const totalDuration = 25 * 60; // Assuming 25 minutes for work session for progress bar
  const progress = ( (totalDuration - remainingSec) / totalDuration) * 100;

  return (
    <div className="flex flex-col items-center justify-center text-center">
       <div 
        className="text-7xl md:text-8xl font-bold tracking-tighter text-text-primary mb-2"
        aria-label={`Time remaining ${fmtMMSS(remainingSec)}`}
        >
        {fmtMMSS(remainingSec)}
      </div>
      <div className="text-lg font-medium text-brand-secondary uppercase tracking-wider">
        {sessionTypeLabels[sessionType]}
      </div>
      <div className="text-sm text-text-secondary mt-1">
        Session #{(timerState?.sessionCount ?? 0) + 1}
      </div>
    </div>
  );
};

export default TimerDisplay;
