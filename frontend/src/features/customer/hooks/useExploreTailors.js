import { useState, useEffect } from 'react';
import { customerApi } from '../services/customerApi';

export function useExploreTailors() {
    // 1. isLoading is ALREADY true on initial mount.
    const [tailors, setTailors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. The core fetch logic (Notice: No synchronous state updates at the top!)
    const fetchTailorsList = async () => {
        try {
            // The very first action is an 'await'. React loves this!
            const response = await customerApi.getActiveTailors();
            console.log("Raw API Response:", response); 
            
            const payload = response.data !== undefined ? response.data : response;

            // All these state updates happen AFTER the await, making them safely asynchronous.
            if (payload.success && payload.data) {
                setTailors(payload.data);
            } else if (Array.isArray(payload)) {
                setTailors(payload); 
            }
        } catch (err) {
            console.error("Tailor directory extraction failure:", err);
            setError("Unable to communicate with the StitchVerse artisan registry server.");
        } finally {
            setIsLoading(false); 
        }
    };

    // 3. A dedicated function for your UI refresh buttons
    const handleManualRefresh = async () => {
        // It is 100% safe to set state synchronously inside a user-triggered event like a click
        setIsLoading(true);
        setError(null);
        await fetchTailorsList();
    };
    
    useEffect(() => {
        // Runs exactly once. Goes straight to the async fetch. Zero synchronous state updates!
        // eslint-disable-next-line
        fetchTailorsList();
    }, []); 

    return { 
        tailors, 
        isLoading, 
        error, 
        refresh: handleManualRefresh // Exporting the safe manual refresh function
    };
}