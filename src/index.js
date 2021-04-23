import './style.css';
import { mapInit } from './map';

import styles from './map-styles.json5';
import locations from './locations.json5';

const getApi = async () => {
  const res = await fetch('/.netlify/functions/getapi')
    .then((res) => res)
    .catch((err) => {
      console.log(`Error in fetch: ${err}`);
    });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const API_KEY = await res.text();
  mapInit(API_KEY, styles, locations);
};

getApi();

/*
 inspired by:
 https://developers.google.com/maps/documentation/javascript/examples/programmatic-load-button#maps_programmatic_load_button-javascript 
 */
