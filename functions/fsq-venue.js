const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { locations } = JSON.parse(event.body);

  const CLIENT_ID = process.env.FSQ_CLIENT_ID;
  const CLIENT_SECRET = process.env.FSQ_CLIENT_SECRET;

  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  // Create a for loop that retrieves data from FourSquare
  // and returns the contact, location, and bestPhoto of the user's desired location (out of what is available on the map)
  for (i=0; i < locations.length; i++) {
    // apiSearch uses CLIENT_ID and CLIENT_SECRET in order to retrieve data from FourSquare
    const apiSearch = `https://api.foursquare.com/v2/venues/${locations[i].id}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20190425`;
    const locationData = await fetch( apiSearch,requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const data = JSON.parse(result);
      return data;
    }
      
    )
    // If an error occurs, return a message warning the user of the error
    .catch((err) =>{
      console.error('Error retreiving data from FourSquare');
      console.error(err);
      return {
        statusCode: err,
        body: JSON.stringify(locations),
      };
    });
    // Retrieve contact data (i.e: phone number)
    locations[i].contact = locationData.response.venue.contact;
    // Retrieve location data (i.e: address)
    locations[i].location = locationData.response.venue.location;
    // Retrieve bestPhoto data (most popular photo among tourists according to FourSquare)
    locations[i].bestPhoto = locationData.response.venue.bestPhoto;
  }


  return {
    statusCode: 200,
    body: JSON.stringify(locations),
  };
};
