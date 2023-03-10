import { useRouter } from 'next/router'
import Head from 'next/head';
import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import { DashboardLayout } from 'src/components/dashboard-layout';
import { useEffect, useState } from 'react';
import { publicRequest } from 'src/utils/requestMethods';
import { alertObj } from 'src/components/commonSnackbar';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { MapSettingInfo } from 'src/components/mapsetting/map-setting-info';



const MapSetting = () => {
    const router = useRouter()
    const [isEdit, setIsEdit] = useState(false);
    const defulatMapSetting = {
        public_map_zoom: 8,
        public_map_pos: "23.53375820682293, 120.85510253906251",
        private_map_zoom: 8,
        privete_map_pos: "23.53375820682293, 120.85510253906251",
        weather_pos: "",
        map_name: "",
        camera_name_view: false,
        sys_time_view: false,
    }
    const defaultYup = {
        public_map_zoom: Yup
            .number()
            .max(100)
            .required(
                '圖資公開版比例必須填寫'),
        public_map_pos: Yup
            .string()
            .max(255)
            .test("public_map_pos", function (value) {

                if (!value) {
                    return true;
                }
                try {

                    const values = value.split(",");
                    if (values.length !== 2) {
                        throw ("座標長度錯誤")
                    }
                    let pattern = new RegExp(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
                    if (!pattern.test(value)) {
                        throw ("座標格式錯誤")
                    }
                } catch (err) {
                    return this.createError({
                        message: `座標格式錯誤`,
                        path: 'public_map_pos', // Fieldname
                    })

                }

                return true;
            })
            .required(
                '圖資公開版位置必須填寫')
        ,
        private_map_zoom: Yup
            .number()
            .max(100)
            .required(
                '圖資管理版比例必須填寫'),
        private_map_pos: Yup
            .string()
            .max(255)
            .test("private_map_pos", function (value) {

                if (!value) {
                    return true;
                }
                try {

                    const values = value.split(",");
                    if (values.length !== 2) {
                        throw ("座標長度錯誤")
                    }
                    let pattern = new RegExp(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
                    if (!pattern.test(value)) {
                        throw ("座標格式錯誤")
                    }
                } catch (err) {
                    return this.createError({
                        message: `座標格式錯誤`,
                        path: 'private_map_pos', // Fieldname
                    })

                }

                return true;
            })
            .required(
                '圖資管理版位置必須填寫')

    }


    const [landmarkMapSetting, setMapSetting] = useState(defulatMapSetting);
    const [landmarkYup, setLandmarkYup] = useState(defaultYup);

    useEffect(() => {
        initSetting();
    }, [])

    const initSetting = async () => {
        await publicRequest().get(`/mapsettings/system`).then(async (res) => {
            const data = res.data;
            console.log(data)

            saveMapSetting.setValues({
                ...data,
                public_map_pos: `${data.public_map_lat}, ${data.public_map_lng}`,
                private_map_pos: `${data.private_map_lat}, ${data.private_map_lng}`
            })
        }).catch(err => {
            console.log(err)
            alertObj.show("初始化排程設定失敗", "error")
        })

    }

    const saveMapSetting = useFormik({
        initialValues: landmarkMapSetting,
        validationSchema: Yup.object(landmarkYup),
        onSubmit: async (data) => {
            // router.push('/');
            console.log(data)
            const publicPos = data.public_map_pos.split(",")
            const privatePos = data.private_map_pos.split(",")
            const saveData = {
                ...data, public_map_lat: publicPos[0],
                public_map_lng: publicPos[1].trim(),
                private_map_lat: privatePos[0],
                private_map_lng: privatePos[1].trim()
            }
            await publicRequest().put(`/mapsettings/1`, saveData).then(res => {
                alertObj.show("存檔成功", "info")
                setIsEdit(false);
                // initUser();
                // setOpen(false)
                //router.push("/manage/storage")
            }).catch(err => {
                alertObj.show("存檔失敗", "error")
            })
        }
    });


    const handleSaveSchedule = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        saveMapSetting.submitForm()

    }
    return (
        <>
            <Head>
                <title>
                    圖資設定 | M-Demo
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",

                    }}>
                        <Typography
                            sx={{ mb: 3 }}
                            variant="h4"
                        >
                            圖資設定
                        </Typography>

                        {!isEdit && <Button variant="contained" onClick={() => setIsEdit(true)}>編輯</Button>}
                        {isEdit && <Button type="submit" form="saveMapSettingForm" variant="contained">存檔</Button>}
                    </Box>
                    <form id="saveMapSettingForm" onSubmit={handleSaveSchedule}>
                        <Grid
                            container
                            spacing={3}
                        >
                            <Grid
                                item
                                lg={12}
                                md={12}
                                xs={12}
                            >
                                <MapSettingInfo isEdit={isEdit} mapSetting={saveMapSetting} />
                            </Grid>


                        </Grid>
                    </form>
                </Container>
            </Box>
        </>
    )
};


MapSetting.getLayout = (page) => {
    return (
        <DashboardLayout>
            {page}
        </DashboardLayout>
    );
}



export default MapSetting;
