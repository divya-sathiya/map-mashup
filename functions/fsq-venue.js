const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { query } = JSON.parse(event.body);

  const CLIENT_ID = process.env.FSQ_CLIENT_ID;
  const CLIENT_SECRET = process.env.FSQ_CLIENT_SECRET;

  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  console.log(query);

  const apiSearch = `https://api.foursquare.com/v2/venues/${query}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20190425`;


  // 

  console.log(apiSearch)

  const locationData = await fetch( apiSearch,requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const data = JSON.parse(result);
      console.log(data.response);
      return data;
    }
      
    )
    .catch((error) => console.log('error', error));
  return {
    statusCode: 200,
    body: JSON.stringify(locationData),
  };
};
