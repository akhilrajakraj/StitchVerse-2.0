import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v1';

export const tailorApi = {
    /**
     * Sends an authorized multipart FormData payload out to write a new design to the DB
     */
    uploadDesign: async (formDataPayload) => {
        // 1. Grab token safely from local storage registry
        const token = localStorage.getItem('access_token');
        
        if (!token) {
            throw new Error("No authentication credential keys detected inside the browser environment.");
        }

        const config = {
            headers: {
                // 🌟 FIX 1: Change Content-Type to multipart/form-data for image binaries!
                'Content-Type': 'multipart/form-data', 
                // 🌟 FIX 2: Seamlessly pass the unboxed JWT verification key string
                'Authorization': `Bearer ${token}` 
            }
        };

        // 🌟 FIX 3: Appended the critical trailing slash to align with models.py/urls.py!
        const response = await axios.post(`${BASE_URL}/designs/upload/`, formDataPayload, config);
        return response.data;
    }
};