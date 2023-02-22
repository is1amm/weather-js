import conditions from "./conditions.js";

const apiKey = '4270df6b352e4dd5963132625231002';

const header = document.querySelector(".header");
const form = document.querySelector("#form");
const input = document.querySelector("#inputCity");

function removeCard() {
  const prevCard = document.querySelector(".card");
  if (prevCard) prevCard.remove();
}

function showError(errorMessage) {
  const errorCard = document.createElement('div');
  errorCard.classList.add('card');
  errorCard.textContent = errorMessage;
  header.insertAdjacentElement('afterend', errorCard);
}

function showCard({ name, country, temp, condition, imgPath }) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <h2 class="card-city">${name}<sup>${country}</sup></h2>
    <div class="card-weather">
      <div class="card-value">${temp}</div>
      <img class="card-img" src="${imgPath}" alt="WeatherImg">
    </div>
    <h3 class="card-description">${condition}</h3>
  `;
  header.insertAdjacentElement('afterend', card);
}

async function getWeather(city) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
  let response = await fetch(url);
  const data = await response.json();
  return data;
}

form.onsubmit = async function (e) {
  e.preventDefault();
  let city = input.value.trim()

  let data = await getWeather(city)

  if (data.error) {
    removeCard();
    showError(data.error.message);
  } else {
    removeCard();

    const info = conditions.find((obj) => obj.code === data.current.condition.code);
    const filePath = './img/' + (data.current.is_day ? 'day' : 'night') + '/';
    const fileName = (data.current.is_day ? info.day : info.night) + '.png';
    const imgPath = filePath + fileName;

    const weatherData = {
      name: data.location.name,
      country: data.location.country,
      temp: data.current.temp_c,
      condition: data.current.is_day ? info.languages[23]['day_text'] : info.languages[23]['night_text'],
      imgPath,
    };

    showCard(weatherData);
  }
};