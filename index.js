const express = require("express");
const axios = require("axios");
const app = express();
const dotenv = require("dotenv");
require('dotenv').config();

// Set the view engine to Pug
app.set("view engine", "pug");

// Serve the public folder as static files
app.use(express.static("public"));

// Render the index template with default values for weather and error
app.get("/", (req, res) => {
  res.render("index", { weather: null, newsData: null, error: null });
});

// Handle the /weather route
app.get("/weather", async (req, res) => {
    // Get the city from the query parameters
    const city = req.query.city;
    const apiKey = process.env.WEATHER_API_KEY;
  
    // Fetch weather data from the OpenWeatherMap API
    const openWeatherMapUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    let weather;
    let error = null;
    try {
      const weatherResponse = await axios.get(openWeatherMapUrl);
      weather = weatherResponse.data;
    } catch (weatherError) {
      weather = null;
    //   error = "Error fetching weather data.";
    }
  
    // Fetch data from another API (example.com in this case)
    const newsApiUrl = `https://gnews.io/api/v4/top-headlines?category=world&lang=en&max=10&apikey=19f11ec716629c12552abecf971d4380`;
    let newsData;
    try {
      const newsDataResponse = await axios.get(newsApiUrl);
      newsData = newsDataResponse.data;
    } catch (newsDataError) {
      newsData = null;
      error = "Error fetching data news data.";
    }
  
    // Render the index template with the weather data, news data, and error message
    res.render("weather", { weather, newsData, error });
  });
  

// Start the server and listen on port 3000 or the value of the PORT environment variable
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
