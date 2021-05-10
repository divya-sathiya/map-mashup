import './style.css';
import { mapInit } from './map';
import locations from './locations.json5';

// Create a function getApi that will be called to retrieve data
// The data will be from FourSquare and Google Maps API
const getApi = async () => {
  // res uses the Google Maps API to track the locations we want
  const res = await fetch('/.netlify/functions/getapi')
    .then((res) => res)
    .catch((err) => {
      console.log(`Error in fetch: ${err}`);
    });
  // Throw an error if a request for a location cannot be reached from Google Maps API
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  // Get access to Google Maps API
  const API_KEY = await res.text();

  // venueDetails uses FourSquare to get details of a desired location
  const venueDetails = await fetch('/.netlify/functions/fsq-venue', {
    method: 'POST',
    body: JSON.stringify({
      locations: locations,
    }),
  })
    .then((res) => res.json())
    // Catch an error and return a message in console if data form FourSquare cannot be retrieved
    .catch((err) =>{
      console.error('Error retreiving data from FourSquare')
      console.error(err)
    });
    // Print the details of the desired venue
    console.log({venueDetails});

  mapInit(API_KEY, venueDetails);
};

// Call the getApi function
getApi();

/*
 inspired by:
 https://developers.google.com/maps/documentation/javascript/examples/programmatic-load-button#maps_programmatic_load_button-javascript 
 */
