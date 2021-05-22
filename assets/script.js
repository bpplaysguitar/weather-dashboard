let searchBtn = $("#search-btn");
let searchInput = $("#search-input");
let historyBtn = $(".history-btn");
let city = document.getElementById("city");
let date = document.getElementById("date");
let temp = $("#temp");
let wind = $("#wind");
let humidity = $("#humidity");
let uvIndex = $("#uv-index");
let tempSpan = document.getElementById("temp-span")
let windSpan = document.getElementById("wind-span")
let humiditySpan = document.getElementById("humidity-span")
let uvSpan = document.getElementById("uv-span")
let longitude;
let latitude;
let DateTime = luxon.DateTime;
let today = DateTime.local();
let daySuffix;
let dayToString = today.day.toString();
let weatherboxHigh = document.querySelectorAll(".weather-box-high");
let weatherboxLow = document.querySelectorAll(".weather-box-low");
let weatherboxWind = document.querySelectorAll(".weather-box-wind");
let weatherboxHumidity = document.querySelectorAll(".weather-box-humidity");
let weatherboxDate = document.querySelectorAll(".weather-box-date");

// determine which suffix to use on day
if ((dayToString.endsWith("1")) && (!dayToString.endsWith("11"))) {
  daySuffix = "st";
} else if ((dayToString.endsWith("2") && (!dayToString.endsWith("12")))) {
  daySuffix = "nd";
} else if ((dayToString.endsWith("3")) && (!dayToString.endsWith("13"))) {
  daySuffix = "rd";
} else {
  daySuffix = "th";
}

// format the date
dateDisplay =
  "- " + today.weekdayLong + ", " + today.monthLong + " " + today.day + daySuffix + ", " + today.year;


function getWeather(event) {
  event.preventDefault();
  getWeatherByCityName();
  displayDates();
console.log("Search button has been clicked!");
}


function displayDates() {

  
  // for (let n = 0; n < 5 ; n++) {
  //   weatherboxDate[n].textContent = today.plus({days: n+1}).weekdayLong + ", " + today.plus({days: n+1}).monthLong + " " + today.plus({days: n+1}).day + ", " + today.plus({days: n+1}).year;;
  // } return;
  for (let n = 0; n < 5 ; n++) {
    weatherboxDate[n].textContent = today.plus({days: n+1}).toFormat('D')
  } return;

}

function getWeatherByCityName() {
  let citySearched = document.getElementById("search-input").value;

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${citySearched}&units=imperial&appid=${apiKey}`)
  .then(response => response.json())
  .then(dataWeather => {
      // saveToLocalStorage(data)
      console.log("dataWeather", dataWeather)
      displayWeatherInfo(dataWeather);
      getLonLatFromCity(dataWeather);
      getWeatherByLonLat();
    })
  // .catch(errWeather => console.log("wrong city name!", errWeather))
}

function getWeatherByLonLat() {
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`)
  .then(responseLL => responseLL.json())
  .then(dataOneCall => {
      // saveToLocalStorage(data)
      console.log("dataOneCall", dataOneCall)
      displayOneCallInfo(dataOneCall);
  })
  // .catch(errOneCall => console.log("Incorrect Lat/Lon", errOneCall))
}

// use weather api to display info 
function displayWeatherInfo(displayData) {
  tempSpan.textContent = displayData.main.temp + " °F";
  windSpan.textContent = displayData.wind.speed + " MPH";
  humiditySpan.textContent = displayData.main.humidity + " %";
  city.textContent = displayData.name;
  date.textContent = dateDisplay;
}
// use weather api to retrieve city's lon/lat and store into variables for use in onecall api fetch
function getLonLatFromCity(displayData) {
  longitude = displayData.coord.lon;
  latitude = displayData.coord.lat;
}
// use onecall api to display info
function displayOneCallInfo(DisplayOneCallData) {
  uvSpan.textContent = DisplayOneCallData.current.uvi;

  for (let i=0; i < 5; i++) {
    weatherboxHigh[i].textContent = DisplayOneCallData.daily[i].temp.max + " °F";
  }

  for (let j=0; j < 5; j++) {
    weatherboxLow[j].textContent = DisplayOneCallData.daily[j].temp.min + " °F";
  } 

  for (let k=0; k < 5; k++) {
    weatherboxWind[k].textContent = DisplayOneCallData.daily[k].wind_speed + " MPH";
  } 

  for (let l=0; l < 5; l++) {
    weatherboxHumidity[l].textContent = DisplayOneCallData.daily[l].humidity + " %";
    } 
  return;

  
}

// <!--TODO: UV INDEX COLORS BASED ON NUMBER -->

searchBtn.click(getWeather); 