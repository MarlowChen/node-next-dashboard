import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import styled from '@emotion/styled';
import CloudyIcon from '../../../public/images/weather/cloudy.svg';
import AirFlowIcon from '../../../public/images/weather/airFlow.svg';
import RainIcon from '../../../public/images/weather/rain.svg';
import RedoIcon from '../../../public/images/weather/redo.svg';
import { WeatherIcon } from './weather-Icon';
import LoadingIcon from '../../../public/images/weather/loading.svg';
// import RefreshIcon from '../../../public/images/weather/Refresh.svg';
import { IconButton } from '@mui/material';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import Grow from '@mui/material/Grow';
import CloudIcon from '@mui/icons-material/Cloud';
import Draggable from 'react-draggable';
import { Box } from '@mui/system';

const WeatherCardWrapper = styled.div`
  position: relative;
  min-width: 285px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
  background: #ffffffb3;

`;

const Location = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 10px;
`;

const Description = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 10px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 36px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 14x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 10px;
  svg {
    zoom: .2;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 14x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  svg {
    zoom: .17;
    height: auto;
    margin-right: 30px;
  }
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({ theme }) => theme.textColor};
  svg {
    margin-left: 70px;
    zoom: .17;
    /* width: 15px;
    height: 15px; */
    cursor: pointer;
    animation: rotate infinite 1.5s linear;
    animation-duration: ${({ isLoading }) => (isLoading ? '1.5s' : '0s')};
  }
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;


const WeatherCard = (props) => {
  const weatherRef = useRef();
  const { position, weatherElement, moment, fetchData, cityName } = props;
  const {
    weatherIcon,
    locationName,
    observationTime,
    temperature,
    windSpeed,
    description,
    weatherCode,
    rainPossibility,
    comfortability,
    isLoading,
  } = weatherElement;

  const [checked, setChecked] = useState(true);
  const [isClick, setIsClick] = useState(true);
  const [showWeather, setShowWeather] = useState(true);
  const [boxPos, setBoxPos] = useState({ top: 10, left: 10 });

  useEffect(() => {
    switch (position) {
      case "LEFT-TOP": setBoxPos({ top: 10, left: 30 }); break;
      case "RIGHT-TOP": setBoxPos({ top: 10, right: 30 }); break;
      case "LEFT-BOTTOM": setBoxPos({ bottom: 10, left: 30 }); break;
      case "RIGHT-BOTTOM": setBoxPos({ bottom: 10, right: 30 }); break;
    }
  }, [position])

  const handleChange = (e) => {
    if (!isClick) {
      return;
    }
    if (!checked) {
      setShowWeather(true)
    }
    console.log(e)
    setChecked((prev) => !prev);


  };
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

  const onStart = (e) => {
    setDragStartPos({ x: e.screenX, y: e.screenY });
  };

  const onStop = (e) => {
    const dragX = Math.abs(dragStartPos.x - e.screenX);
    const dragY = Math.abs(dragStartPos.y - e.screenY);

    if (dragX < 1 && dragY < 1) {

      console.log(`click with drag of ${dragX}, ${dragY}`);
      console.log(e)
      setIsClick(true)
    } else {
      console.log(`click cancelled with drag of ${dragX}, ${dragY}`);
      setIsClick(false)
    }
  };

  return (
    <Draggable
      ref={weatherRef}
      onStart={onStart}
      onStop={onStop}
    >
      <Box sx={{ ...boxPos, minWidth: 285, position: "absolute", zIndex: 999 }}>
        {!checked && <IconButton sx={{ position: "absolute", top: 1, right: 1, background: "white" }}
          onClick={handleChange}
        >
          <CloudIcon />
        </IconButton>}
        {showWeather && <Grow
          in={checked}
          style={{ transformOrigin: 'top right' }}
          onExited={(e) => setShowWeather(!showWeather)}
          {...(checked ? { timeout: 1000 } : {})}
        >
          <WeatherCardWrapper

          >
            <IconButton sx={{ position: "absolute", top: 1, right: 1 }}
              onClick={handleChange}
            >
              <HorizontalRuleIcon />
            </IconButton>
            <Location>{locationName}</Location>
            <Description>
              {description} {comfortability}
            </Description>
            <CurrentWeather>
              <Temperature>
                {Number(temperature).toFixed(2)} <Celsius>°C</Celsius>
              </Temperature>
              <img alt={weatherIcon} src={`http://openweathermap.org/img/wn/${weatherIcon}@2x.png`} />
              {/* <WeatherIcon
                weatherCode={weatherCode}
                moment={moment || 'day'}
              /> */}
            </CurrentWeather>
            <AirFlow>
              <AirFlowIcon />
              {windSpeed} m/h
            </AirFlow>
            <Rain>
              <RainIcon />
              {Math.round(rainPossibility)} %
            </Rain>
            <Refresh onClick={fetchData} isLoading={isLoading}>
              最後觀測時間：
              {new Intl.DateTimeFormat('zh-TW', {
                hour: 'numeric',
                minute: 'numeric',
              }).format(dayjs(observationTime))}{' '}
              <LoadingIcon />
            </Refresh>
          </WeatherCardWrapper>
        </Grow>}
      </Box>
    </Draggable>
  );
};

export default WeatherCard;