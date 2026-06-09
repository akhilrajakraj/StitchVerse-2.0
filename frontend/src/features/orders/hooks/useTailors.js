import { useState, useEffect } from 'react';
import { orderApi } from '../services/orderApi';

export function useTailors() {
    const [tailors, setTailors] = useState([]);
    const [isLoadingTailors, setIsLoadingTailors] = useState(true);
    const [tailorError, setTailorError] = useState(null);

    useEffect(() => {
        const loadTailors = async () => {
            try {
                const data = await orderApi.fetchAllTailors();
                if (data.success) {
                    // Adjust this label depending on what your Django view actually returns!
                    setTailors(data.data || data.tailors || []); 
                }
            } catch (err) {
                console.error("Failed to load tailors:", err);
                setTailorError("Failed to load the tailor directory.");
            } finally {
                setIsLoadingTailors(false);
            }
        };

        loadTailors();
    }, []);

    return { tailors, isLoadingTailors, tailorError };
}