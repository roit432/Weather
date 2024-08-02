const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const errorContainer = document.querySelector('.errorMsg');
const errorMsg = document.querySelector("[data-errorMsg]");

let currrentTab = userTab;
const API_KEY = `1cd72b43cca6e999256a455906e2c5b1`;
currrentTab.classList.add("current-tab");

// initially show the access container so 
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currrentTab){
        currrentTab.classList.remove("current-tab");
        currrentTab = clickedTab;
        currrentTab.classList.add("current-tab");

        errorContainer.classList.remove("active");
        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // search weather wale section me ni h
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // call for the coords for weather from the device storage
            getfromSessionStorage();
        }
    }
}

function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    errorContainer.classList.remove("active");

    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}


async function fetchUserWeatherInfo(coordinates) { 
    const {lat, lon} = coordinates;

    // make the access container invisible
    grantAccessContainer.classList.remove("active");
    errorContainer.classList.remove("active");

    // make the loader visible
    loadingScreen.classList.add("active");


    // make the API CALL  
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        loadingScreen.classList.remove("active");
        // userInfoContainer.classList.add("active");
        // renderWeatherInfo(data);

        if(data.cod === '404'){
            errorContainer.classList.add("active");
            errorMsg.innerText = "City Not Found!";
        }
        else{
            errorContainer.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        }
    }
    catch(err){
        loadingScreen.classList.remove("active");
        console.log(err);
    }
}

function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDescription]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // use of optional chaining
    /* The optional chaining (?.) operator accesses an object's property or calls a function. If the object accessed or function called using this operator is undefined or null, the expression short circuits and evaluates to undefined instead of throwing an error. */

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/56x42/${weatherInfo?.sys?.country.toLowerCase()}.png`
    desc.innerText = weatherInfo?.weather[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather[0]?.icon}.png`;
    temp.innerText = weatherInfo?.main?.temp + " °C";
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = weatherInfo?.clouds?.all;
}

userTab.addEventListener('click', () => {
    switchTab(userTab);
});

searchTab.addEventListener('click', () => {
    switchTab(searchTab);
})

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener('click', () => {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Location can't be fetched");
    }
});

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let cityName = searchInput.value;
    console.log(cityName);

    if(cityName === ""){
        return;
    }
    else{
        fetchSearchWeather(cityName);
    }
});


async function fetchSearchWeather(city){
    loadingScreen.classList.add("active");
    errorContainer.classList.remove("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const respone = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await respone.json();
        console.log("Data", data);
        loadingScreen.classList.remove("active");

        if(data.cod === '404'){
            errorContainer.classList.add("active");
            errorMsg.innerText = "City Not Found!";
        }
        else{
            errorContainer.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        }


    } catch (err) {
        loadingScreen.classList.remove("active");
        
        console.log(err);
    }
}











































// const API_KEY = "1cd72b43cca6e999256a455906e2c5b1";

// async function fetchWeatherDetails() {

//     try {
//         let cityname = "kanpur";
    
//         let weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${API_KEY}&units=metric`);
//         let response = await weather.json();
    
//         console.log(response);
//         console.log(response.main.temp + "°C");

//         // let newPara = document.createElement('p');
//         // newPara.textContent = response.main.temp  + " °C";
//         // document.body.appendChild(newPara);

//         // call the function to show weather on UI
//         renderWeather(response);

//     } catch (error) {
//         console.log(error);
//     }

// } 