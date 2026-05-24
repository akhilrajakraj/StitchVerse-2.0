import { useState, useEffect, useCallback } from 'react';
import { customerApi } from '../services/customerApi';

export function useExploreTailors() {
    const [tailors, setTailors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTailorsList = useCallback(async () => {
        try {
            const response = await customerApi.getActiveTailors();
            
            // 1. Pro tip for debugging: Always log the raw response first!
            console.log("Raw API Response:", response); 

            // 2. Handle the Axios wrapper if it exists
            const payload = response.data !== undefined ? response.data : response;

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
    }, []);

    useEffect(() => {
        fetchTailorsList();
    }, [fetchTailorsList]);

    return { tailors, isLoading, error, refresh: fetchTailorsList };
}