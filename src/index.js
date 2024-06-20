const { weeksToDays } = require("date-fns");
import "./style.css";

//key=102fc52d92e04f80a2a142840232711
async function getWeather(city) {
	try {
		const response = await fetch(
			`http://api.weatherapi.com/v1/current.json?key=102fc52d92e04f80a2a142840232711&q=${city}`
		);
		const data = await response.json();
		return {
			country: data.location.country,
			city: data.location.name,
			localtime: data.location.localtime,
			condition: data.current.condition.icon,
			temp: data.current.temp_c,
			feelTemp: data.current.feelslike_c,
			humidity: data.current.humidity,
		};
	} catch (err) {
		console.log(err);
	}
}
function renderWeather(weather) {
	const container = document.querySelector("#container");

	const weatherDiv = document.querySelector("#weatherDiv");
	weatherDiv.innerHTML = "";

	weatherDiv.innerHTML = `
    Country: ${weather.country}<br>
    City: ${weather.city}<br>
    Time: ${weather.localtime}<br>
    <img src="${weather.condition}"><br>
    Temperature: ${weather.temp}<br>
    Humidity: ${weather.humidity}<br>
    `;
	container.appendChild(weatherDiv);
}

const button = document.querySelector("button");
const searchInput = document.querySelector("input");
button.addEventListener("click", async (e) => {
	e.preventDefault();
	const searchData = searchInput.value;
	console.log(searchData);

	const weather = await getWeather(searchData);
	console.log(weather);
	if (weather) {
		renderWeather(weather);
	}
});
