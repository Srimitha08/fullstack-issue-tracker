const axios = require('axios');

const fetchExternalDataset = async (credentials) => {
  try {
    const response = await axios.post(
      `${process.env.EXTERNAL_API_URL}/auth/login`,
      {
        username: credentials.username,
        password: credentials.password
      }
    );
    
    if (response.data.success && response.data.data.token) {
      const dataResponse = await axios.get(
        `${process.env.EXTERNAL_API_URL}/dataset`,
        {
          headers: {
            Authorization: `Bearer ${response.data.data.token}`
          }
        }
      );
      return dataResponse.data.data;
    }
  } catch (error) {
    console.error('Error fetching external dataset:', error.message);
    throw new Error('Failed to fetch external dataset');
  }
};

module.exports = {
  fetchExternalDataset
};
