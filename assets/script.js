// OpenWeather Map API key and base URL
const apiKey = '44f325ec07535190d0788a66415fe58d';
const apiUrl = 'https://api.openweathermap.org/data/2.5';

// DOM elements
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const currentWeatherContainer = document.getElementById('currentWeather');
const forecastContainer = document.getElementById('forecast-container');
const historyList = document.getElementById('historyList');

// Array to store search history
let searchHistory = [];

// Function to fetch weather data for a city
async function getWeatherData(city) {
  try {

    // Current weather data
    const currentWeatherResponse = await fetch(`${apiUrl}/weather?q=${city}&appid=${apiKey}&units=imperial`);
    const currentWeatherData = await currentWeatherResponse.json();

    // 5 day forecast data
    const forecastResponse = await fetch(`${apiUrl}/forecast?q=${city}&appid=${apiKey}&units=imperial`);
    const forecastData = await forecastResponse.json();

    // Return object containing weather and forecast data
    return { current: currentWeatherData, forecast: forecastData.list };
  } catch (error) {
    // Error screen
    console.error('Error fetching weather data:', error);
    return null;
  }
}

// Current weather display
function displayCurrentWeather(weatherData) {
  currentWeatherContainer.innerHTML = '';

  const { name, main, weather, wind, dt } = weatherData;

  // Date and time format
  const date = new Date(dt * 1000);
  const dateString = date.toLocaleDateString();
  const timeString = date.toLocaleTimeString();

  // Update html with current weather
  currentWeatherContainer.innerHTML = `
    <h2>${name} - ${dateString} ${timeString}</h2>
    <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="">

    <p>Temperature: ${main.temp}°F</p>
    <p>Humidity: ${main.humidity}%</p>
    <p>Wind Speed: ${wind.speed} mph</p>
    <p>Weather: ${weather[0].description}</p>
  `;
}

// 5 day forecast display
function displayForecast(forecastData) {
  forecastContainer.innerHTML = '';

  for (let i = 0; i < forecastData.length; i += 8) {
    const entry = forecastData[i];

    const card = document.createElement('div');
    card.classList.add('card');

    const date = new Date(entry.dt * 1000);
    const dateString = date.toLocaleDateString();
    const timeString = date.toLocaleTimeString();

    // Update html forecast info
    card.innerHTML = `
      <h2>${dateString} ${timeString}</h2>
      <img src="https://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png" alt="">

      <p>Temperature: ${entry.main.temp}°F</p>
      <p>Humidity: ${entry.main.humidity}%</p>
      <p>Wind Speed: ${entry.wind.speed} mph</p>
      <p>Weather: ${entry.weather[0].description}</p>
    `;

    forecastContainer.appendChild(card);
  }
}

function displaySearchHistory() {
  historyList.innerHTML = '';
  searchHistory.forEach(city => {
    const listItem = document.createElement('li');
    listItem.textContent = city;
    listItem.addEventListener('click', () => {
      cityInput.value = city;
      searchForm.dispatchEvent(new Event('submit'));
    });
    historyList.appendChild(listItem);
  });
}

searchForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  const city = cityInput.value.trim();

  if (city) {
    const weatherData = await getWeatherData(city);

    if (weatherData) {
      displayCurrentWeather(weatherData.current);
      displayForecast(weatherData.forecast);
      if (!searchHistory.includes(city)) {
        searchHistory.unshift(city);
        displaySearchHistory();
      }
    } else {
      alert('Error fetching weather data.');
    }

    cityInput.value = '';
  }
});
