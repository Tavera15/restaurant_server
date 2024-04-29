const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 4000;
const mongoose = require("mongoose");

http = require("http");
require('dotenv').config();

const CategoryRoute = require("./Routes/CategoryRoute");

const app = express();
const server = http.createServer(app);

mongoose
    .connect(process.env.DATABASE_URI)
    .then(() => console.log("This shit finally work"))
    .catch(err => console.log(err));


app.use("/api/category", CategoryRoute);

app.get("/", (req, res) => {
    res.status(200).json({message: "Home Page"});
})

server.listen(port, () => {
    console.log("Server running on port " + port);
})
