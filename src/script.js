async function fetchWeather() {
    let searchInput = document.getElementById("search").value;
    const weatherDataSection = document.getElementById("weather-data");
    const forecast = document.getElementById("forecast");
    const forecastContainer = document.getElementById("forecast-container");
    weatherDataSection.style.display = "block";
    forecast.style.display = "block"
    const apiKey = "";


    if (searchInput.trim() === "") {
        weatherDataSection.innerHTML = `
        <div>
            <h2>Empty Input!</h2>
            <p>Pleas try again with a valid <u>city name</u>.</p>
        </div>
        `;
        return;
    }

    async function getLonAndLat() {
        const countryCode = 56;
        const geoCodeURL = `http://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")},${countryCode}&appid=${apiKey}`;
        const response = await fetch(geoCodeURL);
        
        if(!response.ok) {
            console.log(`Bad response! ${response.status}`)
            return;
        }

        const data = await response.json();

        if(data.length === 0){
            console.log("Something went wrong here.");
            weatherDataSection.innerHTML = `
            <div>
                <h2>Invalid Input: "${searchInput}"</h2>
                <p>Please try again with a valid <u>city name</u>.</p>
            </div>
            `;
            return;
        } else {
            return data[0];
        }

    }

    async function getWeatherData(lon, lat) {
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const response = await fetch(weatherURL);
        if(!response.ok){
            console.log(`Bad response! ${response.status}`);
            return;
        }

        const data = await response.json();
        weatherDataSection.style.display = "flex";
        weatherDataSection.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100">
        <div>
            <h2>${data.name}</h2>
            <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
            <p><strong>Description:</strong> ${data.weather[0].description}</p>
            <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
            <p><strong>Wind Speed:</strong> ${Math.round((data.wind.speed * 3.6) * 100)/100}km/h</p>
        </div>
        `;
    }

    async function getForecast(lon, lat) {
        const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=40&appid=${apiKey}`;
        const response = await fetch(forecastURL);
        if(!response.ok){
            console.log(`Bad response! ${response.status}`);
            return;
        }

        const data = await response.json();
        const daysArray = [data.list[0], data.list[8], data.list[16], data.list[24], data.list[32]]; //Get 5 days forecast for 15:00
        console.log(data);
        console.log(daysArray);
        forecastContainer.style.display = "flex";
        forecastContainer.innerHTML = ""
        for(let i=0; i<daysArray.length; i++){
            forecastContainer.innerHTML += `
            <div style="width: 20%; height: 20%;">
                <img src="https://openweathermap.org/img/wn/${daysArray[i].weather[0].icon}.png" alt="${daysArray[i].weather[0].description}" width="50" style="border-radius: 50%; background-color: lightskyblue;">
                <div>
                    <p><strong>Day:</strong> ${daysArray[i].dt_txt.split(" ")[0].split("-")[2]}</p>
                    <p><strong>Temp:</strong> ${Math.round(daysArray[i].main.temp - 273.15)}°C</p>
                    <p><strong>Descrip:</strong> ${daysArray[i].weather[0].description}</p>
                </div>
            </div>
            `;
        }

    }

    document.getElementById("search").value = "";
    const geocodeData = await getLonAndLat();
    getWeatherData(geocodeData.lon, geocodeData.lat);
    getForecast(geocodeData.lon, geocodeData.lat);
}