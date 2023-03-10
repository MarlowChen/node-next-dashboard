import { useState, useEffect, useCallback } from 'react';
import { alertObj } from '../commonSnackbar';
const authorizationKey = process.env.NEXT_PUBLIC_WEATHER_KEY;


const fetchCurrentWeather = (lat, lon) => {
  try {
    return fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${authorizationKey}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        const locationData = data;
        if (!locationData) {
          return;
        }

        return {
          observationTime: locationData.time.obsTime,
          locationName: locationData.name,
          temperature: locationData.main.temp,
          windSpeed: locationData.wind.speed,
          humid: locationData.humidity,
        };
      }).catch(e => {
        console.log(locationName)
        alertObj.show("載入天氣錯誤", "error")
      });
  } catch (e) {
    console.log(locationName)
    alertObj.show("載入天氣錯誤", "error")
  }
};

const fetchWeatherForecast = (lat, lon) => {


  if (!lat || !lon) {
    return;
  }
  try {
    return fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${authorizationKey}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        const locationData = data;
        if (!locationData || !locationData.list || locationData.list.length == 0) {
          return;
        }

        const weatherDatas = locationData.list.filter(item => new Date(item.dt_txt).getTime() <= new Date().getTime());
        if (weatherDatas.length === 0) {
          return;
        }
        const weather = weatherDatas[weatherDatas.length - 1];
        console.log(locationData)
        return {
          observationTime: weather.dt_txt,
          weatherIcon: weather.weather[0].icon,
          locationName: `${locationData.city.name}`,
          temperature: weather.main.temp,
          windSpeed: weather.wind.speed,
          humid: weather.humidity,
          description: weather.weather[0].description,
          weatherCode: 0,
          rainPossibility: Number(weather.pop) * 100,
          comfortability: "",
        };
      }).catch(e => {
        console.log(e)
        alertObj.show("載入天氣錯誤", "error")
      });
  } catch (e) {
    console.log(e)
    alertObj.show("載入天氣錯誤", "error")
  }
};

const useWeatherApi = (lat, lon, changeLocation, map) => {
  //const { locationName, cityName } = currentLocation;
  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: '',
    weatherIcon: '',
    humid: 0,
    temperature: 0,
    windSpeed: 0,
    description: '',
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: '',
    isLoading: true,
  });

  const fetchData = useCallback(() => {

    const fetchingData = async () => {
      await changeLocation(map);
      const [weatherForecast] = await Promise.all([
        //fetchCurrentWeather(locationName),
        fetchWeatherForecast(lat, lon),
      ]);

      setWeatherElement({
        //...currentWeather,
        ...weatherForecast,
        isLoading: false,
      });
    };

    setWeatherElement((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    fetchingData();
  }, [lat, lon, map]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [weatherElement, fetchData];
};

export default useWeatherApi;
