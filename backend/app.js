const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();
const router = require('./routers/index'); // Ensure this path is correct based on your project structure

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Backend MangaKit')
})

app.use("/", router); // Use the router for all routes

module.exports = app;
