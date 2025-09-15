import React, { useState, useMemo } from 'react';
import { useTimer } from '../hooks/useTimer';
import TimerDisplay from './TimerDisplay';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PlayIcon from './icons/PlayIcon';
import PauseIcon from './icons/PauseIcon';
import ResetIcon from './icons/ResetIcon';
import SkipIcon from './icons/SkipIcon';
import SettingsIcon from './icons/SettingsIcon';
import TimerSettingsModal from './TimerSettingsModal';
import { Progress } from '@/components/ui/progress';

const TimerSection = () => {
    const { timerState, isActive, startTimer, pauseTimer, resetTimer, skipSession, settings, updateSettings } = useTimer();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const progressValue = useMemo(() => {
        const duration = settings.durations[timerState.sessionType] || 1;
        return (1 - (timerState.remainingSec / duration)) * 100;
    }, [timerState.remainingSec, timerState.sessionType, settings.durations]);

    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold capitalize">{timerState.sessionType.replace('B', ' B')}</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)} aria-label="Timer settings">
                    <SettingsIcon className="w-6 h-6" />
                </Button>
            </div>
            <div className="my-8">
                <TimerDisplay timerState={timerState} />
                <Progress value={progressValue} className="mt-4 h-3 transition-all duration-500 ease-linear" />
            </div>
            <div className="flex items-center justify-center gap-4">
                <Button variant="ghost" size="default" onClick={resetTimer} aria-label="Reset timer" className="flex flex-col h-16 w-16 justify-center items-center">
                    <ResetIcon className="w-7 h-7"/>
                    <span className="text-xs mt-1">Reset</span>
                </Button>
                <Button 
                    size="lg" 
                    onClick={isActive ? pauseTimer : startTimer} 
                    className="w-32 h-16 text-xl shadow-lg rounded-full"
                    aria-label={isActive ? 'Pause timer' : 'Start timer'}
                >
                    {isActive ? <><PauseIcon className="mr-2 w-7 h-7" /><span>Pause</span></> : <><PlayIcon className="mr-2 w-7 h-7" /><span>Start</span></>}
                </Button>
                <Button variant="ghost" size="default" onClick={skipSession} aria-label="Skip session" className="flex flex-col h-16 w-16 justify-center items-center">
                    <SkipIcon className="w-7 h-7"/>
                    <span className="text-xs mt-1">Skip</span>
                </Button>
            </div>
            <TimerSettingsModal 
                isOpen={isSettingsOpen} 
                onClose={() => setIsSettingsOpen(false)} 
                settings={settings}
                onSave={updateSettings}
            />
        </Card>
    );
};

export default TimerSection;