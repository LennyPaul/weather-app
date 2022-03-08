const template = document.querySelector("template");
const content = document.querySelector(".content");

// FONCTIONS

// Recuperer Date
const getViewDate = (timestamp) => {
  let date = new Date(timestamp * 1000);
  let options = {
    weekday: "long",
    month: "long",
    day: "2-digit",
  };
  let res = date.toLocaleDateString("fr-FR", options);
  return res;
};

// Recuperer Heure
const getViewTime = (timestamp) => {
  let date = new Date(timestamp * 1000);
  let res = date.getHours();
  return res;
};

//Recuperer icon
const getIcon = (code) => {
  switch (code) {
    case "01d":
    case "01n":
      return "img/01.svg";
      break;

    case "02d":
    case "02n":
      return "img/02.svg";
      break;

    case "03d":
    case "03n":
    case "04n":
    case "04d":
      return "img/03.svg";
      break;

    case "09d":
    case "09n":
      return "img/09.svg";
      break;

    case "10d":
    case "10n":
      return "img/10.svg";
      break;

    case "11d":
    case "11n":
      return "img/11.svg";
      break;

    case "13d":
    case "13n":
      return "img/13.svg";
      break;

    case "50n":
    case "50d":
      return "img/50.svg";
      break;
  }
};

const getWeatherOf = async (position) => {
  try {
    const { latitude, longitude } = position.coords;

    allPromise = Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&units=metric&lang=fr&appid=63a254c550ecf376a6058cfb2b6edaa1`
      ),

      fetch(
        `https://api-adresse.data.gouv.fr/reverse/?lon=${longitude}&lat=${latitude}`
      ),
    ]);

    const [weatherResult, cityResult] = await allPromise;
    const weatherData = await weatherResult.json();
    const cityData = await cityResult.json();

    updateUI(weatherData, cityData);
  } catch (error) {
    console.error("Erreur dans la promise ->", error);
  }
};

const updateUI = (data, cityData) => {
  const newContent = template.content.cloneNode(true);

  //Mofification Lieux
  console.log(newContent.querySelector(".locate"));
  newContent.querySelector(".locate").textContent =
    cityData.features[0].properties.city;

  // Affichage Meteo Actuel
  console.log(newContent.querySelector("h2"));
  newContent.querySelector("h2").textContent =
    Math.round(data.current.temp) + "°C";

  newContent.querySelector(".today > img").src = `${getIcon(
    data.current.weather[0].icon
  )}`;
  console.log(data.hourly[1].weather[0].icon);
  console.log(getIcon("01n"));

  // Affichage Meteo Aujourd'hui
  newContent.querySelector(".date").textContent = getViewDate(data.current.dt);

  const hours = newContent.querySelectorAll(".hours > figure");
  let count = 1;
  for (const figure of hours) {
    const tmp = `<p class="HourCurrentDay">${getViewTime(
      data.hourly[count].dt
    )}H</p> <img src="${getIcon(
      data.hourly[count].weather[0].icon
    )}" alt="" /> <p class="TmpCurrentDay">${Math.round(
      data.hourly[count].temp
    )}°C</p>`;
    figure.innerHTML = tmp;
    count++;
  }

  // Affichage Meteo Semaine
  const days = newContent.querySelectorAll(".days > figure");
  console.log(getViewDate(data.daily[1].dt));
  console.log(days);
  let countD = 1;
  for (const id of days) {
    const tmp = ` 
    <span class="dayDays">${getViewDate(data.daily[countD].dt)}</span> 
    <img src="img/thermo.svg" alt="">
    <span>${Math.round(data.daily[countD].temp.day)}°C</span>
    <img class="icon" src="${getIcon(
      data.daily[countD].weather[0].icon
    )}" alt="">
 `;
    id.innerHTML = tmp;
    countD++;
  }

  document.querySelector("header").style.height = "auto";
  content.replaceChildren(newContent);
};

navigator.geolocation.getCurrentPosition(getWeatherOf, (error) => {
  alert("Impossbile de récupérer votre localisation");
});
