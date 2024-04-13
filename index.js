const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;


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

app.listen(port, () => console.log(`xwind api listening on port ${port}!`))