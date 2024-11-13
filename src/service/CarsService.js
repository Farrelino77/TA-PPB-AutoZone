// services/api.js
import axios from 'axios';

const BASE_URL = 'https://thecars-api-default-rtdb.asia-southeast1.firebasedatabase.app';

export const getCars = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/cars.json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching hotels:', error);
    throw error;
  }
};