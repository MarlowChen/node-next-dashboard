import { useEffect, useState } from 'react';
import L from 'leaflet';
import * as ReactLeaflet from 'react-leaflet';
import "leaflet.markercluster";
import 'leaflet/dist/leaflet.css';
import MarkerClusterGroup from "react-leaflet-markercluster";


const MarkerCluster = ({ markers }) => {
  const { map } = useLeaflet();

  useEffect(() => {
    const mcg = new L.markerClusterGroup();
    mcg.clearLayers();
    markers.forEach(({ position, text }) =>
      L.marker(new L.LatLng(position.lat, position.lng), {
        icon: customMarker
      })
        .addTo(mcg)
        .bindPopup(text)
    );

    // optionally center the map around the markers
    // map.fitBounds(mcg.getBounds());
    // // add the marker cluster group to the map
    map.addLayer(mcg);
  }, [markers, map]);

  return null;
};

import styles from './Map.module.css';

// import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
// import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from '../../../public/images/camera.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const { MapContainer, MapConsumer } = ReactLeaflet;

const Map = ({ children, className, position, getContainer, getMarkGroup, isPublic, marker, weatherpos, ...rest }) => {
  const [map, setMap] = useState(null);
  const [mapZoomPos, setMapZoomPos] = useState('topright');
  let mapClassName = styles.map;

  if (className) {
    mapClassName = `${mapClassName} ${className}`;
  }
  useEffect(() => {
    if (weatherpos) {
      changeMapPos(weatherpos)
    }
  }, [weatherpos])


  useEffect(() => {

    (async function init() {

      if (map) {
        L.control.zoom({
          position: mapZoomPos
        }).addTo(map);
        //getContainer(map);

      }

      var markers = new L.markerClusterGroup({
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: false
      });

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: iconRetinaUrl.src,
        iconUrl: iconRetinaUrl.src,
        shadowUrl: shadowUrl.src,
        iconSize: new L.Point(40, 61.6),
      });

    })();
    if (getMarkGroup) getMarkGroup(MarkerCluster)

    //document.getElementsByClassName('leaflet-control-attribution')[0].style.display = 'none';
  }, [map]);

  const handleSetMap = (map) => {
    setMap(map);
    if (getContainer) getContainer(map)
  }

  useEffect(() => {

    if (map) {
      const interval = setInterval(function () {
        map.invalidateSize();
      }, 5);
      return () => clearInterval(interval);
    }
  }, [map])

  const Recenter = ({ lat, lng }) => {
    const map = ReactLeaflet.useMap();

    useEffect(() => {
      map.setView([lat, lng]);
    }, [lat, lng]);
    return null;
  }

  const changeMapPos = (weather_pos) => {
    let pos;
    switch (weather_pos) {
      case "LEFT-TOP": pos = "topright"; break;
      case "RIGHT-TOP": pos = "topleft"; break;
      case "LEFT-BOTTOM": pos = "bottomright"; break;
      case "RIGHT-BOTTOM": pos = "bottomleft"; break;
      default: pos = "bottomright";
    }
    if (mapZoomPos !== pos) {
      setMapZoomPos(pos);
    }

  }

  useEffect(() => {
    console.log(mapZoomPos)
  }, [mapZoomPos])



  const data = "qax";
  return (
    <MapContainer whenCreated={handleSetMap} className={mapClassName} {...rest}>
      <MapConsumer  >
        {(map) => {
          ReactLeaflet.createMarkGroup = function (children) {
            return <MarkerClusterGroup>{children}</MarkerClusterGroup>
          }
          ReactLeaflet.changePosByWeatherPos = function (weather_pos) {
            this.changeMapPos(weather_pos)
          }
          return children(ReactLeaflet, map)
        }}
      </MapConsumer>


      <Recenter lat={position.lat} lng={position.lng} />
    </MapContainer>
  )
}

export default Map;