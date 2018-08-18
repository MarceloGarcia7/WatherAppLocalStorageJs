var mainData;
var severalCityData;
var filterByToday = [];
var listByDay = [];
var paramCity = [];

var mainCity = "https://api.openweathermap.org/data/2.5/forecast?q=";
var mainCity2 = "&lang=en&units=metric&APPID=f68585383622f70889d24366e064123f";

var severalCity = "https://api.openweathermap.org/data/2.5/group?id=";
var severalCity2 = "&lang=en&units=metric&APPID=f68585383622f70889d24366e064123f";

var city = "https://api.openweathermap.org/data/2.5/forecast?q=barcelona,es&lang=en&units=metric&APPID=f68585383622f70889d24366e064123f";

var myBtnSearch = document.getElementById("myBtnSearch").addEventListener("click", addCity);

startForecast(city);

forecastCity = {}

if (localStorage.getItem('items')) {
  forecastCity = JSON.parse(localStorage.getItem('items'));
} else {
  forecastCity = {};
}

var app = new Vue({
  el: '#app',
  data: {
    forecast: [],
    severalCity: [],
    filterByToday: [],
    filterByDay: [],
    forecastCity: []

  },
  methods: {
    selectCity: function (name, country) {

      console.log("vue-- " + name, country);
      selectCity(name, country);
    },
    deleteCity: function (cityId) {

      console.log("vue--DEL " + cityId);
      deleteCity(cityId);
    }
  }
});



function startForecast(data) {
  fetch(data, {
    method: "GET",

  }).then(function (response) {

    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  }).then(function (json) {
    console.log(json);
    
    if (json.cnt > 8) {
      mainData = json;
      data = json;

    } else {
      severalCityData = json.list;
      app.severalCity = severalCityData;
      severalJsonCity(severalCityData);
    }

    if (mainData["cod"] == "404") {
      alert(mainData["message"]);
    } else {
      app.forecast = mainData;
      app.forecast.list[0].weather[0].iconima = "http://openweathermap.org/img/w/" + app.forecast.list[0].weather[0].icon + ".png";

      forecastCity[mainData.city.name] = mainData.city.id;
      localStorage.setItem("items", JSON.stringify(forecastCity));
      forecastCity = JSON.parse(localStorage.getItem("items"));

      createTodayData(mainData);

    }
   
  }).catch(function (error) {
    console.log("Request failed: " + error.message);
  });
}


app.severalCity = severalCityData;
app.forecastCity = forecastCity;
app.filterByToday = filterByToday;
app.filterByDay = listByDay;
// ----------LLAMAR LAS FUNCIONES --------------------


function createTodayData(mainData) {
  filterByToday.splice(0);

  var dte = mainData.list[0].dt;
  var event = new Date(dte * 1000);
  var today = new Date(event + 'GMT+1');
  var UTCstring = today.toUTCString();

  console.log(mainData.list[0].dt_txt);
  console.log(UTCstring);
  console.log(mainData.city.name);


  for (var i = 0; i < mainData.list.length - 15; i++) {

    mainData.list[i].weather[0].iconima = "http://openweathermap.org/img/w/" + mainData.list[i].weather[0].icon + ".png";
    var jsonDate = mainData.list[i].dt_txt;
    var eventDate = new Date(jsonDate);
    var optionDate = {
      weekday: 'short',
      //year: 'numeric',
      //month: 'short',
      day: 'numeric'
    };
    var optionTime = {
      hour: 'numeric',
      minute: 'numeric'
    };
    var nuevaDate = eventDate.toLocaleDateString('es-GB', optionDate);
    var newTime = eventDate.toLocaleTimeString('es-GB', optionTime);
    mainData.list[i].newDate = nuevaDate;
    //mainData.list[i].newTime = newTime;
    
    var dte = mainData.list[i].dt;
    var event = new Date(dte * 1000);
    var today = new Date(event + 'GMT+1');
    var UTCstring = today.toUTCString();
    var timeUTC = UTCstring.slice(17,22)
    mainData.list[i].utcDate = UTCstring;
    mainData.list[i].newTime = timeUTC;

    filterByToday.push(mainData.list[i]);
  }
  filterPorDay();
}

function filterPorDay() {

  listByDay.splice(0);
  //var date = mainData.list[0].dt_txt.slice(13,16);
  var dateToCompare = "15:00";
  //console.log(date);

  for (var j = 0; j < mainData.list.length; j++) {

    if (mainData.list[j].dt_txt.includes(dateToCompare)) {
      //console.log(mainData.list[j].dt_txt);
      //console.log(mainData.list[j].main.temp + "º");

      mainData.list[j].weather[0].iconima = "http://openweathermap.org/img/w/" + mainData.list[j].weather[0].icon + ".png";

      var jsonDate = mainData.list[j]["dt_txt"];
      var d = new Date(jsonDate);
      var optionDate = {
        weekday: 'long',
        //month: 'short',
        //day: 'numeric'
      };
      var optionDate2 = {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      };
      var nuevaDate = d.toLocaleDateString('en-GB', optionDate).toUpperCase();
      var nuevaDate2 = d.toLocaleDateString('en-GB', optionDate2);
      mainData.list[j].newDate = nuevaDate;
      mainData.list[j].newDate2 = nuevaDate2;

      listByDay.push(mainData.list[j]);
    }
  }
  console.log(listByDay);

}




function severalJsonCity(mainData) {

  for (var i = 0; i < mainData.length; i++) {

    mainData[i].weather[0].iconima = "http://openweathermap.org/img/w/" + mainData[i].weather[0].icon + ".png";
  }
}


function selectCity(item, country) {

  console.log(country);
  console.log(country == null);
  
  document.getElementById("contenedorForecast").style.display = "block";
  document.getElementById("mainContenCity").style.display = "none";
  
  if (country != null){
  city = mainCity + item + "," + country + mainCity2;
  }else{
  city = mainCity + item + mainCity2;
}
  console.log(city);
  startForecast(city);
}


function addCity() {

  var selectedCity = document.getElementById("nameCity").value;
  console.log(selectedCity);
  console.log(forecastCity);
  selectCity(selectedCity);
}


function openCityWindow() {

  paramCity = [];

  for (var value in forecastCity) {
    console.log(forecastCity[value] + ' ' + value);
    paramCity.push(forecastCity[value]);
  }
  console.log(paramCity);

  var selectSeve = severalCity + paramCity + severalCity2;

  console.log(selectSeve);

  startForecast(selectSeve);

  document.getElementById("nameCity").value = "";
  document.getElementById("contenedorForecast").style.display = "none";
  document.getElementById("mainContenCity").style.display = "flex";
  
}

function deleteCity(cityId) {

  console.log(cityId);

  for (var value in forecastCity) {
    console.log(forecastCity[value]);
    console.log(value);
    if (forecastCity[value] == cityId) {
      delete forecastCity[value];
    }
  }

  console.log(forecastCity);
  localStorage.setItem("items", JSON.stringify(forecastCity));
  openCityWindow();
}
