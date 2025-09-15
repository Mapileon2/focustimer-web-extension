import React, { useState } from 'react';
import { useTimer } from '../hooks/useTimer';
import TimerDisplay from './TimerDisplay';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PlayIcon from './icons/PlayIcon';
import PauseIcon from './icons/PauseIcon';
import ResetIcon from './icons/ResetIcon';
import SkipIcon from './icons/SkipIcon';
import SettingsIcon from './icons/SettingsIcon';
import { SOUND_OPTIONS } from '../constants';
import { TimerSettings } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TimerSettingsModal = ({ isOpen, onClose, settings, onSave }: { isOpen: boolean; onClose: () => void; settings: TimerSettings; onSave: (s: TimerSettings) => void; }) => {
    const [localDurations, setLocalDurations] = useState({
        work: settings.durations.work / 60,
        shortBreak: settings.durations.shortBreak / 60,
        longBreak: settings.durations.longBreak / 60,
    });
    const [soundUrl, setSoundUrl] = useState(settings.soundUrl);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: 'work' | 'shortBreak' | 'longBreak') => {
        setLocalDurations(prev => ({ ...prev, [key]: parseInt(e.target.value, 10) || 0 }));
    };
    
    const handleSave = () => {
        onSave({
            durations: {
                work: localDurations.work * 60,
                shortBreak: localDurations.shortBreak * 60,
                longBreak: localDurations.longBreak * 60,
            },
            soundUrl,
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Timer Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="work-duration" className="block text-sm font-medium text-text-secondary mb-1">Work (minutes)</label>
                        <Input id="work-duration" type="number" value={localDurations.work} onChange={(e) => handleChange(e, 'work')} className="w-full" />
                    </div>
                    <div>
                        <label htmlFor="short-break-duration" className="block text-sm font-medium text-text-secondary mb-1">Short Break (minutes)</label>
                        <Input id="short-break-duration" type="number" value={localDurations.shortBreak} onChange={(e) => handleChange(e, 'shortBreak')} className="w-full" />
                    </div>
                    <div>
                        <label htmlFor="long-break-duration" className="block text-sm font-medium text-text-secondary mb-1">Long Break (minutes)</label>
                        <Input id="long-break-duration" type="number" value={localDurations.longBreak} onChange={(e) => handleChange(e, 'longBreak')} className="w-full" />
                    </div>
                    <div>
                        <label htmlFor="notification-sound" className="block text-sm font-medium text-text-secondary mb-1">Notification Sound</label>
                        <Select value={soundUrl} onValueChange={setSoundUrl}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select sound" />
                            </SelectTrigger>
                            <SelectContent>
                                {SOUND_OPTIONS.map(opt => <SelectItem key={opt.name} value={opt.url}>{opt.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


const TimerSection = () => {
    const { timerState, isActive, startTimer, pauseTimer, resetTimer, skipSession, settings, updateSettings } = useTimer();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <Card>
            <div className="flex justify-end">
                <Button variant="ghost" size="sm" onClick={() => setIsSettingsOpen(true)} aria-label="Timer settings">
                    <SettingsIcon />
                </Button>
            </div>
            <div className="my-8">
                <Progress value={(timerState.remainingSec / (settings.durations[timerState.sessionType] || 1)) * 100} className="mb-4" />
                <TimerDisplay timerState={timerState} />
            </div>
            <div className="flex items-center justify-center gap-4">
                <Button variant="ghost" size="default" onClick={resetTimer} aria-label="Reset timer" className="flex flex-col h-16 w-16 justify-center items-center">
                    <ResetIcon className="w-7 h-7"/>
                    <span className="text-sm mt-2">Reset</span>
                </Button>
                <Button 
                    size="lg" 
                    onClick={isActive ? pauseTimer : startTimer} 
                    className="w-36 h-18 text-2xl shadow-xl"
                    aria-label={isActive ? 'Pause timer' : 'Start timer'}
                >
                    {isActive ? <><PauseIcon className="mr-2 w-8 h-8" /> Pause</> : <><PlayIcon className="mr-2 w-8 h-8" /> Start</>}
                </Button>
                <Button variant="ghost" size="default" onClick={skipSession} aria-label="Skip session" className="flex flex-col h-16 w-16 justify-center items-center">
                    <SkipIcon className="w-7 h-7"/>
                    <span className="text-sm mt-2">Skip</span>
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