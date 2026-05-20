import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v1';

export const designCatApi = {
    /**
     * Fetches the true dynamic category taxonomy tree directly from the Django database.
     * This reads the records populated by your custom database seeder script.
     */
    getLiveCategories: async () => {
        try {
            // Appends the critical trailing slash required by Django's router engine
            const response = await axios.get(`${BASE_URL}/designs/categories/`);
            return response.data; // Returns the clean JSON array list of categories
        } catch (error) {
            console.error("Error fetching global platform design categories:", error);
            throw error;
        }
    }
};