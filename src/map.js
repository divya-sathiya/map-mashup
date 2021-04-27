import { Loader } from '@googlemaps/js-api-loader';

/*
 inspired by:
 https://developers.google.com/maps/documentation/javascript/examples/programmatic-load-button#maps_programmatic_load_button-javascript 
 */

const mapInit = (apiKey, styles, locations) => {
  let map;
  // const center = { lat: 41.90476224706472, lng: 12.49822074385094 };
  const center = { lat: 38.747935611941074, lng: -98.54793617885777 };
  const zoom = 4;

  const loader = new Loader({
    apiKey: apiKey,
    version: 'weekly',
  });

  const wrapper = document.getElementById('wrapper');

  // Use static image instead of static map to reduce API call cost

  wrapper.style.backgroundImage = `url(https://images.unsplash.com/photo-1524661135-423995f22d0b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)`;

  wrapper.addEventListener('click', () => {
    wrapper.remove();
    loader.load().then(() => {
      // mapOptions is an object that gets passed to the
      // google.maps.Map() method to create a new map
      //
      // There are two required options for every map: center and zoom.
      // Research what other options can be added and experiment
      // with them to change your map

      const mapOptions = {
        center: center,
        zoom: zoom,
        // put additional options here
        styles: styles, 
      };

      map = new google.maps.Map(document.getElementById('map'), mapOptions);

      // Put additional map google code here
      // Put markers on the map and assign an infowindow to
      // each
      const infowindow = new google.maps.InfoWindow({
      });

      locations.forEach(location => {
        const marker = new google.maps.Marker({
          map,
          animation: google.maps.Animation.DROP,
          position: location.latlng,
        });
        marker.addListener("click", toggleBounce);

        function toggleBounce() {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(() => {  
            marker.setAnimation(null);
          }, 3000);  
        }
        
        marker.addListener("click", () => {
          infowindow.setContent(location.title);
          infowindow.open(map, marker);
        });
      }); 
    });
  });
};

export { mapInit };
