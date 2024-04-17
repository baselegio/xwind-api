// index.js
// contains the api endpoint

const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const lib = require('./lib');

//handle posts
app.use(bodyParser.json());

/**
 * Base Path
 */
app.get("/", (req, res, next) => {
    return res.status(200).json({
      message: "All Good!",
    });
});




app.post("/", async (req, res, next) => {
    const date = req.body.date ? Date.parse(req.body.date) : new Date();
    //date validation
    if (!(date instanceof Date)) {
        return res.status(400).json({
            error: "Invalid Date",
        });
    }
    //airport codes
    if (!req.body.airports) {
        return res.status(400).json({
            error: "No Airports Specified",
        });
    }
    //check to make sure each airport is an ICAO
    for (airport of req.body.airports) {
        if (!lib.icao[airport]) {
            return res.status(400).json({
                error: "Invalid Airport: " + airport,
            });
        }
    }

    //draw a bounding box between the points, and 50 miles in width
    coords1 = [lib.icao[req.body.airports[0]].lat, lib.icao[req.body.airports[0]].lon];
    coords2 = [lib.icao[req.body.airports[1]].lat, lib.icao[req.body.airports[1]].lon];

    return res.json(lib.calculateBBox(coords1[0], coords1[1], coords2[0], coords2[1]));

    
    try {
        await lib.getMetar(date.toISOString());
    } catch (err) {
        return next(err);
    }
    

    return res.status(200).json({
      message: "All good!",
    });
});


//error handling
app.use(function (err, req, res, next) {
    console.error(err);
    return res.status(500).send({ error: 'Internal Server Error' });
});
app.listen(port, () => console.info(`STATUS: xwind api listening on port ${port}`))