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
    },

    getProfile: async () => {
        const token = localStorage.getItem('access_token');
        const config = {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await axios.get(`${BASE_URL}/tailors/profile/`, config);
        return response.data;
    },

    updateProfile: async (profileData) => {
        const token = localStorage.getItem('access_token');
        const config = {
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
        const response = await axios.put(`${BASE_URL}/tailors/profile/`, profileData, config);
        return response.data
    },

    getMyDesigns: async () => {
        const token = localStorage.getItem('access_token');
        const config = {
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
        const response = await axios.get(`${BASE_URL}/designs/portfolio/me/`, config);
        return response.data;
    },

    deleteDesign: async (design_id) => {
        const token = localStorage.getItem('access_token');
        const config = {
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
        const response = await axios.delete(`${BASE_URL}/designs/${design_id}/`, config);
        return response.data;
    }

};