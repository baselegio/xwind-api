// lib.js
// reusable functions
const axios = require('axios');

let icao;

//ingest ICAO data (only fires on startup)
const startTime = performance.now();
axios.request({
    method: 'GET',
    url: 'https://raw.githubusercontent.com/mwgg/Airports/master/airports.json',
}).then(function (response) {
    //console.log(response.data)
    icao = response.data;
    const endTime = performance.now();
    console.info(`STATUS: ${Object.keys(icao).length} ICAO airports ingested`)
    console.info(`STATUS: ICAO Ingest completed in ${endTime - startTime} ms`);
});

lib = {
    //icao data
    icao: icao,
    //functions
    async getMetar(date, bbox) {
        const options = {
            method: 'GET',
            url: 'https://aviationweather.gov/api/data/metar',
            params: {ids: 'KMCI', format: 'json', taf: 'false', date: '2024-04-13T21:39:12Z'},
            headers: {'User-Agent': 'xwind.baseleg.io'}
        };
          
        axios.request(options).then(function (response) {
            console.log(response.data);
        }).catch(function (error) {
            console.error(error);
        });
    }
}

module.exports = lib;