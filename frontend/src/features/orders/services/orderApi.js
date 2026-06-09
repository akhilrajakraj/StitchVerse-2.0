import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v1';

export const orderApi = {

    /**
     * Fetches the "Recipe Book" of available garments and their required measurements.
     */
    fetchGarmentCategories: async () => {
        try {
            // We can fetch categories without a token if it's a public list, 
            // but if your Django view requires authentication, we include it here!
            const token = localStorage.getItem('access_token');
            const config = token ? {
                headers: { 'Authorization': `Bearer ${token}` }
            } : {};

            const response = await axios.get(`${BASE_URL}/orders/garment-categories/`, config);
            return response.data;
        } catch (error) {
            console.error("Error fetching garment categories:", error);
            throw error;
        }
    },

    /**
     * Submits the newly packaged form (including the dynamic JSON measurements).
     */
    submitStitchRequest: async (formData) => {
        const token = localStorage.getItem('access_token');
        if(!token){
            throw new Error("No Authentication credentials key detected.");
        }

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            }
        };

        const response = await axios.post(`${BASE_URL}/orders/stitchreq/`, formData, config);
        return response.data;
    },

    fetchMyStitchRequests: async () => {
        const token = localStorage.getItem('access_token');
        if(!token){
            throw new Error("No Authentication credentials key detected.");
        }

        const config = {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await axios.get(`${BASE_URL}/orders/my-stitchreq/`, config);
        return response.data;
    },

    fetchStitchRequestDetails: async (requestId) => {
        const token = localStorage.getItem('access_token');
        if(!token){
            throw new Error("No Authentication credentials key detected.");
        }

        const config = {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await axios.get(`${BASE_URL}/orders/stitchreq/${requestId}/`, config);
        return response.data;
    },

    fetchAllTailors: async () => {
        const token = localStorage.getItem('access_token');
        if(!token){
            throw new Error("No Authentication credentials key detected.");
        }

        const config = {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await axios.get(`${BASE_URL}/tailors/list/`, config);
        return response.data;
    }
};