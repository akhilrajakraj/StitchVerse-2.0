import { useState, useEffect } from 'react';
import { orderApi } from '../services/orderApi';

export function useStitchReqDetail(requestId) {
    const [requestData, setRequestData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!requestId) return; 

        const loadDetail = async () => {
            try {
                const data = await orderApi.fetchStitchRequestDetails(requestId);
                if(data.success) {
                    setRequestData(data.stitch_request);
                }
            } catch (err) {
                setError("Failed to load details.", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadDetail();
    }, [requestId]); 

    return { requestData, isLoading, error };
}