const axios = require('axios');

async function test() {
  try {
    const response = await axios.get('http://192.168.0.196:5001/api/products');
    console.log('Success!');
    console.log('Response structure:', Object.keys(response.data));
    console.log('Number of products:', response.data.data?.length || response.data.products?.length || 0);
    console.log('First product:', response.data.data?.[0]?.title || response.data.products?.[0]?.title);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();
