const apiKey = '44f325ec07535190d0788a66415fe58d';
const apiUrl = 'https://api.openweathermap.org/data/2.5';

const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const currentWeatherContainer = document.getElementById('currentWeather');
const forecastContainer = document.getElementById('forecast-container');
const historyList = document.getElementById('historyList');

let searchHistory = [];

async function getWeatherData(city) {
  try {
    const currentWeatherResponse = await fetch(`${apiUrl}/weather?q=${city}&appid=${apiKey}&units=imperial`);
    const currentWeatherData = await currentWeatherResponse.json();

    const forecastResponse = await fetch(`${apiUrl}/forecast?q=${city}&appid=${apiKey}&units=imperial`);
    const forecastData = await forecastResponse.json();


    return { current: currentWeatherData, forecast: forecastData.list };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

function displayCurrentWeather(weatherData) {
  currentWeatherContainer.innerHTML = '';

  const { name, main, weather, wind, dt } = weatherData;

  const date = new Date(dt * 1000);
  const dateString = date.toLocaleDateString();
  const timeString = date.toLocaleTimeString();

  currentWeatherContainer.innerHTML = `
    <h2>${name} - ${dateString} ${timeString}</h2>
    <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="">

    <p>Temperature: ${main.temp}°F</p>
    <p>Humidity: ${main.humidity}%</p>
    <p>Wind Speed: ${wind.speed} mph</p>
    <p>Weather: ${weather[0].description}</p>
  `;
}

function displayForecast(forecastData) {
  forecastContainer.innerHTML = '';

  for (let i = 0; i < forecastData.length; i += 8) {
    const entry = forecastData[i];

    const card = document.createElement('div');
    card.classList.add('card');

    const date = new Date(entry.dt * 1000);
    const dateString = date.toLocaleDateString();
    const timeString = date.toLocaleTimeString();

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
