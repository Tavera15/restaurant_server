const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 4000;
const mongoose = require("mongoose");

http = require("http");
require('dotenv').config();

const CategoryRoute     = require("./Routes/CategoryRoute");
const UserRoute         = require("./Routes/UserRoute");
const MenuItemRoute     = require("./Routes/MenuItemRoute");
const OrderRoute        = require("./Routes/OrderRoute");
const CartRoute         = require("./Routes/CartRoute");

const app = express();
app.use(express.json());
app.use(express.Router());
app.use(cors());
const server = http.createServer(app);

mongoose
    .connect(process.env.DATABASE_URI)
    .then(() => console.log("This shit finally work"))
    .catch(err => console.log(err));

app.use("/api/Category", CategoryRoute);
app.use("/api/User", UserRoute);
app.use("/api/MenuItem", MenuItemRoute);
app.use("/api/Order", OrderRoute);
app.use("/api/Cart", CartRoute);

app.get("/", (req, res) => {
    res.status(200).json({message: "Home Page"});
})

server.listen(port, () => {
    console.log("Server running on port " + port);
})
