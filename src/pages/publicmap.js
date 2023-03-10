import { Box, Card, CardContent, Container, Paper, Typography } from '@mui/material';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import Map from '../components/Map';
import { publicRequest } from 'src/utils/requestMethods';
import { alertObj } from 'src/components/commonSnackbar';
import WeatherApp from 'src/components/mapsetting/weather-app';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import SimpleBackdrop from 'src/components/backdrop';
import MapSidebarTransition, { mapNameStyle } from 'src/components/landmarkmap/mapSidebarTransition';


const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  bottom: 8,
  left: 'calc(50% - 15px)',
  cursor: "pointer",
  zIndex: 1001
}));

const PublicMap = () => {

  const [selectLandmark, setSelectLandmark] = useState();
  const [open, setOpen] = useState(false);
  const mapRef = useRef();
  const [maker, setMaker] = useState([]);
  const [openMapName, setOpenMapName] = useState(true);

  const [mapSetting, setMapSetting] = useState();
  const [mapContainer, setMapContainer] = useState(null);
  let time = new Date().toLocaleTimeString();
  let [currentTime, changeTime] = useState(time);
  const [textLength, setTextLength] = useState(1);

  function checkTime() {
    time = new Date().toLocaleTimeString();
    changeTime(time);
  }
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        //console.log("Delayed for 1 second.");
        checkTime();
      }, 1000)
    }
  }, [currentTime, open])


  useEffect(() => {

    initMap();
    initSetting();
  }, [])


  const initSetting = async () => {
    await publicRequest().get(`/mapsettings/system`).then(async (res) => {
      const data = res.data;

      if (data) {
        setTextLength(data.map_name && data.map_name.length)
        setMapSetting(data)
      }

    }).catch(err => {
      console.log(err)
      alertObj.show("取得基本設定失敗", "error")
    })

  }


  const initMap = async () => {


    const results = await publicRequest().get(`/landmark/public`)
    if (results && results.data) {
      setMaker(results.data.filter(item => !item.maintain));
    }
  }

  const resetPos = (map) => {

    if (!map) {
      return;
    }

    setMapSetting({ ...mapSetting, public_map_lat: map.getCenter().lat, public_map_lng: map.getCenter().lng })

  }

  const handleChangeLocation = async (map) => {

    if (!map) {
      return;
    }
    await resetPos(map);

  }

  if (!mapSetting) {
    return <SimpleBackdrop />
  }


  return (
    <>
      <Head>
        <title>
          Dashboard | M-Demo
        </title>
      </Head>
      <Container maxWidth={false} sx={{
        width: "100%",
        height: "100vh",
        "&.MuiContainer-root": {
          p: 0
        }
      }} >


        {mapSetting.weather_pos && <WeatherApp
          lat={mapSetting.public_map_lat}
          lon={mapSetting.public_map_lng}
          position={mapSetting.weather_pos}
          changeLocation={(map) => handleChangeLocation(map)}
          map={mapContainer}
        />}

        {mapSetting.map_name && <MapSidebarTransition
          textLength={textLength}
          in={openMapName}
        >
          <Paper sx={{
            ...mapNameStyle, position: "absolute",

            width: "100%", height: "100%",
            fontSize: "25px",
            fontWeight: 900,

            borderRadius: "0 0 8px 8px",
            whiteSpace: "nowrap"
          }}>
            <Typography variant="h5">{openMapName && mapSetting.map_name}</Typography>
          </Paper>
          <Puller onClick={async () => {
            resetPos(mapContainer)
            setOpenMapName(!openMapName)
          }} />
        </MapSidebarTransition>}
        <Box sx={{
          width: "100%",
          height: "100%"
        }}>


          <Map ref={mapRef} weatherpos={mapSetting.weather_pos} style={{ width: "100%", height: "100%" }}
            getContainer={(map) => setMapContainer(map)}
            zoomControl={false}
            center={{ lat: mapSetting.public_map_lat, lng: mapSetting.public_map_lng }}
            position={{ lat: mapSetting.public_map_lat, lng: mapSetting.public_map_lng }}
            zoom={mapSetting.public_map_zoom} isPublic={true} >
            {({ TileLayer, Marker, Popup, createMarkGroup, useMapEvents }) => {

              return (
                <>
                  <TileLayer
                    url={`${window.location.origin.replace(":3001", ":3002")}/tile/{z}/{x}/{y}.png`}
                  />
                  {createMarkGroup(maker.map((each, index) => {
                    function MarkerComponent({ landmark, index, position }) {

                      return <Marker key={`marker${index}`} position={position}>

                      </Marker>;
                    }
                    return (<MarkerComponent landmark={each} index={index} position={[each.lat, each.lng]} />)
                  }))}


                </>
              )
            }}
          </Map>
        </Box>
      </Container>
    </>
  )
};




export default PublicMap;
