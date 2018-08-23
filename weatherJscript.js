var mainData;
var severalCityData;
var filterByToday = [];
var listByDay = [];
var paramCity = [];

var bcn = "https://api.openweathermap.org/data/2.5/forecast?q=";
var bcn2 = "&lang=en&units=metric&APPID=f68585383622f70889d24366e064123f";

var severalCity = "https://api.openweathermap.org/data/2.5/group?id=";
var severalCity2 = "&lang=en&units=metric&APPID=f68585383622f70889d24366e064123f";

var city = "https://api.openweathermap.org/data/2.5/forecast?q=montevideo,uy&lang=en&units=metric&APPID=f68585383622f70889d24366e064123f";

var myBtnSearch = document.getElementById("myBtnSearch").addEventListener("click", addCity);

//startForecast(severalCity);
startForecast(city);

forecastCity = {
  /*Montgat: "montgat"
  Barcelona: "barcelona",
  Madrid: "madrid",
  Montevideo: "montevideo,uy",
  Vienna: "vienna",
  Linz: "linz",
  Praga: "prague",
  Brno: "brno",
  Vladislav: "vladislav,cz",
  London: "London",
  Paris: "paris",
  Rome: "roma",*/
}

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
      // add a new promise to the chain
      return response.json();
    }
    // signal a server error to the chain
    throw new Error(response.statusText);
  }).then(function (json) {
    // equals to .success in JQuery Ajax call
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

  var gmt = (mainData.city.coord.lon / 15).toFixed(0)
  console.log('GMT ' + gmt);
  if(gmt == -0){gmt = 0}
  
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
    var nuevaDate = eventDate.toLocaleDateString('en-GB', optionDate);
    var newTime = eventDate.toLocaleTimeString('es-GB', optionTime);
    //mainData.list[i].newDate = nuevaDate;
    //mainData.list[i].newTime = newTime;
    
    var dte = mainData.list[i].dt;
    var event = new Date(dte * 1000);
    var today = new Date(event + 'GMT+1');
    var UTCstring = today.toUTCString();
    var timeUTC = UTCstring.slice(17,22)
    //mainData.list[i].utcDate = UTCstring;
    //mainData.list[i].newTime = timeUTC;
    
    if(gmt >= 0){   
    var today2 = new Date(event +'GMT-'+gmt)
    //console.log(today2);
    }else{
      var today2 = new Date(event +'GMT+'+gmt.slice(1))
    //console.log(today2);
    }
    var UTCstring2 = today2.toUTCString();
   // console.log(UTCstring2.slice(17,22));
    
    mainData.list[i].newTime = UTCstring2.slice(17,22);
    mainData.list[i].utcDate = UTCstring2 + gmt;
    mainData.list[i].newDate = UTCstring2.slice(0,11);
    
    filterByToday.push(mainData.list[i]);
  }
  filterPorDay();
}

function filterPorDay() {

  listByDay.splice(0);
  //var date = mainData.list[0].dt_txt.slice(13,16);
  var dateToCompare = "15:00";
  var dateToCompare2 = "16:00";
  //console.log(date);

  for (var j = 0; j < mainData.list.length; j++) {

    if (mainData.list[j].dt_txt.includes(dateToCompare) || mainData.list[j].dt_txt.includes(dateToCompare2) ) {
      //console.log(mainData.list[j].dt_txt);
      //console.log(mainData.list[j].main.temp + "º");

      mainData.list[j].weather[0].iconima = "http://openweathermap.org/img/w/" + mainData.list[j].weather[0].icon + ".png";

      var jsonDate = mainData.list[j].dt_txt;
      var eventDate = new Date(jsonDate);
      var optionDateLong = {
        weekday: 'long',
        //month: 'short',
        //day: 'numeric'
      };
      var optionDateShort = {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      };
      var newDateLong = eventDate.toLocaleDateString('en-GB', optionDateLong).toUpperCase();
      var newDateShort = eventDate.toLocaleDateString('en-GB', optionDateShort);
      mainData.list[j].newDate = newDateLong;
      mainData.list[j].newDate2 = newDateShort;

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
  city = bcn + item + "," + country + bcn2;
  }else{
  city = bcn + item + bcn2;
}
  console.log(city);
  startForecast(city);
}


function addCity() {


 // document.getElementById('myModal').style.display = "none";
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
  
 /* var modal = document.getElementById('myModal');
  // Get the button that opens the modal
  var btn = document.getElementById("myBtn").addEventListener("click", addCity);

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  // When the user clicks the button, open the modal 
  //btn.onclick = function() {
  modal.style.display = "block";
  //}
  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }*/
}

function deleteCity(cityId) {

  console.log(cityId);


  for (var value in forecastCity) {
    //console.log(forecastCity[value]);
    //console.log(value);
    if (forecastCity[value] == cityId) {
      delete forecastCity[value];
    }
  }

  console.log(forecastCity);
  localStorage.setItem("items", JSON.stringify(forecastCity));
  openCityWindow();
}
