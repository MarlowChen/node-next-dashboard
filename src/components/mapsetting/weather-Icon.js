import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import DayThunderstorm from '../../../public/images/weather/day-thunderstorm.svg';
import DayClear from '../../../public/images/weather/day-clear.svg';
import DayCloudyFog from '../../../public/images/weather/day-cloudy-fog.svg';
import DayCloudy from '../../../public/images/weather/day-cloudy.svg';
import DayFog from '../../../public/images/weather/day-fog.svg';
import DayPartiallyClearWithRain from '../../../public/images/weather/day-partially-clear-with-rain.svg';
import DaySnowing from '../../../public/images/weather/day-snowing.svg';
import NightThunderstorm from '../../../public/images/weather/night-thunderstorm.svg';
import NightClear from '../../../public/images/weather/night-clear.svg';
import NightCloudyFog from '../../../public/images/weather/night-cloudy-fog.svg';
import NightCloudy from '../../../public/images/weather/night-cloudy.svg';
import NightFog from '../../../public/images/weather/night-fog.svg';
import NightPartiallyClearWithRain from '../../../public/images/weather/night-partially-clear-with-rain.svg';
import NightSnowing from '../../../public/images/weather/night-snowing.svg';

const weatherTypes = {
    isThunderstorm: [15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41],
    isClear: [1],
    isCloudyFog: [25, 26, 27, 28],
    isCloudy: [2, 3, 4, 5, 6, 7],
    isFog: [24],
    isPartiallyClearWithRain: [
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        19,
        20,
        29,
        30,
        31,
        32,
        38,
        39,
    ],
    isSnowing: [23, 37, 42],
};

const weatherIcons = {
    day: {
        isThunderstorm: <DayThunderstorm />,
        isClear: <DayClear />,
        isCloudyFog: <DayCloudyFog />,
        isCloudy: <DayCloudy />,
        isFog: <DayFog />,
        isPartiallyClearWithRain: <DayPartiallyClearWithRain />,
        isSnowing: <DaySnowing />,
    },
    night: {
        isThunderstorm: <NightThunderstorm />,
        isClear: <NightClear />,
        isCloudyFog: <NightCloudyFog />,
        isCloudy: <NightCloudy />,
        isFog: <NightFog />,
        isPartiallyClearWithRain: <NightPartiallyClearWithRain />,
        isSnowing: <NightSnowing />,
    },
};

const IconContainer = styled.div`
  flex-basis: 30%;
  zoom: .6;
  svg {
    max-height: 110px;
  }
`;

const weatherCode2Type = (weatherCode) => {
    const [weatherType] =
        Object.entries(weatherTypes).find(([weatherType, weatherCodes]) =>
            weatherCodes.includes(Number(weatherCode))
        ) || [];

    return weatherType;
};

// const WeatherIcon = ({ weatherCode, moment }) => {
//     const weatherType = useMemo(() => weatherCode2Type(weatherCode), [
//         weatherCode,
//     ]);
//     const weatherIcon = weatherIcons[moment][weatherType];

//     return <IconContainer>{weatherIcon}</IconContainer>;
// };

// export default WeatherIcon;


export const WeatherIcon = ({ weatherCode, moment, ...props }) => {
    const weatherType = useMemo(() => weatherCode2Type(weatherCode), [
        weatherCode,
    ]);
    const weatherIcon = weatherIcons[moment][weatherType];

    return <IconContainer>{weatherIcon}</IconContainer>;
}