import { useState, useEffect } from 'react';
import { orderApi } from '../services/orderApi'; 

export function useCustomRequest() {
    // 1. The Manager's Catalog: Holding the fetched dresses
    const [categories, setCategories] = useState([]);
    const [isFetchingCategories, setIsFetchingCategories] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    // 2. The Manager's Clipboard: Tracking the submission
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    // 3. The Morning Routine: Fetch the dresses as soon as the manager clocks in
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await orderApi.fetchGarmentCategories();
                // We check for data.data because your Django view wraps the list in a 'data' object
                if (data.success) {
                    setCategories(data.categories);
                }
            } catch (err) {
                console.error("Failed to load catalog:", err);
                setFetchError("Failed to load the outfit catalog. Please refresh the page.");
            } finally {
                setIsFetchingCategories(false);
            }
        };

        loadCategories();
    }, []); // The empty array [] means this only runs ONCE when the page loads!

    // 4. The Action: Submitting the final order
    const submitRequest = async (formData) => {
        setIsSubmitting(true);
        setSubmitError(null);
        setIsSuccess(false);

        try {
            const response = await orderApi.submitStitchRequest(formData);
            setIsSuccess(true);
            return response; 
        } catch (err) {
            console.error("Submission failed:", err);
            const errorMessage = err.response?.data?.message || "Failed to submit request. Please try again.";
            setSubmitError(errorMessage);
            throw err; 
        } finally {
            setIsSubmitting(false);
        }
    };

    // 5. Hand everything back to the UI component
    return { 
        categories,
        isFetchingCategories,
        fetchError,
        submitRequest, 
        isSubmitting, 
        submitError, 
        isSuccess 
    };
}