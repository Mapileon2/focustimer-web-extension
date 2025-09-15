
import React, { useState, useEffect } from 'react';
import { useTimer } from '../hooks/useTimer';
import { useQuotes } from '../hooks/useQuotes';
import { Button } from './ui/button';
import Spinner from './ui/Spinner';
import { Card } from '@/components/ui/card';

const SessionRecap = () => {
    // FIX: The useTimer hook provides a 'settings' object. Destructure 'settings' instead of 'sessionDurations'.
    const { completedWorkSessionsToday, settings } = useTimer();
    const { generateRecap, isLoading, getFavoriteQuote } = useQuotes();
    const [recapImage, setRecapImage] = useState<string | null>(null);
    const [showRecap, setShowRecap] = useState(false);

    useEffect(() => {
        if (completedWorkSessionsToday > 0 && completedWorkSessionsToday % 4 === 0) {
            setShowRecap(true);
        } else {
            setShowRecap(false);
            setRecapImage(null);
        }
    }, [completedWorkSessionsToday]);

    const handleGenerateRecap = async () => {
        const stats = {
            totalSessions: completedWorkSessionsToday,
            // FIX: Use settings.durations from the hook to correctly calculate total focus time.
            totalFocusMin: completedWorkSessionsToday * (settings.durations.work / 60),
            favQuote: getFavoriteQuote()
        };
        const image = await generateRecap(stats);
        if (image) {
            setRecapImage(image);
        }
    };

    if (!showRecap) {
        return null;
    }

    return (
        <Card className="mt-6">
            <h3 className="font-semibold text-lg text-center mb-4">Session Recap Ready!</h3>
            <p className="text-center text-text-secondary mb-4">You've completed {completedWorkSessionsToday} work sessions. Great job! Generate a shareable image of your progress.</p>
            
            {isLoading && (
                <div className="flex justify-center items-center my-4">
                    <Spinner />
                    <span className="ml-3">Generating your recap...</span>
                </div>
            )}
            
            {!recapImage && !isLoading && (
                <Button onClick={handleGenerateRecap} className="w-full" variant="secondary">
                    Generate Recap Image
                </Button>
            )}

            {recapImage && (
                <div className="mt-4">
                    <img src={recapImage} alt="Session Recap" className="rounded-lg w-full" />
                    <a href={recapImage} download="focus-smile-recap.jpg">
                       <Button className="w-full mt-4">
                           Download Image
                       </Button>
                    </a>
                </div>
            )}
        </Card>
    );
};

export default SessionRecap;
