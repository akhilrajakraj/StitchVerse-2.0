import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v1';

export const customerApi = {

    uploadmeasure: async (formDataPayLoad) => {
        const token = localStorage.getItem('access_token');
        if(!token){
            throw new Error("No Authentication credentials key detected inside the browser environment.");
        }

        const config = {
            headers: {
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`

            }
        };

        const response = await axios.post(`${BASE_URL}/accounts/measurements/`, formDataPayLoad, config);
        return response.data;
    },

    getProfile: async () => {
        const token = localStorage.getItem('access_token');
        const config = {
            headers:{
                'Authorization':`Bearer ${token}`
            }
        };

        const response = await axios.get('http://localhost:8000/api/v1/accounts/profile/', config);
        return response.data;
    },

    updateProfile: async(profileData) => {
        const token = localStorage.getItem('access_token');
        const config = {
            headers:{
                'Authorization':`Bearer ${token}`,
                'Content-Type':'application/json',
            }
        };
        const response = await axios.put('http://localhost:8000/api/v1/accounts/profile/', profileData, config);
        return response.data
    },

    getMeasurements: async() => {
        const token = localStorage.getItem('access_token');
        const config = {
            headers:{
                'Authorization':`Bearer ${token}`,
            }
        };
        const response = await axios.get('http://localhost:8000/api/v1/accounts/measurements/view/', config);
        return response.data;
    }


};

