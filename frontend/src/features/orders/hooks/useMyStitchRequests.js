import { useState, useEffect } from 'react';
import { orderApi } from '../services/orderApi';

export function useMyStitchRequests() {
    // We start with an empty array [] because we expect a LIST of items
    const [requests, setRequests] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        const loadRequests = async () => {
            try {
                const data = await orderApi.fetchMyStitchRequests();
                if(data.success) {
                    setRequests(data.stitch_requests); // Store the array in state
                }
            } catch (err) {
                setFetchError("Failed to load your stitch requests.", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadRequests();
    }, []);

    return { requests, isLoading, fetchError };
}