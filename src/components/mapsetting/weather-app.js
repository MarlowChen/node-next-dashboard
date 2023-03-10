import React, { useState, useEffect, useMemo } from 'react';
import WeatherCard from './weather-card';

import useWeatherApi from './useWeatherApi';
import { findLocation } from './utils';
import { Button } from '@mui/material';


const WeatherApp = ({ position, lat, lon, changeLocation, map }) => {
    const [weatherElement, fetchData] = useWeatherApi(lat, lon, changeLocation, map);
    return (

        <>
            <WeatherCard
                position={position}
                weatherElement={weatherElement}

                fetchData={fetchData}

            />


        </>

    );
};

export default WeatherApp;