const getWeatherOf = async (position) => {
  try {
    const { latitude, longitude } = position.coords;

    res = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&units=metric&lang=fr&appid=63a254c550ecf376a6058cfb2b6edaa1`
    );
    try {
      resL = await fetch(
        `https://api-adresse.data.gouv.fr/reverse/?lon=${longitude}&lat=${latitude}`
      );
      const userLocate = await resL.json();
      console.log(userLocate.features[0].properties.city);
      document.querySelector(".locate").textContent = userLocate.features[0].properties.city;
      
    } catch (error) {
      console.error("Erreur dans le getWeather()=", error);
    }

    const data = await res.json();
    console.log(data);

    updateUI(data);
  } catch (error) {
    console.error("Erreur dans le getWeather()=", error);
  }
};

const updateUI = (data) => {
  document.querySelector("h2").textContent =
  Math.round(data.current.temp) + "°C";

document.querySelector(".today > img").src = `${getIcon(data.current.weather[0].icon)}`;
console.log(data.hourly[1].weather[0].icon)
console.log(getIcon("01n"))



  document.querySelector(".date").textContent = getViewDate(data.current.dt);

  const hours = document.querySelectorAll(".hours > figure");
  let count = 1;
  for (const id of hours) {
    const tmp = `<p class="HourCurrentDay">${getViewTime(
      data.hourly[count].dt
    )}H</p> <img src="${getIcon(data.hourly[count].weather[0].icon)}" alt="" /> <p class="TmpCurrentDay">${Math.round(
      data.hourly[count].temp
    )}°C</p>`;
    id.innerHTML = tmp;
    count++;
  }
  const days = document.querySelectorAll(".days > figure");
  console.log(getViewDate(data.daily[1].dt));
  console.log(days);
  let countD = 1;
  for (const id of days) {
    const tmp = ` 
    <span class="dayDays">${getViewDate(data.daily[countD].dt)}</span> 
    <img src="img/thermo.svg" alt="">
    <span>${Math.round(
      data.daily[countD].temp.day)}°C</span>
    <img class="icon" src="${getIcon(data.daily[countD].weather[0].icon)}" alt="">
 `;
    id.innerHTML = tmp;
    countD++;
  }
};

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

const getViewTime = (timestamp) => {
  let date = new Date(timestamp * 1000);
  let res = date.getHours();
  return res;
};

const getIcon = (code) => {
  switch (code) {
    case ("01d"):
    case ("01n"):
      return "img/01.svg";
      break;

    case ("02d"):
    case ("02n"):
      return "img/02.svg";
      break;

    case ("03d"):
    case ("03n"):
    case ("04n"):
    case ("04d"): 
      return "img/03.svg";
      break;

    case ("09d"):
    case ("09n"):
      return "img/09.svg";
      break;

    case ("10d"):
    case ("10n"):
      return "img/10.svg";
      break;

    case ("11d"):
    case ("11n"):
      return "img/11.svg";
      break;

    case ("13d"):
    case ("13n"):
      return "img/13.svg";
      break;

    case ("50n"):
    case ("50d"):
      return "img/50.svg";
      break;

  }
};

navigator.geolocation.getCurrentPosition(getWeatherOf);
