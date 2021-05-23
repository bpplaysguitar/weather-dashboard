let searchBtn = $("#search-btn");
let searchInput = document.getElementById("search-input");
let historyBtn = $(".history-btn");
let city = document.getElementById("city");
let date = document.getElementById("date");
let icon = document.getElementById("icon");
let temp = $("#temp");
let wind = $("#wind");
let humidity = $("#humidity");
let uvIndex = $("#uv-index");
let tempSpan = document.getElementById("temp-span");
let windSpan = document.getElementById("wind-span");
let humiditySpan = document.getElementById("humidity-span");
let uvSpan = document.getElementById("uv-span");
let iconSpan = document.getElementById("icon");
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
let weatherboxIcon = document.querySelectorAll(".weather-box-icon");

// determine which suffix to use on day
if (dayToString.endsWith("1") && !dayToString.endsWith("11")) {
  daySuffix = "st";
} else if (dayToString.endsWith("2") && !dayToString.endsWith("12")) {
  daySuffix = "nd";
} else if (dayToString.endsWith("3") && !dayToString.endsWith("13")) {
  daySuffix = "rd";
} else {
  daySuffix = "th";
}

// format the date
dateDisplay =
  "- " +
  today.weekdayLong +
  ", " +
  today.monthLong +
  " " +
  today.day +
  daySuffix +
  ", " +
  today.year;

function displayDates() {
  for (let n = 0; n < 5; n++) {
    weatherboxDate[n].textContent = today.plus({ days: n + 1 }).toFormat("D");
  }
  return;
}

function saveRecentSearches() {
  let recentSearches = JSON.parse(localStorage.getItem("recentSearches"));
  if (recentSearches === null) {
    recentSearches = [];
  }

  for (let hb = 0; hb < 8; hb++)
    historyBtn[hb].addEventListener("click", function () {
      searchInput.value = historyBtn[hb].textContent;
      let historyVar = historyBtn[hb].textContent;
      getWeatherByHistory(historyVar);
      return;
    });

  if (searchInput.value !== "") {
    recentSearches.unshift(searchInput.value);
    if (recentSearches.length > 8) {
      recentSearches.pop();
    }
  }

  localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
}

function renderRecentSearches() {
  let lastSearch = JSON.parse(localStorage.getItem("recentSearches"));
  if (lastSearch !== null) {
    historyBtn[0].textContent = lastSearch[0];
    historyBtn[1].textContent = lastSearch[1];
    historyBtn[2].textContent = lastSearch[2];
    historyBtn[3].textContent = lastSearch[3];
    historyBtn[4].textContent = lastSearch[4];
    historyBtn[5].textContent = lastSearch[5];
    historyBtn[6].textContent = lastSearch[6];
    historyBtn[7].textContent = lastSearch[7];
  } else {
    return;
  }
}
function getWeatherByHistory(history) {

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${history}&units=imperial&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((dataWeather) => {
      // saveToLocalStorage(data)
      console.log("dataWeather", dataWeather);
      displayWeatherInfo(dataWeather);
      getLonLatFromCity(dataWeather);
      getWeatherByLonLat();
    });
}

function getWeatherByCityName() {
  let citySearched = document.getElementById("search-input").value;

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${citySearched}&units=imperial&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((dataWeather) => {
      // saveToLocalStorage(data)
      console.log("dataWeather", dataWeather);
      displayWeatherInfo(dataWeather);
      getLonLatFromCity(dataWeather);
      getWeatherByLonLat();
    });

    if (citySearched === "") {
      alert("No city found. Enter a city name.");
      return;
    } 
}

function getWeatherByLonLat() {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`
  )
    .then((responseLL) => responseLL.json())
    .then((dataOneCall) => {
      console.log("dataOneCall", dataOneCall);
      displayOneCallInfo(dataOneCall);
    });
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
  iconSpan.innerHTML = "<img src=\'http://openweathermap.org/img/w/" + DisplayOneCallData.current.weather[0].icon + ".png'>";
  // change color based on UV Index 
  if (uvSpan.textContent < 3) {
  uvSpan.setAttribute("style", "background-color: green")} 
  else if ((uvSpan.textContent >= 3) && (uvSpan.textContent < 8)) {
    uvSpan.setAttribute("style", "background-color: yellow; color: black")
  } else {
    uvSpan.setAttribute("style", "background-color: orangered; color: white")
  }

  // fill 5-day weather boxes with data from the fetch
  for (let h = 0; h < 5; h++) {
    weatherboxIcon[h].innerHTML = "<img src=\'http://openweathermap.org/img/w/" + DisplayOneCallData.daily[h].weather[0].icon + ".png'>";
  }

  for (let i = 0; i < 5; i++) {
    weatherboxHigh[i].textContent =
      DisplayOneCallData.daily[i].temp.max + " °F";
  }

  for (let j = 0; j < 5; j++) {
    weatherboxLow[j].textContent = DisplayOneCallData.daily[j].temp.min + " °F";
  }

  for (let k = 0; k < 5; k++) {
    weatherboxWind[k].textContent =
      DisplayOneCallData.daily[k].wind_speed + " MPH";
  }

  for (let l = 0; l < 5; l++) {
    weatherboxHumidity[l].textContent =
      DisplayOneCallData.daily[l].humidity + " %";
  }
  return;
}

function getWeather() {
  getWeatherByCityName();
  displayDates();
}

localStorage.getItem("recentSearches");

// click search button to start 
searchBtn.click(getWeather);
searchBtn.click(function (event) {
  event.preventDefault();
  saveRecentSearches();
  renderRecentSearches();
});
