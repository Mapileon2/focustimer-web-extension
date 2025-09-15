import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SOUND_OPTIONS } from '../constants';
import { TimerSettings } from '../types';

interface TimerSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: TimerSettings;
    onSave: (settings: TimerSettings) => void;
}

const TimerSettingsModal = ({ isOpen, onClose, settings, onSave }: TimerSettingsModalProps) => {
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

export default TimerSettingsModal;
