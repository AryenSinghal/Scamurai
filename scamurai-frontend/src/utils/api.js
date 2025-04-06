// Create api.js with the content from the api-utils artifact
import axios from 'axios';

// Base API URL - change this to your actual backend URL
const API_BASE_URL = 'http://localhost:5001';

// Function to scan content for scams
export const scanContent = async (content, url) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/scan`, {
      content,
      url
    });
    
    return response.data;
  } catch (error) {
    console.error('Error scanning content:', error);
    throw error;
  }
};

// Function to fetch training scenarios
export const fetchTrainingScenarios = async (contentType, originalContent) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/training-scenarios`, {
      contentType,
      originalContent
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching training scenarios:', error);
    throw error;
  }
};