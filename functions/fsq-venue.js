const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { locations } = JSON.parse(event.body);

  const CLIENT_ID = process.env.FSQ_CLIENT_ID;
  const CLIENT_SECRET = process.env.FSQ_CLIENT_SECRET;

  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  for (i=0; i < locations.length; i++) {
    const apiSearch = `https://api.foursquare.com/v2/venues/${locations[i].id}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20190425`;
    const locationData = await fetch( apiSearch,requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const data = JSON.parse(result);
      return data;
    }
      
    )
    .catch((err) =>{
      console.error('Error retreiving data from FourSquare');
      console.error(err);
      return {
        statusCode: err,
        body: JSON.stringify(locations),
      };
    });
    locations[i].contact = locationData.response.venue.contact;
    locations[i].location = locationData.response.venue.location;
    locations[i].bestPhoto = locationData.response.venue.bestPhoto;
  }


  return {
    statusCode: 200,
    body: JSON.stringify(locations),
  };
};
