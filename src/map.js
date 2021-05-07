import { Loader } from '@googlemaps/js-api-loader';

/*
 inspired by:
 https://developers.google.com/maps/documentation/javascript/examples/programmatic-load-button#maps_programmatic_load_button-javascript 
 */
 function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("map").style.marginLeft = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0px";
  document.getElementById("map").style.marginLeft= "0px";
}


const creatWindowContent = (location) => {
  let html;
  const prefix = location.bestPhoto.prefix;
  const suffix = location.bestPhoto.suffix;
  const url = `${prefix}300x150${suffix}`;

  html = `<img src = "${url}" alt = "a pretty photo">
  <p>${location.title}</p>`;

  if (location?.contact?.formattedPhone) {
    html += `<p>${location.contact.formattedPhone}</p>`;
  }

  if(location?.location?.formattedAddress) {
    html += `<p>${location.location.formattedAddress[0]}</p>`;
    html += `<p>${location.location.formattedAddress[1]}</p>`;
    html += `<p>${location.location.formattedAddress[2]}</p>`;
  }

  if(location?.defaultHours?.timeframes) {
    html += `<p>${location.defaultHours.timeframes[0].days}</p>`;
    for (let i = 0; i < location.defaultHours.timeframes[0].open.length; i++) {
      html += `<p>${location.defaultHours.timeframes[0].open[i].renderedTime}</p>`;
    }
    
  }
  
  return html;
};

const mapInit = (apiKey, locations) => {
  const menu = document.querySelector('.menu');
  
  const close = document.querySelector('.closebtn');
  const open = document.querySelector('#open');
  close.addEventListener('click', closeNav);
  open.addEventListener('click', openNav);

  // make map 
  let map;
  // const center = { lat: 41.90476224706472, lng: 12.49822074385094 };
  const center = { lat: 38.747935611941074, lng: -98.54793617885777 };
  const zoom = 4;
  const mapID = 'a6ea77d474c830a3';

  const loader = new Loader({
    apiKey: apiKey,
    version: 'weekly',
  });

  const wrapper = document.getElementById('wrapper');

  // Use static image instead of static map to reduce API call cost

  wrapper.style.backgroundImage = `url(https://images.unsplash.com/photo-1618020298919-50f9d16f67b8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80)`;

  wrapper.addEventListener('click', () => {
    menu.style.display = 'block';
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
        // styles: styles,
        mapId: mapID,
      };

      map = new google.maps.Map(document.getElementById('map'), mapOptions);

      // Put additional map google code here
      // Put markers on the map and assign an infowindow to
      // each
      const infowindow = new google.maps.InfoWindow({});
      const ul = document.querySelector('#list');

      locations.forEach((location) => {
        const marker = new google.maps.Marker({
          map,
          animation: google.maps.Animation.DROP,
          position: location.latlng,
        });
        marker.addListener('click', toggleBounce);

        function toggleBounce() {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(() => {
            marker.setAnimation(null);
          }, 3000);
        }

        marker.addListener('click', () => {
          infowindow.setContent(creatWindowContent(location));
          infowindow.open(map, marker);
        });

        
        const li = document.createElement('li');
        li.innerText = location.title;
        ul.appendChild(li);

        li.addEventListener('click', () => {
          infowindow.setContent(creatWindowContent(location));
          infowindow.open(map, marker);
        });
        

      });
    });
  });
};

export { mapInit };