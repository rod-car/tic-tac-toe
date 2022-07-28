const express = require("express");
const app = express();
const envConfig = require("dotenv").config();

const { PORT } = process.env;

app.use(express.static("public"));

app.get("/", (request, response) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    response.sendFile(__dirname + "/index.html");
});

const listener = app.listen(PORT, () => {
    console.log("Tic tac toe is listening on port " + listener.address().port);
});
