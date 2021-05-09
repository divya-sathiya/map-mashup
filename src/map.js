import { Loader } from '@googlemaps/js-api-loader';

/*
 inspired by:
 https://developers.google.com/maps/documentation/javascript/examples/programmatic-load-button#maps_programmatic_load_button-javascript 
 */
// open button for the list
function openNav() {
  document.getElementById('mySidenav').style.width = '16rem';
  document.getElementById('map').style.marginLeft = '7rem';
}

// close button for the list
function closeNav() {
  document.getElementById('mySidenav').style.width = '0rem';
  document.getElementById('map').style.marginLeft = '0rem';
}

// get photo for each location
const creatWindowContent = (location) => {
  let html;
  const prefix = location.bestPhoto.prefix;
  const suffix = location.bestPhoto.suffix;
  const url = `${prefix}300x150${suffix}`;

  html = `<img src = "${url}" alt = "a pretty photo">
  <p>${location.title}</p>`;

  // get each location's phone number
  if (location?.contact?.formattedPhone) {
    html += `<p>${location.contact.formattedPhone}</p>`;
  }

  // get each location's address
  if (location?.location?.formattedAddress) {
    html += `<p>${location.location.formattedAddress[0]}</p>`;
    html += `<p>${location.location.formattedAddress[1]}</p>`;
    html += `<p>${location.location.formattedAddress[2]}</p>`;
  }

  // get each location's operating hours
  if (location?.defaultHours?.timeframes) {
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
  const center = { lat: 38.747935611941074, lng: -98.54793617885777 };
  const zoom = 4.2;
  const mapID = 'a6ea77d474c830a3';
  const icon = 'https://image.flaticon.com/icons/png/32/4388/4388647.png';

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

      const mapOptions = {
        center: center,
        zoom: zoom,
        mapId: mapID,
      };

      map = new google.maps.Map(document.getElementById('map'), mapOptions);
      const infowindow = new google.maps.InfoWindow({});
      const ul = document.querySelector('#list');

      // create marker for each location
      locations.forEach((location) => {
        const marker = new google.maps.Marker({
          map,
          icon: icon,
          animation: google.maps.Animation.DROP,
          position: location.latlng,
        });
        marker.addListener('click', toggleBounce);

        // make marker bounce
        function toggleBounce() {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(() => {
            marker.setAnimation(null);
          }, 3000);
        }

        // open location's info window when clicked
        marker.addListener('click', () => {
          infowindow.setContent(creatWindowContent(location));
          infowindow.open(map, marker);
        });

        // display each location's title in the list
        const li = document.createElement('li');
        li.innerText = location.title;
        ul.appendChild(li);

        // open the location's info window when the location is clicked on the list
        li.addEventListener('click', () => {
          infowindow.setContent(creatWindowContent(location));
          infowindow.open(map, marker);
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(() => {
            marker.setAnimation(null);
          }, 3000);
        });
      });
    });
  });
};

export { mapInit };
