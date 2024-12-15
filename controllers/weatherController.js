require('dotenv').config();
const axios = require('axios');


const getWeather = async (req, res) => {
    const lat = req.query.lat;
    const lon = req.query.lng;
    console.log("location", lat, lon);
    console.log("key", process.env.WEATHER_KEY);
    const weatherApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_KEY}&units=metric&lang=en`;
    try{
        const response = await axios.get(weatherApi);
        res.json(response.data);
    }catch(err){
        console.log('backend error', err);
    }
}

module.exports = {
    getWeather,
};