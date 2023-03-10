import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import Map from '../components/Map';
import { publicRequest } from 'src/utils/requestMethods';
import { alertObj } from 'src/components/commonSnackbar';
import Monitor from 'src/components/monitor';
import { DashboardLayout } from 'src/components/dashboard-layout';
import { handleAuthSSR } from 'src/utils/auth';
import LandmarkMap from 'src/components/landmarkmap';
import axios from "axios";
const DEFAULT_CENTER = [23.996282, 120.744723]

const MonitorManage = () => {
  const [landmarks, setLandmarks] = useState([]);
  const [selectLandmark, setSelectLandmark] = useState(null);
  const [landmarkStatus, setLandmarkStatus] = useState({
    livePercent: 0,
    live: "0/0",
    maintainPercent: 0,
    maintain: "0/0",
    offPercent: 0,
    off: "0/0"
  })
  const defulatMapSetting = {
    public_map_zoom: 8,
    public_map_lat: "23.53375820682293",
    public_map_lng: "120.85510253906251",
    private_map_zoom: 8,
    private_map_lat: "23.53375820682293",
    private_map_lng: "120.85510253906251",
    weather_pos: "",
    map_name: "",
    camera_name_view: false,
    sys_time_view: false,
  }
  const [mapSetting, setMapSetting] = useState();
  const [textLength, setTextLength] = useState(1);


  useEffect(() => {
    initLandmark();
    initSetting();
  }, [])

  useEffect(() => {
    if (Array.isArray(landmarks) && landmarks.length > 0) {
      let fixCount = 0;
      let liveCount = 0;

      landmarks.forEach(item => {
        if (item.maintain) fixCount++;
        if (!item.maintain) {
          liveCount++;
          item.isLive = true;
        };

      })

      if (landmarks.length > 0) {
        const data = {
          livePercent: Math.floor((liveCount / landmarks.length) * 100),
          live: `${liveCount}/${landmarks.length}`,
          maintainPercent: Math.floor((fixCount / landmarks.length) * 100),
          maintain: `${fixCount}/${landmarks.length}`,
          offPercent: Math.floor(((landmarks.length - liveCount) / landmarks.length) * 100),
          off: `${landmarks.length - liveCount}/${landmarks.length}`,
        }
        //setCameraStatus(data);
      }

    }
  }, [landmarks])


  const initLandmark = async () => {

    await publicRequest().get("/landmark").then(res => {
      setLandmarks(res.data.sort((a, b) => a.index - b.index));
    }).catch(err => {
      alertObj.show("查詢地標失敗", "error")
    })
  }

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

  return (
    <>
      <Head>
        <title>
          地標管理版 | M-Demo
        </title>
      </Head>
      <Monitor landmarks={landmarks} selectLandmark={(landmark) => setSelectLandmark(landmark)} landmarkStatus={landmarkStatus} >
        <LandmarkMap landmarks={landmarks} selectLandmark={selectLandmark}
          mapSetting={mapSetting}
          setMapSetting={setMapSetting}
          textLength={textLength}
        />
      </Monitor>

    </>
  )
};


MonitorManage.getLayout = (page) => {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
}

export default MonitorManage;

