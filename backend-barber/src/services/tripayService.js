const axios = require('axios');

const tripay = axios.create({
  baseURL: 'https://tripay.co.id/api-sandbox/',
  headers: {
    Authorization: `Bearer ${process.env.TRIPAY_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

exports.createTransaction = async (payload) => {
  const response = await tripay.post('/transaction/create', payload);
  return response.data;
};

exports.fetchTransactionDetail = async (reference) => {
  const response = await tripay.get('/transaction/detail', { params: { reference } });
  return response.data;
};
