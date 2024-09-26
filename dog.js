// Initiatlizing block variables

let map;
let cardContainer = document.getElementById('results');
let service;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('search').addEventListener('click', () => {
        const postalCode = document.getElementById('postal-code').value;
        if (postalCode) {
            getLatLngFromPostalCode(postalCode);
        } else {
            alert('Please enter a postal code.');
        }
    });
});

// Get latitude and longitude from postal code
function getLatLngFromPostalCode(postalCode) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': postalCode }, (results, status) => {
        if (status === 'OK') {
            const location = results[0].geometry.location;
            initMap(location.lat(), location.lng());
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

// Initialize the map and set markers
function initMap(lat, lng) {
    const location = { lat: lat, lng: lng };

    map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 13
    });
    getResults(location);
}

// Get results for nearby parks
function getResults(location) {
    const userLocation = new google.maps.LatLng(location.lat, location.lng);
    const request = {
        location: userLocation,
        radius: '16000',
        type: ['park'],
        keyword: 'dog'
    };
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}

// Handle API results
function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        cardContainer.innerHTML = "";
        for (let i = 0; i < results.length; i++) {
            const place = results[i];
            const content = `<div>
                <h4>${place.name}</h4>
                <p>${place.vicinity}</p>
                <p>Rating: ${place.rating}</p>
            </div>`;

            const resultcard = document.createElement("div");
            resultcard.setAttribute("class", "card");
            resultcard.innerHTML = `
                <h3>${place.name}</h3>
                <p>${place.vicinity}</p>
                <p>Rating: ${place.rating ? place.rating : 'N/A'}</p>
            `;

            cardContainer.append(resultcard);

            const marker = new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: place.name,
            });

            const infowindow = new google.maps.InfoWindow({ content: content });
            groupInfoWindow(marker, map, infowindow, content);
        }
    }
}

// Show info window on marker click
function groupInfoWindow(marker, map, infowindow, html) {
    marker.addListener('click', function () {
        infowindow.setContent(html);
        infowindow.open(map, this);
    });
}
