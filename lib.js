// lib.js
// reusable functions and icao data
/* ICAO format:
    "KMIA": {
            "icao": "KMIA",
            "iata": "MIA",
            "name": "Miami International Airport",
            "city": "Miami",
            "state": "Florida",
            "country": "US",
            "elevation": 8,
            "lat": 25.7931995392,
            "lon": -80.2906036377,
            "tz": "America\/New_York"
    }
*/
const axios = require('axios');

let lib = {
    //functions
    async getMetar(date, bbox) {
        const options = {
            method: 'GET',
            url: 'https://aviationweather.gov/api/data/metar',
            params: {ids: 'KMCI', format: 'json', taf: 'false', date: '2024-04-13T21:39:12Z'},
            headers: {'User-Agent': 'xwind.baseleg.io'}
        };
          
        axios.request(options).then(function (response) {
            //console.log(response.data);
        }).catch(function (error) {
            console.error(error);
        });
    },

    //calculates a bounding box between 2 coordinates, 50 miles wide
    calculateBBox(lat1, lon1, lat2, lon2) {
        const R = 3958.8; // Earth's radius in miles
        const width = 25; // Desired width in miles
        const angularDistance = width / R;
      
        // Calculate the bearing from the first point to the second point
        const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
        const bearing = Math.atan2(y, x); // in radians
        
        // Calculate the 2 coordinates 25 miles away
        const lat = (lat1 * Math.PI) / 180;
        const lon = (lon1 * Math.PI) / 180;

        const lat2_135 = Math.asin(Math.sin(lat) * Math.cos(angularDistance) + Math.cos(lat) * Math.sin(angularDistance) * Math.cos(bearing + (135 * Math.PI) / 180));
        const lon2_135 = lon + Math.atan2(Math.sin(bearing + (135 * Math.PI) / 180) * Math.sin(angularDistance) * Math.cos(lat), Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat2_135));

        const lat2_225 = Math.asin(Math.sin(lat) * Math.cos(angularDistance) + Math.cos(lat) * Math.sin(angularDistance) * Math.cos(bearing + (225 * Math.PI) / 180));
        const lon2_225 = lon1 + Math.atan2(Math.sin(bearing + (225 * Math.PI) / 180) * Math.sin(angularDistance) * Math.cos(lat), Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat2_225));

        // Convert back to degrees
        const newLat_135 = (lat2_135 * 180) / Math.PI;
        const newLon_135 = (lon2_135 * 180) / Math.PI;

        const newLat_225 = (lat2_225 * 180) / Math.PI;
        const newLon_225 = (lon2_225 * 180) / Math.PI;

      
        // Define the GeoJSON Polygon coordinates
        const polygonCoordinates = [
          [newLon_135, newLat_135],
          [newLon_225, newLat_225]
        ];

  // Create the GeoJSON Polygon object
  const geoJsonPolygon = {
    type: "Polygon",
    coordinates: [polygonCoordinates]
  };

  return geoJsonPolygon;
    }
}

//ingest ICAO data (only fires on startup)
const startTime = performance.now();
axios.request({
    method: 'GET',
    url: 'https://raw.githubusercontent.com/mwgg/Airports/master/airports.json',
}).then(function (response) {
    //console.log(response.data)
    lib.icao = response.data;
    const endTime = performance.now();
    console.info(`STATUS: ${Object.keys(lib.icao).length} ICAO airports ingested`)
    console.info(`STATUS: ICAO Ingest completed in ${endTime - startTime} ms`);
});

module.exports = lib;