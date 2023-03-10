import { Backdrop, Box, Chip, Paper, Typography } from '@mui/material';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import Map from '../Map';
import useResizeObserver from '@react-hook/resize-observer'
import MapSidebarTransition, { mapNameStyle } from './mapSidebarTransition';
import WeatherApp from '../mapsetting/weather-app';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const canUseDOM = !!(
    typeof window !== 'undefined' &&
    typeof window.document !== 'undefined' &&
    typeof window.document.createElement !== 'undefined'
);

const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;

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

const useSize = (target) => {
    const [size, setSize] = useState()

    useIsomorphicLayoutEffect(() => {
        if (!target.current) {
            return;
        }
        setSize(target.current.getBoundingClientRect())
    }, [target])

    // Where the magic happens
    useResizeObserver(target, (entry) => setSize(entry.contentRect))
    return size
}

const LandmarkMap = (props) => {


    const { landmarks, selectLandmark, mapSetting, setMapSetting, textLength } = props;
    const [open, setOpen] = useState(false);
    const mapRef = useRef();
    const [maker, setMaker] = useState(landmarks);
    const [mapContainer, setMapContainer] = useState(null);
    const [openMapName, setOpenMapName] = useState(true);

    let time = new Date().toLocaleTimeString();
    let [currentTime, changeTime] = useState(time);


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
        setMaker(landmarks);

    }, [landmarks])



    useEffect(() => {
        if (selectLandmark && selectLandmark.lat && selectLandmark.lng && mapContainer) {
            mapContainer.panTo({ lat: selectLandmark.lat, lng: selectLandmark.lng })
        }

    }, [selectLandmark])

    const resetPos = (map) => {

        if (!map) {
            return;
        }
        setMapSetting({ ...mapSetting, private_map_lat: map.getCenter().lat, private_map_lng: map.getCenter().lng })


    }
    const test = useRef();
    const size = useSize(test);

    useEffect(() => {
        if (size && size.width && mapContainer) {
            resetPos(mapContainer);
        }
    }, [size])

    const handleChangeLocation = async (map) => {

        if (!map) {
            return;
        }
        await resetPos(map);
        //await resetLocation();
    }


    const popupContent = {
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        with: "120px",
        alignItems: "center"
    };


    if (!mapSetting) {
        return <Backdrop open={true} />
    }
    return (
        <>
            <Box
                ref={test}
                sx={{
                    width: "100%",
                    height: "100%"
                }}>

                {mapSetting.weather_pos && <WeatherApp
                    lat={mapSetting.private_map_lat}
                    lon={mapSetting.private_map_lng}
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
                    <Puller onClick={() => {
                        resetPos(mapContainer)
                        setOpenMapName(!openMapName)
                    }} />
                </MapSidebarTransition>}


                <Map ref={mapRef} zoomControl={false} style={{ width: "100%", height: "100%", transition: "all 200ms" }}
                    getContainer={(map) => setMapContainer(map)}
                    center={{ lat: mapSetting.private_map_lat, lng: mapSetting.private_map_lng }}
                    position={{ lat: mapSetting.private_map_lat, lng: mapSetting.private_map_lng }}
                    zoom={mapSetting.private_map_zoom}
                    maker={maker}
                >
                    {({ TileLayer, Marker, Popup, useMapEvents, createMarkGroup, ...others }) => {

                        return (
                            <>
                                <TileLayer
                                    url={`${window.location.origin.replace(":3001", ":3002")}/tile/{z}/{x}/{y}.png`}
                                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                                />

                                {createMarkGroup(maker.map((each, index) => {
                                    function MarkerComponent({ landmark, index, position }) {

                                        return <Marker key={`marker${index}`} position={position}
                                        >
                                            <Popup >
                                                <div style={popupContent}>
                                                    <div>
                                                        {!landmark.maintain  && <Chip label="正常" color="primary" />}
                                                        {landmark.maintain && <Chip label="維護" color="primary" />}
                                                    </div>
                                                </div>
                                            </Popup>
                                        </Marker>;
                                    }
                                    return (<MarkerComponent key={`marker-${index}`} landmark={each} index={index} position={[each.lat, each.lng]} />)
                                }))}

                            </>
                        )
                    }}
                </Map>
            </Box>

        </>
    )
};




export default LandmarkMap;
